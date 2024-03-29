import type { TargetContent } from "..";


export function getTarget(target: TargetContent): TargetContent {
    return "contentSetId" in target
        ? {
            contentSetId: target.contentSetId,
            key: target.key,
        }
        : {
            contentId: target.contentId,
        };
}
