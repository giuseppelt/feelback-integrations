
export type TargetContent =
    | { contentId: string }
    | { contentSetId: string; key?: string }


export function calculateContentKey(keyOrMode?: string, url?: string | URL): string {
    if (!keyOrMode || keyOrMode === "$auto") {
        return url?.toString() || location.href;
    }

    if (keyOrMode === "$path") {
        if (typeof url === "string") url = new URL(url);
        const L = url || location;
        return `${L.origin}${L.pathname}`;
    }

    return keyOrMode;
}
