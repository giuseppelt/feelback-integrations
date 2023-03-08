import dotenv from "dotenv";
import fs from "fs/promises";
import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { run } from "./utils.js";

dotenv.config({ path: ".env.production" });

const define = {
    "process.env.API_ENDPOINT": `"${process.env.API_ENDPOINT}"`,
};

await fs.rm("./dist", { force: true, recursive: true });
await Promise.all([
    run("pnpm tsc -p tsconfig.build.json"),
    esbuild.build({
        entryPoints: ["src/index.ts"],
        define,
        bundle: true,
        format: "esm",
        outfile: "./dist/index.js",
    }),
    esbuild.build({
        entryPoints: ["src/index.ts"],
        define,
        bundle: true,
        format: "cjs",
        outfile: "./dist/index.cjs",
    }),
    esbuild.build({
        entryPoints: ["src/browser.ts"],
        define,
        bundle: true,
        format: "esm",
        outfile: "./dist/browser.js",
        minify: true,
    }),
    esbuild.build({
        entryPoints: ["src/browser-auto.ts"],
        define,
        bundle: true,
        format: "iife",
        outfile: "./dist/browser-auto.js",
        minify: true,
    }),
    esbuild.build({
        plugins: [
            sassPlugin({ type: "css" }),
        ],
        entryPoints: ["styles/feelback.scss"],
        outdir: "./styles",
    }),
]);

process.exit(0);
