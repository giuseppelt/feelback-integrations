import fs from "fs/promises";

await fs.rm("./styles", { force: true, recursive: true });
await fs.symlink("../js/styles", "./styles", "dir");

await fs.rm("./icons", { force: true, recursive: true });
await fs.symlink("../js/icons", "./icons", "dir");
