import { calculateResourceKey, ResourceKey } from "./utils";


type FeelbackStoreEntry = {
    key: string
    feelbackId: string
    value: any
    expire?: number
    revokeToken?: string
    revokeExpire?: number
}

type FeelbackRevocable = {
    feelbackId: string
    revokeToken: string
}


const STORAGE_KEY = "fbs-store";

function calculateKey(resource: ResourceKey) {
    return "resourceId" in resource
        ? resource.resourceId
        : `${resource.groupId}/${calculateResourceKey(resource.key)}`;
}


class FeelbackStore {
    private storage: Storage;
    private feelbacks: FeelbackStoreEntry[] | undefined = undefined;

    constructor(type: "local" | "session" | "memory") {
        this.storage = localStorage;

        if (type === "session") {
            this.storage = sessionStorage;
        } else if (type === "memory") {
            this.storage = {
                getItem: () => { },
                settItem: () => { },
                clear: () => { },
            } as any
        }

        this.load();
    }

    add(data: {
        resource: ResourceKey
        value: any
        expireIn?: number
        feelbackId: string
        revokable?: { token: string, expireAt: Date | string }
    }) {
        const key = calculateKey(data.resource);
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
        this.storage.removeItem(STORAGE_KEY);
    }

    remove(resource: ResourceKey): void;
    remove(feelbackId: string): void;
    remove(key: ResourceKey | string) {
        const idx = typeof key === "string"
            ? this.feelbacks?.findIndex(x => x.feelbackId === key)
            : (key = calculateKey(key), this.feelbacks?.findIndex(x => x.key === key));

        if (idx !== undefined && idx >= 0) {
            this.feelbacks!.splice(idx, 1);
            this.save();
        }
    }

    getValue(resource: ResourceKey): any | undefined {
        return this.getFeelback(resource)?.value;
    }

    isRevokable(resource: ResourceKey): boolean {
        return !!this.getRevocable(resource);
    }

    getRevocable(resource: ResourceKey): FeelbackRevocable | undefined;
    getRevocable(feelbackId: string): FeelbackRevocable | undefined;
    getRevocable(key: ResourceKey | string): FeelbackRevocable | undefined {
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

    private getFeelback(key: ResourceKey | string) {
        const item = typeof key === "string"
            ? this.feelbacks?.find(x => x.feelbackId === key)
            : (key = calculateKey(key), this.feelbacks?.find(x => x.key === key));

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

export function createFeelbackStore(type?: FeelbackStoreType): FeelbackStore {
    type ??= storeType || "local";

    if (store && storeType === type) {
        return store;
    }

    storeType = type;

    return store = new FeelbackStore(type);
}
