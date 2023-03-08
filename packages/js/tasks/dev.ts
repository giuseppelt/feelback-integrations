import "dotenv/config";
import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { run } from "./utils.js";


const define = {
    "process.env.API_ENDPOINT": `"${process.env.API_ENDPOINT}"`,
};


async function main() {
    await Promise.all([
        run("pnpm tsc -p tsconfig.dev.json --watch --incremental"),
        (await esbuild.context({
            entryPoints: ["src/index.ts"],
            define,
            bundle: true,
            format: "esm",
            outfile: "./dist/index.js",
            sourcemap: true,
        })).watch(),
        (await esbuild.context({
            entryPoints: ["src/browser.ts"],
            define,
            bundle: true,
            format: "esm",
            outfile: "./dist/browser.js",
            sourcemap: true,
        })).watch(),
        (await esbuild.context({
            plugins: [
                sassPlugin({ type: "css" }),
            ],
            entryPoints: ["styles/feelback.scss"],
            outdir: "./styles",
        })).watch(),
    ]);
}

main();
