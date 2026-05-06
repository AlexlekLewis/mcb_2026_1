#!/usr/bin/env node
/**
 * Seeds the MCB project gallery:
 *   1. Reads ../staging/projects_metadata.json
 *   2. Uploads each web-optimized image from ../staging/web_optimized/ to Supabase Storage
 *      (bucket: jobsite-images, path: gallery/<slug>.jpg)
 *   3. Upserts a row in public.mcb_projects per metadata entry
 *
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in repo/.env.local.
 *
 * Run from repo root:  node scripts/seed-mcb-projects.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const projectRoot = resolve(repoRoot, "..");
const envPath = resolve(repoRoot, ".env.local");
const stagingDir = resolve(projectRoot, "staging");
const metadataPath = resolve(stagingDir, "projects_metadata.json");
const imagesDir = resolve(stagingDir, "web_optimized");

const BUCKET = "jobsite-images";
const FOLDER = "gallery";

async function loadEnv() {
  if (!existsSync(envPath)) {
    throw new Error(`Missing ${envPath}. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.`);
  }
  const text = await readFile(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  await loadEnv();
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  console.log(`Seeding ${metadata.length} projects...`);

  let uploaded = 0;
  let upserted = 0;

  for (let i = 0; i < metadata.length; i++) {
    const entry = metadata[i];
    const sourcePath = resolve(imagesDir, entry.source_file);
    if (!existsSync(sourcePath)) {
      console.warn(`  ! Missing image, skipping: ${entry.source_file}`);
      continue;
    }

    const buffer = await readFile(sourcePath);
    const remotePath = `${FOLDER}/${entry.slug}.jpg`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(remotePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000, immutable",
      });
    if (uploadErr) {
      console.error(`  ! Upload failed for ${entry.slug}:`, uploadErr.message);
      continue;
    }
    uploaded++;

    const { error: upsertErr } = await supabase
      .from("mcb_projects")
      .upsert(
        {
          slug: entry.slug,
          title: entry.title,
          category: entry.category,
          product: entry.product,
          description: entry.description,
          image_path: remotePath,
          sort_order: i + 1,
        },
        { onConflict: "slug" }
      );
    if (upsertErr) {
      console.error(`  ! Upsert failed for ${entry.slug}:`, upsertErr.message);
      continue;
    }
    upserted++;

    process.stdout.write(`  [${i + 1}/${metadata.length}] ${entry.slug}\n`);
  }

  console.log(`\nDone. Uploaded ${uploaded} images, upserted ${upserted} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
