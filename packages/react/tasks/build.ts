import fs from "fs/promises";
import esbuild from "esbuild";
import svgr from "esbuild-plugin-svgr";
import { run } from "./utils.js";

const svgrConfig: Parameters<typeof svgr>[0] = {
    plugins: ["@svgr/plugin-jsx"],
};

await fs.rm("./dist", { force: true, recursive: true });
await Promise.all([
    // declaration only typescript build
    run("pnpm tsc -p tsconfig.build.json"),

    // bundle for esm
    esbuild.build({
        plugins: [
            svgr(svgrConfig),
        ],
        entryPoints: ["src/index.ts"],
        bundle: true,
        format: "esm",
        outfile: "./dist/feelback-react.esm.js",
        external: ["react", "react-dom"],
        minify: true,
    }),

    // bundle for commonjs
    esbuild.build({
        plugins: [
            svgr(svgrConfig),
        ],
        entryPoints: ["src/index.ts"],
        bundle: true,
        format: "cjs",
        outfile: "./dist/feelback-react.cjs.js",
        external: ["react", "react-dom"],
        minify: true,
    }),
]);
