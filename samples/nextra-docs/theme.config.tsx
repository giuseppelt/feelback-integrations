import { DocsThemeConfig } from "nextra-theme-docs";
import { FeelbackTaggedMessage, PRESET_LIKE_DISLIKE } from "@feelback/react";


export default {
    logo: <span>My Nextra Documentation</span>,
    project: {
        link: "https://github.com/shuding/nextra"
    },
    // feedback: {
    //     content: () => {
    //         return <FeelbackMessage contentSetId="" layout="button-dialog" />
    //     }
    // }
    // footer: {
    //     text: "hello"
    // }
    main: ({ children }) => {
        return (
            <>
                {children}
                <FeelbackTaggedMessage contentSetId="" layout="inline" preset={PRESET_LIKE_DISLIKE} />
            </>
        );
    }
} as DocsThemeConfig
