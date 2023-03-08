/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
	readonly GITHUB_TOKEN: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
