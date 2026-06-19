// Seed the Blind 75 problems into InstantDB.
//
//   npm run seed
//
// Requires NEXT_PUBLIC_INSTANT_APP_ID and INSTANT_ADMIN_TOKEN in .env.local.
import { init, id } from "@instantdb/admin";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

// Minimal .env.local loader (no extra dependency).
async function loadEnv() {
  try {
    const text = await readFile(path.join(root, "..", ".env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}

async function main() {
  await loadEnv();

  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
  const adminToken = process.env.INSTANT_ADMIN_TOKEN;

  if (!appId || !adminToken) {
    console.error(
      "Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_ADMIN_TOKEN. Set them in .env.local."
    );
    process.exit(1);
  }

  const db = init({ appId, adminToken });

  const problems = JSON.parse(
    await readFile(path.join(root, "..", "data", "problems.json"), "utf8")
  );

  console.log(`Seeding ${problems.length} problems…`);

  // Map existing problems by pid so re-running updates in place (idempotent)
  // without depending on a pushed unique-attribute schema.
  const existing = await db.query({ problems: {} });
  const idByPid = new Map();
  for (const row of existing.problems ?? []) idByPid.set(row.pid, row.id);

  const chunkSize = 50;
  for (let i = 0; i < problems.length; i += chunkSize) {
    const chunk = problems.slice(i, i + chunkSize);
    const txns = chunk.map((p) =>
      db.tx.problems[idByPid.get(p.pid) ?? id()].update({
        pid: p.pid,
        no: p.no,
        type: p.type,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags,
        description: p.description,
        solution: p.solution,
      })
    );
    await db.transact(txns);
    console.log(`  …${Math.min(i + chunkSize, problems.length)}/${problems.length}`);
  }

  console.log("Done ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
