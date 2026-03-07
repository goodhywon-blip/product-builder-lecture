import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNameConverter } from '../nameConversion.mjs';
import { createCanonicalResult, buildSurfacePayload, selectDisplayedHangul } from '../resultState.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dictionaryPath = path.resolve(__dirname, '../hangul_name_dictionary_curated_v2.json');
const protectedPath = path.resolve(__dirname, '../hangul_name_protected_tests_v2.json');
const curated = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));
const protectedMap = JSON.parse(fs.readFileSync(protectedPath, 'utf8'));

function normalizeKey(input) {
  return String(input || '').trim().toLowerCase().replace(/[^a-z\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function mergeProtectedDictionary(curatedDictionary, overrides) {
  const merged = { ...(curatedDictionary || {}) };
  for (const [rawKey, recommended] of Object.entries(overrides || {})) {
    const key = normalizeKey(rawKey);
    if (!key || typeof recommended !== 'string') continue;
    const existing = merged[key] || {};
    const alternatives = [...(Array.isArray(existing.alternatives) ? existing.alternatives : []), existing.recommended]
      .map((v) => String(v || '').trim())
      .filter((v) => v && v !== recommended);
    merged[key] = {
      ...existing,
      name: existing.name || rawKey,
      recommended,
      alternatives: [...new Set(alternatives)],
      confidence: 'high',
      sourceTag: 'protected_tests_v2'
    };
  }
  return merged;
}

const converter = createNameConverter({
  dictionary: mergeProtectedDictionary(curated, protectedMap),
  fallbackDictionary: {},
  maxCandidates: 3
});

const required = {
  Hannah: '해나',
  Ethan: '이든',
  Zoe: '조에',
  Daniel: '다니엘',
  Chloe: '클로이',
  Sean: '션'
};

for (const [name, expected] of Object.entries(required)) {
  test(`single source of truth for ${name}`, () => {
    const conversion = converter.convert(name);
    assert.equal(conversion.recommended, expected);

    const canonical = createCanonicalResult(name, conversion);
    const surfaces = buildSurfacePayload(canonical);

    assert.equal(surfaces.mainResult, expected);
    assert.equal(surfaces.idCard, expected);
    assert.equal(surfaces.download, expected);
    assert.equal(surfaces.practice, expected);
    assert.equal(surfaces.share, expected);
  });
}

test('alternative selection remains consistent across surfaces', () => {
  const conversion = converter.convert('Zoe');
  const canonical = createCanonicalResult('Zoe', conversion);
  const alt = canonical.alternatives[0];
  assert.ok(alt, 'expected at least one alternative for Zoe');

  const updated = selectDisplayedHangul(canonical, alt);
  const surfaces = buildSurfacePayload(updated);
  assert.equal(surfaces.mainResult, alt);
  assert.equal(surfaces.idCard, alt);
  assert.equal(surfaces.download, alt);
  assert.equal(surfaces.practice, alt);
  assert.equal(surfaces.share, alt);
});
