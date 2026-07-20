import { cpSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "dist");

if (existsSync(outDir)) {
  const { rmSync } = await import("node:fs");
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "main.js",
  "auth.js",
  "dashboard.js",
  "editor.js",
  "preview.js",
];

for (const f of files) {
  cpSync(join(__dirname, f), join(outDir, f));
}

console.log("Build complete. Static files copied to ./dist");
