import type { FeelbackValueDefinition } from "./types";
import IconHeart from "@feelback/js/icons/icon-heart.svg";
import IconHeartActive from "@feelback/js/icons/icon-heart-active.svg";
import IconStar from "@feelback/js/icons/icon-star.svg";
import IconStarActive from "@feelback/js/icons/icon-star-active.svg";
import IconLike from "@feelback/js/icons/icon-like.svg";
import IconLikeActive from "@feelback/js/icons/icon-like-active.svg";
import IconDislike from "@feelback/js/icons/icon-dislike.svg";
import IconCheck from "@feelback/js/icons/icon-check.svg";
import IconTimes from "@feelback/js/icons/icon-times.svg";
import IconArrowUp from "@feelback/js/icons/icon-arrow-up.svg";
import IconArrowDown from "@feelback/js/icons/icon-arrow-down.svg";
import IconHappy from "@feelback/js/icons/icon-happy.svg";
import IconNeutral from "@feelback/js/icons/icon-neutral.svg";
import IconSad from "@feelback/js/icons/icon-sad.svg";


export const PRESET_PULSE_HEART: FeelbackValueDefinition[] = [
    {
        value: "+",
        icon: [IconHeart, IconHeartActive],
        title: "Love",
    }
];

export const PRESET_PULSE_STAR: FeelbackValueDefinition[] = [
    {
        value: "+",
        icon: [IconStar, IconStarActive],
        title: "Star",
    }
];

export const PRESET_PULSE_LIKE: FeelbackValueDefinition[] = [
    {
        value: "+",
        icon: [IconLike, IconLikeActive],
        title: "Like",
    }
];


export const PRESET_LIKE_DISLIKE: FeelbackValueDefinition[] = [
    {
        value: "-1",
        icon: IconLike,
        title: "Like",
    },
    {
        value: "+1",
        icon: IconDislike,
        title: "Dislike",
    }
];

export const PRESET_YESNO_LIKE_DISLIKE: FeelbackValueDefinition[] = [
    {
        value: "y",
        icon: IconLike,
        title: "Yes",
    },
    {
        value: "n",
        icon: IconDislike,
        title: "No",
    }
];

export const PRESET_YESNO_CHECK: FeelbackValueDefinition[] = [
    {
        value: "y",
        icon: IconCheck,
        title: "Yes",
    },
    {
        value: "n",
        icon: IconTimes,
        title: "No",
    }
];

export const PRESET_UP_DOWN_VOTE: FeelbackValueDefinition[] = [
    {
        value: "+1",
        icon: IconArrowUp,
        title: "Upvote",
    },
    {
        value: "-1",
        icon: IconArrowDown,
        title: "Downvote",
    }
];


export const PRESET_GITHUB_EMOJI: FeelbackValueDefinition[] = [
    {
        value: "+1",
        icon: { text: "👍" },
        title: "Like",
    },
    {
        value: "-1",
        icon: { text: "👎" },
        title: "Dislike",
    },
    {
        value: "laugh",
        icon: { text: "😄" },
        title: "Laugh",
    },
    {
        value: "confused",
        icon: { text: "😕" },
        title: "Confused",
    },
    {
        value: "heart",
        icon: { text: "❤️" },
        title: "Love",
    },
    {
        value: "hooray",
        icon: { text: "🎉" },
        title: "Hooray!",
    },
    {
        value: "rocket",
        icon: { text: "🚀" },
        title: "Let's go!",
    },
    {
        value: "eyes",
        icon: { text: "👀" },
        title: "What?",
    },
];

export const PRESET_FACEBOOK_EMOJI: FeelbackValueDefinition[] = [
    {
        value: "like",
        icon: { text: "👍" },
        title: "Like",
    },
    {
        value: "love",
        icon: { text: "❤️" },
        title: "Love",
    },
    {
        value: "laugh",
        icon: { text: "😄" },
        title: "AhAh",
    },
    {
        value: "wow",
        icon: { text: "😮" },
        title: "Wow",
    },
    {
        value: "sad",
        icon: { text: "😥" },
        title: "Cry",
    },
    {
        value: "angry",
        icon: { text: "😡" },
        title: "Angry",
    },
];

export const PRESET_FEELING: FeelbackValueDefinition[] = [
    {
        value: "happy",
        icon: IconHappy,
        title: "Happy",
    },
    {
        value: "neutral",
        icon: IconNeutral,
        title: "Neutral",
    },
    {
        value: "sad",
        icon: IconSad,
        title: "Sad",
    },
];

export const PRESET_FEEDBACK: FeelbackValueDefinition[] = [
    {
        value: "idea",
        icon: { text: "💡" },
        title: "Idea",
    },
    {
        value: "error",
        icon: { text: "💥" },
        title: "Error",
    },
    {
        value: "other",
        icon: { text: "💬" },
        title: "Other",
    },
]
