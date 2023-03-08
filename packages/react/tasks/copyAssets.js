import fs from "fs/promises";

await fs.rm("./styles", { force: true, recursive: true });
await fs.cp("../js/styles", "./styles", { recursive: true });
