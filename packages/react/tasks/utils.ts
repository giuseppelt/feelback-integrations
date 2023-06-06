import { exec, spawn } from "child_process";


export async function run(cmd: string, option?: {
    cwd?: string
    showOutput?: boolean
}) {
    return await new Promise<void>((resolve, reject) => {
        const p = spawn(cmd, {
            shell: true,
            stdio: "inherit"
        });

        // if (option?.showOutput) {
        //     p.stdout.on("data", (data: Buffer) => {
        //         console.log(`${data}`);
        //     });
        // }

        p.on("error", reject);
        p.on("close", () => resolve());
        // exec(cmd, { ...option }, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(error.stack);
        //         console.log("\nError code: " + error.code);
        //         console.log(stdout);
        //         reject(error);
        //         return;
        //     }

        //     if (option?.showOutput && stdout) {
        //         console.log(stdout);
        //     }

        //     resolve();
        // });
    });
}
