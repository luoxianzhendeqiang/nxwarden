import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const forbidden = [
  /NX Warden LLC/i,
  /native pipe path/i,
  /example-root-password-not-a-secret/i,
  /192\.0\.2\.10/i,
  /SingBox/i,
  /Hysteria2/i,
  /Mercury/i,
  /proxy resale/i
];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? htmlFiles(target)
        : Promise.resolve(entry.name.endsWith(".html") ? [target] : []);
    })
  );
  return files.flat();
}

const failures = [];
for (const file of await htmlFiles(root)) {
  const text = await readFile(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      failures.push(`${path.relative(root, file)}: ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Public output risk scan passed.");
