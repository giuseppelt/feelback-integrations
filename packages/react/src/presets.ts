import type { ButtonValueDef } from "./parts";
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


export const PRESET_PULSE_HEART: ButtonValueDef[] = [
    ["+", [IconHeart, IconHeartActive], "Love"]
];

export const PRESET_PULSE_STAR: ButtonValueDef[] = [
    ["+", [IconStar, IconStarActive], "Star"]
];

export const PRESET_PULSE_LIKE: ButtonValueDef[] = [
    ["+", [IconLike, IconLikeActive], "Like"]
];



export const PRESET_YESNO_LIKE: ButtonValueDef[] = [
    ["y", IconLike, "Like"],
    ["n", IconDislike, "Dislike"]
];

export const PRESET_YESNO_CHECK: ButtonValueDef[] = [
    ["y", IconCheck, "Yes"],
    ["n", IconTimes, "No"]
];

export const PRESET_YESNO_ARROWS: ButtonValueDef[] = [
    ["y", IconArrowUp, "Upvote"],
    ["n", IconArrowDown, "Downvote"]
];


export const PRESET_REACTION_GITHUB: ButtonValueDef[] = [
    ["+1", { text: "👍" }, "Like"],
    ["-1", { text: "👎" }, "Dislike"],
    ["laugh", { text: "😄" }, "Laugh"],
    ["confused", { text: "😕" }, "Confused"],
    ["heart", { text: "❤️" }, "Love"],
    ["hooray", { text: "🎉" }, "Hooray!"],
    ["rocket", { text: "🚀" }, "Let's go!"],
    ["eyes", { text: "👀" }, "What?"],
];

export const PRESET_REACTION_FACEBOOK: ButtonValueDef[] = [
    ["like", { text: "👍" }, "Like"],
    ["love", { text: "❤️" }, "Love"],
    ["laugh", { text: "😄" }, "AhAh"],
    ["wow", { text: "😮" }, "Wow"],
    ["sad", { text: "😥" }, "Cry"],
    ["angry", { text: "😡" }, "Angry"],
];

export const PRESET_REACTION_SENTIMENT: ButtonValueDef[] = [
    ["happy", IconHappy, "Happy"],
    ["neutral", IconNeutral, "Neutral"],
    ["sad", IconSad, "Sad"],
];
