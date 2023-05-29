import { useRef } from "react";
import { getFeelbackAggregates, sendFeelback, TargetContent, removeFeelback, getFeelbackStore } from "@feelback/js";
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

export function useLocalFeelback(content: TargetContent) {
    const context = useFeelbackContext();
    if (context?.store === "none") {
        return;
    }

    const store = getFeelbackStore(context?.store) || undefined;

    return {
        value: store.getValue(content),
        isRevokable: store.isRevokable(content)
    } as const;
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
