import { DocsThemeConfig } from "nextra-theme-docs";
import { FeelbackTaggedMessage, PRESET_FEELING, PRESET_FEEDBACK } from "@feelback/react";
import { FeelbackYesNo, PRESET_LIKE_DISLIKE } from "@feelback/react";
import "@feelback/react/styles/feelback.css";


export default {
    logo: <span>My Nextra Documentation</span>,
    project: {
        link: "https://github.com/shuding/nextra"
    },
    feedback: { content: null },

    // scenario: evaluation form
    main: ({ children }) => {
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

    // scenario: page up votes
    toc: {
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
    _toc: {
        extraContent: () =>
            <FeelbackTaggedMessage contentSetId="your-content-set-id"
                layout="button-dialog"
                preset={PRESET_FEEDBACK}
            />
    }
} as DocsThemeConfig
