import type { FeelbackValueDefinition } from "..";
import iconHappy from "@feelback/js/icons/icon-happy.svg?raw";
import iconLove from "@feelback/js/icons/icon-love.svg?raw";
import iconCry from "@feelback/js/icons/icon-cry.svg?raw";
import iconNeutral from "@feelback/js/icons/icon-neutral.svg?raw";
import iconSad from "@feelback/js/icons/icon-sad.svg?raw";
import iconHeart from "@feelback/js/icons/icon-heart.svg?raw";
import iconHeartActive from "@feelback/js/icons/icon-heart-active.svg?raw";
import iconStar from "@feelback/js/icons/icon-star.svg?raw";
import iconStarActive from "@feelback/js/icons/icon-star-active.svg?raw";
import iconLike from "@feelback/js/icons/icon-like.svg?raw";
import iconLikeActive from "@feelback/js/icons/icon-like-active.svg?raw";
import iconDislike from "@feelback/js/icons/icon-dislike.svg?raw";
import iconCheck from "@feelback/js/icons/icon-check.svg?raw";
import iconTimes from "@feelback/js/icons/icon-times.svg?raw";
import iconArrowUp from "@feelback/js/icons/icon-arrow-up.svg?raw";
import iconArrowDown from "@feelback/js/icons/icon-arrow-down.svg?raw";

const PRESETS = {
    "pulse-heart": [{ value: "+", icon: [iconHeart, iconHeartActive], title: "Love" }],
    "pulse-star": [{ value: "+", icon: [iconStar, iconStarActive], title: "Star" }],
    "pulse-like": [{ value: "+", icon: [iconLike, iconLikeActive], title: "Like" }],
    "like-dislike": [
        { value: "+1", icon: iconLike, title: "Like" },
        { value: "-1", icon: iconDislike, title: "Dislike" },
    ],
    "yes-no": [
        { value: "+1", icon: iconLike, title: "Yes" },
        { value: "-1", icon: iconDislike, title: "No" },
    ],
    check: [
        { value: "y", icon: iconCheck, title: "Yes" },
        { value: "n", icon: iconTimes, title: "No" },
    ],
    arrows: [
        { value: "y", icon: iconArrowUp, title: "Upvote" },
        { value: "n", icon: iconArrowDown, title: "Downvote" },
    ],
    feeling: [
        { value: "happy", icon: iconHappy, title: "Happy" },
        { value: "neutral", icon: iconNeutral, title: "Neutral" },
        { value: "sad", icon: iconSad, title: "Sad" },
    ],
    evaluation: [
        { value: "love", icon: iconLove, title: "Love it" },
        { value: "happy", icon: iconHappy, title: "It's ok" },
        { value: "sad", icon: iconSad, title: "Not so great" },
        { value: "hate", icon: iconCry, title: "Hate it" },
    ],
    github: [
        { value: "+1", icon: "👍", title: "Like" },
        { value: "-1", icon: "👎", title: "Dislike" },
        { value: "laugh", icon: "😄", title: "Laugh" },
        { value: "confused", icon: "😕", title: "Confused" },
        { value: "heart", icon: "❤️", title: "Love" },
        { value: "hooray", icon: "🎉", title: "Hooray!" },
        { value: "rocket", icon: "🚀", title: "Let's go!" },
        { value: "eyes", icon: "👀", title: "What?" },
    ],
    facebook: [
        { value: "like", icon: "👍", title: "Like" },
        { value: "love", icon: "❤️", title: "Love" },
        { value: "laugh", icon: "😄", title: "AhAh" },
        { value: "wow", icon: "😮", title: "Wow" },
        { value: "sad", icon: "😥", title: "Cry" },
        { value: "angry", icon: "😡", title: "Angry" },
    ],
    feedback: [
        { value: "idea", icon: "💡", title: "Idea" },
        { value: "error", icon: "💥", title: "Error" },
        { value: "other", icon: "💬", title: "Message" },
    ],
} satisfies Record<string, readonly FeelbackValueDefinition[]>;


export type PresetName = keyof typeof PRESETS;

export function getPreset(name: PresetName | (string & {})): readonly FeelbackValueDefinition[] {
    const preset = PRESETS[name as PresetName];
    if (!preset) {
        throw new Error(`Preset '${name}' unknown`);
    }
    return preset;
}
