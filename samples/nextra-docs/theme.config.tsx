import { DocsThemeConfig } from "nextra-theme-docs";
import { FeelbackTaggedMessage, PRESET_FEELING, PRESET_FEEDBACK, PRESET_EVALUATION } from "@feelback/react";
import { FeelbackYesNo, PRESET_LIKE_DISLIKE } from "@feelback/react";
import { FeedbackStripeLike } from "./components/FeedbackStripeLike";
import "@feelback/react/styles/feelback.css";


export default {
    logo: <span>My Nextra Documentation</span>,
    project: {
        link: "https://github.com/shuding/nextra"
    },
    feedback: { content: null },

    // scenario: evaluation form
    _main: ({ children }) => {
        return (
            <>
                {children}
                <hr />
                <FeelbackTaggedMessage contentSetId="your-content-set-id"
                    layout="inline"
                    preset={PRESET_FEELING}
                    title="Did you find this page useful?"
                />
            </>
        );
    },

    // scenario: stripe-like feedback
    _main: ({ children }) => {
        return (
            <>
                {children}
                <hr />
                <FeedbackStripeLike />
            </>
        );
    },

    // scenario: vercel-like reveal
    main: ({ children }) => {
        return (
            <>
                {children}
                <hr />
                <FeelbackTaggedMessage contentSetId="your-content-set-id"
                    style={["bordered", "width-md", "align-center"]}
                    title="Was this page useful?"
                    layout="reveal-message"
                    preset={PRESET_EVALUATION}
                />
            </>
        );
    },



    // scenario: page up votes
    _toc: {
        extraContent: () =>
            <>
                <hr className="divider" />
                <FeelbackYesNo contentSetId="your-content-set-id"
                    preset={PRESET_LIKE_DISLIKE}
                    textQuestion="Is this page useful?"
                />
            </>
    },

    // scenario: send feedback button
    toc: {
        extraContent: () =>
            <FeelbackTaggedMessage contentSetId="your-content-set-id"
                layout="button-dialog"
                preset={PRESET_FEEDBACK}
            />
    },
} as DocsThemeConfig
