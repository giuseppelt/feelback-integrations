import { DocsThemeConfig } from "nextra-theme-docs";
import { FeelbackTaggedMessage, PRESET_LIKE_DISLIKE } from "@feelback/react";
import "@feelback/react/styles/feelback.css";


export default {
    logo: <span>My Nextra Documentation</span>,
    project: {
        link: "https://github.com/shuding/nextra"
    },
    feedback: { content: null },
    main: ({ children }) => {
        return (
            <>
                {children}
                <hr />
                <FeelbackTaggedMessage title="Did you find this page useful?" contentSetId="" layout="inline" preset={PRESET_LIKE_DISLIKE} />
            </>
        );
    }
} as DocsThemeConfig
