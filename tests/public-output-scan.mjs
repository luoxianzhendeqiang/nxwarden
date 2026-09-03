import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve("out");
const forbidden = [
  { label: "retired legal name", pattern: /NX Warden LLC/i },
  {
    label: "stale ProofPack release-candidate status",
    pattern: /ProofPack v1\.0(?:\.0)? Release Candidate/i
  },
  {
    label: "stale ProofPack launching status",
    pattern: /ProofPack v1\.0(?:\.0)?[^.\n]{0,100}\bLaunching\b/i
  },
  {
    label: "unsupported public release label",
    pattern: /Initial Public Release/i
  },
  { label: "native pipe path", pattern: /native pipe path/i },
  {
    label: "fictional root credential",
    pattern: /example-root-password-not-a-secret/i
  },
  { label: "documentation IP address", pattern: /192\.0\.2\.10/i },
  { label: "private network tooling", pattern: /SingBox/i },
  { label: "private transport tooling", pattern: /Hysteria2/i },
  { label: "financial platform reference", pattern: /Mercury/i },
  { label: "excluded resale positioning", pattern: /proxy resale/i }
];

export function scanText(text) {
  return forbidden
    .filter(({ pattern }) => pattern.test(text))
    .map(({ label }) => label);
}

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

async function main() {
  const failures = [];
  for (const file of await htmlFiles(root)) {
    const text = await readFile(file, "utf8");
    for (const finding of scanText(text)) {
      failures.push(`${path.relative(root, file)}: ${finding}`);
    }
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log("Public output risk scan passed.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
