import fs from "fs/promises";

await fs.rm("./styles", { force: true, recursive: true });
await fs.cp("../js/styles", "./styles", { recursive: true });
await fs.rm("./icons", { force: true, recursive: true });
await fs.cp("../js/icons", "./icons", { recursive: true });
