
export type ResourceKey =
    | { resourceId: string }
    | { groupId: string; key?: string }


export function calculateResourceKey(keyOrMode?: string) {
    if (!keyOrMode || keyOrMode === "$auto") {
        return location.href;
    } else if (keyOrMode === "$path") {
        return `${location.origin}${location.pathname}`;
    }
    return keyOrMode;
}
