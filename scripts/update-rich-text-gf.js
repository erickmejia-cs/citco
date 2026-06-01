#!/usr/bin/env node
// Updates the rich_text global field: changes `content` from text to JSON RTE.
// Run with: node scripts/update-rich-text-gf.js

const BASE_URL = 'https://api.contentstack.io/v3';
const API_KEY = 'bltf8a5fd00d92ce3b4';
const MGMT_TOKEN = 'cs2f5c5fadcd4425f229b7fa05';

const HEADERS = {
  'api_key': API_KEY,
  'authorization': MGMT_TOKEN,
  'Content-Type': 'application/json',
};

async function cma(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    console.error(`  ✗ ${method} ${path} → ${res.status}:`, JSON.stringify(json).slice(0, 300));
    throw new Error(`${res.status}: ${JSON.stringify(json).slice(0, 100)}`);
  }
  return json;
}

async function main() {
  console.log('Fetching rich_text global field...');
  const current = await cma('GET', '/global_fields/rich_text');
  const gf = current.global_field;

  const contentField = gf.schema.find(f => f.uid === 'content');
  if (contentField?.data_type === 'json') {
    console.log('✅ content field is already JSON RTE — nothing to do.');
    return;
  }

  const updatedSchema = gf.schema.map(f => {
    if (f.uid !== 'content') return f;
    return {
      data_type: 'json',
      display_name: 'Content',
      uid: 'content',
      field_metadata: { description: '', allow_json_rte: true, rich_text_type: 'standard', version: 3 },
      multiple: false,
      mandatory: true,
      unique: false,
      non_localizable: false,
    };
  });

  console.log('Updating rich_text global field with JSON RTE content field...');
  await cma('PUT', '/global_fields/rich_text', {
    global_field: { ...gf, schema: updatedSchema },
  });

  console.log('✅ rich_text global field updated successfully.');
}

main().catch(err => { console.error('\n💥', err); process.exit(1); });
