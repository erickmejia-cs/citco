#!/usr/bin/env node
// Updates only the navigation content type to add the logo file field.
// Run with: node scripts/update-navigation-ct.js

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
  console.log('Fetching current navigation content type...');
  const current = await cma('GET', '/content_types/navigation');
  const ct = current.content_type;

  const alreadyHasLogo = ct.schema.some(f => f.uid === 'logo');
  if (alreadyHasLogo) {
    console.log('✅ logo field already exists — nothing to do.');
    return;
  }

  // Insert logo field after title (index 1)
  const logoField = {
    data_type: 'file',
    display_name: 'Logo',
    uid: 'logo',
    extensions: [],
    field_metadata: { description: '', rich_text_type: 'standard' },
    multiple: false,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };

  const updatedSchema = [
    ct.schema[0],       // title
    logoField,          // logo (new)
    ...ct.schema.slice(1), // nav_items, utility_links, ...
  ];

  console.log('Updating navigation content type with logo field...');
  await cma('PUT', '/content_types/navigation', {
    content_type: { ...ct, schema: updatedSchema },
  });

  console.log('✅ Navigation content type updated successfully.');
}

main().catch(err => { console.error('\n💥', err); process.exit(1); });
