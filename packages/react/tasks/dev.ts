import esbuild from "esbuild";
import svgr from "esbuild-plugin-svgr";
import { run } from "./utils.js";


const svgrConfig: Parameters<typeof svgr>[0] = {
    plugins: ["@svgr/plugin-jsx"],
};

await Promise.all([
    run("pnpm tsc -p tsconfig.dev.json --watch --incremental"),
    (await esbuild.context({
        plugins: [
            svgr(svgrConfig),
        ],
        entryPoints: ["src/index.ts"],
        bundle: true,
        format: "esm",
        outfile: "./dist/feelback-react.esm.js",
        sourcemap: true,
        external: ["react", "react-dom"],
    })).watch(),
    // (await esbuild.context({
    //     plugins: [
    //         svgr(svgrConfig),
    //     ],
    //     entryPoints: ["src/index.ts"],
    //     bundle: true,
    //     format: "cjs",
    //     outfile: "./dist/feelback-react.cjs.js",
    //     sourcemap: true,
    //     external: ["react", "react-dom"],
    // })).watch(),
    (await esbuild.context({
        entryPoints: [
            "@feelback/js/styles/feelback.css",
            "@feelback/js/styles/feelback.scss"
        ],
        loader: {
            ".css": "copy",
            ".scss": "copy",
        },
        outdir: "./styles",
    })).watch(),
]);
