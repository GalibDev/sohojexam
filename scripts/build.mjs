import { spawnSync } from "node:child_process";

const target = process.env.VERCEL === "1" ? "build:vercel" : "build:cloudflare";
const result = spawnSync(`npm run ${target}`, { stdio: "inherit", shell: true });

if (result.error) throw result.error;
process.exit(result.status ?? 1);
