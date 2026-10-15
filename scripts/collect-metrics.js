import { mkdir, writeFile } from "node:fs/promises"; import { execFileSync } from "node:child_process";
await mkdir("reports", { recursive:true });
const files = ["src/server.js", "src/store.js", "public/app.js", "public/spa.html", "public/styles.css"];
const lines = Object.fromEntries(files.map(f => [f, execFileSync("wc", ["-l", f], { encoding:"utf8" }).trim().split(/\s+/)[0]]));
const report = { generatedAt:new Date().toISOString(), maintainability:{ sourceLines:lines, note:"Run eslint/sonarqube for cyclomatic complexity and duplication in a full CI environment." }, ui:{ lighthouse:"Run npm run lighthouse with Lighthouse installed; compare /spa/ and /hda/." }, testing:{ command:"npm test", e2e:"npm run test:e2e" } };
await writeFile("reports/metrics.json", JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
