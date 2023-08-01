import http from "./http";
import { getFeelbackStore, FeelbackStoreType } from "./store";
import { calculateContentKey, TargetContent } from "./content";


const ENDPOINT = process.env.API_ENDPOINT;

export async function sendFeelback(params: TargetContent & {
    endpoint?: string
    value: any
    metadata?: Record<string, string | number>
    revokable?: boolean
    expireIn?: number
    store?: FeelbackStoreType | "none"
}) {
    const {
        endpoint = ENDPOINT,
        store = "local",
        revokable = true,
        value,
        metadata,
        expireIn = 3600 // 1h
    } = params;

    const target = "contentId" in params
        ? { contentId: params.contentId }
        : { contentSetId: params.contentSetId, key: calculateContentKey(params.key) }

    const storage = store && store !== "none" && getFeelbackStore(store) || undefined;
    const revoke = revokable && storage?.getRevocable(target) || undefined;

    const result = revoke
        ? await http.post(`${endpoint}/feelbacks/edit`, { ...revoke, value })
        : await http.post(`${endpoint}/feelbacks/create`, { ...target, value, context: metadata, revokable });

    storage?.add({
        ...result as any,
        target,
        value,
        expireIn,
    });
}

export async function removeFeelback(options: {
    endpoint?: string
    feelbackId: string
    revokeToken?: string
}) {
    const {
        endpoint = ENDPOINT,
        feelbackId,
    } = options;


    let revokeToken = options.revokeToken;

    const storage = getFeelbackStore();
    if (!revokeToken) {
        const revoke = storage.getRevocable(feelbackId);
        if (!revoke) {
            throw new Error("Cannot revoke feelback");
        }

        revokeToken = revoke.revokeToken;
    }

    await http.post(`${endpoint}/feelbacks/remove`, { feelbackId, revokeToken });

    storage.remove(feelbackId);
}


export async function getFeelbackAggregates(params: TargetContent & {
    endpoint?: string
}) {
    const {
        endpoint = ENDPOINT,
    } = params;

    const target = "contentId" in params
        ? params.contentId
        : { contentSetId: params.contentSetId, key: calculateContentKey(params.key) }

    return await http.get<number[]>(`${endpoint}/feelbacks/getAggregates`, target);
}
