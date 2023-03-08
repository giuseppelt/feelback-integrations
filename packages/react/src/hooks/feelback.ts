import { useEffect, useRef, useState } from "react";
import { getFeelbackAggregates, sendFeelback, TargetContent, calculateContentKey, removeFeelback, getFeelbackStore } from "@feelback/js";
import { useFeelbackContext } from "../components";
import { useAsyncCall } from "./useAsyncCall";


export function useFeelbackAggregates(content: TargetContent, options?: { paused: boolean }) {
    const context = useFeelbackContext();
    const target = useMemoTargetContent(content);

    return useAsyncCall(() => getFeelbackAggregates({
        endpoint: context?.endpoint,
        ...target,
    }), [target], options);
}

export function useSendFeelback(content: TargetContent) {
    const context = useFeelbackContext();
    const target = useMemoTargetContent(content);

    return useAsyncCall((value: any) => sendFeelback({
        endpoint: context?.endpoint,
        store: context?.store,
        ...target,
        value,
    }));
}

export function useRemoveFeelback(content: TargetContent) {
    const context = useFeelbackContext();
    const target = useMemoTargetContent(content);

    return useAsyncCall(async () => {
        if (context?.store === "none") {
            // silently fail, no revoke possible
            return;
        }

        const revoke = getFeelbackStore(context?.store).getRevocable(target);
        if (!revoke) {
            // silently fail, no revoke possible
            return;
        }

        return await removeFeelback({
            endpoint: context?.endpoint,
            feelbackId: revoke.feelbackId,
        });
    });
}

export function useLocalFeelback(resource: TargetContent) {
    const context = useFeelbackContext();
    if (context?.store === "none") {
        return;
    }

    const store = getFeelbackStore(context?.store) || undefined;

    return {
        value: store.getValue(resource),
        isRevokable: store.isRevokable(resource)
    } as const
}

export function useFeelbackResourceId(content: TargetContent, pathListener?: (listener: (url: string) => void) => (() => void)): TargetContent {
    const contentKey = "contentSetId" in content ? content.key : false;
    const [contentId, setContentId] = useState(content);

    useEffect(() => {
        const hasAutoKey = contentKey !== false && (!contentKey || contentKey.startsWith("$"));
        if (hasAutoKey) {
            return pathListener?.(url => setContentId(x => {
                if (!("contentSetId" in x)) return x;
                return {
                    contentSetId: x.contentSetId,
                    key: calculateContentKey(contentKey, url)
                };
            }));
        }
    }, [contentKey, pathListener]);

    return useMemoTargetContent(contentId);
}

function useMemoTargetContent(content: TargetContent): TargetContent {
    const ref = useRef(content);

    if (ref.current !== content) {
        if ("contentId" in ref.current && "contentId" in content) {
            if (ref.current.contentId !== content.contentId) {
                ref.current == content;
            }
        } else if ("contentSetId" in ref.current && "contentSetId" in content) {
            if (ref.current.contentSetId !== content.contentSetId || ref.current.key !== content.key) {
                ref.current = content;
            }
        } else {
            ref.current = content;
        }
    }

    return ref.current;
}
