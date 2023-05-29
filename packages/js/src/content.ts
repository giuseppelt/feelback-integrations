
export type TargetContent =
    | { contentId: string }
    | { contentSetId: string; key?: string }


export function calculateContentKey(keyOrMode?: string, url?: string | URL): string {
    if (!keyOrMode || keyOrMode === "$auto") {
        return url?.toString() || (typeof window !== "undefined" ? window.location.href : "/");
    }

    if (keyOrMode === "$path") {
        if (typeof url === "string") url = new URL(url);
        const loc = url || (typeof window !== "undefined" ? window.location : undefined);
        if (!loc) return "/";
        return `${loc.origin}${loc.pathname}`;
    }

    return keyOrMode;
}
