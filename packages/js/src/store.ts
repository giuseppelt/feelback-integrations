import { calculateContentKey, TargetContent } from "./content";


type FeelbackStoreEntry = {
    key: string
    feelbackId: string
    value: unknown
    expire?: number
    revokeToken?: string
    revokeExpire?: number
}

type FeelbackRevocable = {
    feelbackId: string
    revokeToken: string
}


const STORAGE_KEY = "fbs-store";

function calculateLocalKey(target: TargetContent) {
    return "contentId" in target
        ? target.contentId
        : `${target.contentSetId}/${calculateContentKey(target.key)}`;
}


class FeelbackStore {
    private storage: Storage;
    private feelbacks: FeelbackStoreEntry[] | undefined = undefined;

    constructor(type?: FeelbackStoreType) {
        type ??= "local";
        if (typeof window === "undefined") {
            type = "memory";
        }

        if (type === "local") {
            this.storage = window.localStorage;
        } else if (type === "session") {
            this.storage = window.sessionStorage;
        } else {
            const NOOP = (() => { }) as (...args: any) => any
            this.storage = {
                getItem: NOOP,
                setItem: NOOP,
                removeItem: NOOP,
                clear: NOOP,
                key: NOOP,
                length: 0,
            } satisfies Storage
        }

        this.load();
    }

    add(data: {
        target: TargetContent
        value: any
        expireIn?: number
        feelbackId: string
        revokable?: { token: string, expireAt: Date | string }
    }) {
        const key = calculateLocalKey(data.target);
        const idx = (this.feelbacks ??= []).findIndex(x => x.key === key);
        if (idx >= 0) this.feelbacks.splice(idx, 1);

        this.feelbacks.push({
            key,
            value: data.value,
            expire: (data.expireIn && data.expireIn > 0) ? Math.floor(Date.now() / 1000) + data.expireIn : undefined,
            feelbackId: data.feelbackId,
            revokeToken: data.revokable?.token,
            revokeExpire: data.revokable?.expireAt && Math.floor(new Date(data.revokable.expireAt).getTime() / 1000) || undefined,
        });

        this.save();
    }

    clear() {
        this.feelbacks?.splice(0, this.feelbacks.length);
        this.storage.removeItem(STORAGE_KEY);
    }

    remove(target: TargetContent): void;
    remove(feelbackId: string): void;
    remove(key: TargetContent | string) {
        const idx = typeof key === "string"
            ? this.feelbacks?.findIndex(x => x.feelbackId === key)
            : (key = calculateLocalKey(key), this.feelbacks?.findIndex(x => x.key === key));

        if (idx !== undefined && idx >= 0) {
            this.feelbacks!.splice(idx, 1);
            this.save();
        }
    }

    getValue(target: TargetContent): unknown | undefined {
        return this.getFeelback(target)?.value;
    }

    isRevokable(target: TargetContent): boolean {
        return !!this.getRevocable(target);
    }

    getRevocable(target: TargetContent): FeelbackRevocable | undefined;
    getRevocable(feelbackId: string): FeelbackRevocable | undefined;
    getRevocable(key: TargetContent | string): FeelbackRevocable | undefined {
        const entry = this.getFeelback(key);

        if (!entry) return;
        if (!entry.revokeToken) return;
        if (entry.revokeExpire && entry.revokeExpire < Date.now() / 1000) return;

        return { feelbackId: entry.feelbackId, revokeToken: entry.revokeToken };
    }

    private load(refresh?: boolean): void {
        if (this.feelbacks && !refresh) {
            return;
        }

        let entries: FeelbackStoreEntry[];
        try {
            entries = JSON.parse(this.storage.getItem(STORAGE_KEY)!) || [];
        } catch {
            entries = [];
        }

        // remove expired
        this.feelbacks = entries.filter(x => !x.expire || x.expire > Date.now() / 1000);
        if (entries.length !== this.feelbacks.length) {
            this.save();
        }
    }

    private save() {
        try {
            this.storage.setItem(STORAGE_KEY, JSON.stringify(this.feelbacks));
        } catch { }
    }

    private getFeelback(key: TargetContent | string) {
        const item = typeof key === "string"
            ? this.feelbacks?.find(x => x.feelbackId === key)
            : (key = calculateLocalKey(key), this.feelbacks?.find(x => x.key === key));

        if (item && item.expire && item.expire < Date.now() / 1000) {
            this.remove(item.feelbackId);
            return;
        }

        return item;
    }
}



let store: FeelbackStore
let storeType: FeelbackStoreType;

export type FeelbackStoreType =
    | "local"
    | "session"
    | "memory"

export function getFeelbackStore(type?: FeelbackStoreType): FeelbackStore {
    type ??= storeType || "local";

    if (store && storeType === type) {
        return store;
    }

    storeType = type;

    return store = new FeelbackStore(type);
}

export function getLocalFeelbackValue(target: TargetContent, store?: FeelbackStoreType): unknown {
    return getFeelbackStore(store).getValue(target);
}
