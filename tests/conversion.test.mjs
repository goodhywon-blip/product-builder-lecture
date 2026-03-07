import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNameConverter } from '../nameConversion.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curatedPath = path.resolve(__dirname, '../hangul_name_dictionary_curated_v2.json');
const protectedPath = path.resolve(__dirname, '../hangul_name_protected_tests_v2.json');
const curatedDictionary = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
const protectedCases = JSON.parse(fs.readFileSync(protectedPath, 'utf8'));

function normalizeKey(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z\\s'-]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
}

function mergeProtectedDictionary(curated, protectedMap) {
  const merged = { ...(curated || {}) };
  for (const [rawKey, recommended] of Object.entries(protectedMap || {})) {
    const key = normalizeKey(rawKey);
    if (!key || typeof recommended !== 'string') continue;
    const existing = merged[key] || {};
    const alternatives = [...(Array.isArray(existing.alternatives) ? existing.alternatives : []), existing.recommended]
      .map((value) => String(value || '').trim())
      .filter((value) => value && value !== recommended);
    merged[key] = {
      ...existing,
      name: existing.name || rawKey,
      recommended: String(recommended).trim(),
      alternatives: [...new Set(alternatives)],
      confidence: 'high',
      sourceTag: 'protected_tests_v2'
    };
  }
  return merged;
}

const exactDictionary = mergeProtectedDictionary(curatedDictionary, protectedCases);

const converter = createNameConverter({
  dictionary: exactDictionary,
  fallbackDictionary: {},
  maxCandidates: 3
});

function assertProtected(name, expected) {
  const result = converter.convert(name);
  assert.equal(result.recommended, expected, `Expected ${name} -> ${expected}, got ${result.recommended}`);
  assert.equal(result.matchedBy, 'dictionary');
  assert.ok(['high', 'medium', 'low'].includes(result.confidence));
}

test('protected dictionary outputs remain stable', () => {
  for (const [name, expected] of Object.entries(protectedCases)) {
    assertProtected(name, expected);
  }
});

test('required exact outputs', () => {
  const required = {
    Jacob: '제이콥',
    Chloe: '클로이',
    Sean: '션',
    Ethan: '이든',
    Daniel: '다니엘',
    Xavier: '자비에르',
    Zoe: '조에',
    Zoey: '조이',
    Siobhan: '시본',
    Joaquin: '호아킨',
    Nicholas: '니콜라스',
    Nathaniel: '네이선얼'
  };
  for (const [name, expected] of Object.entries(required)) {
    assertProtected(name, expected);
  }
});

test('case-insensitive dictionary match: ethan / Ethan / ETHAN', () => {
  const variants = ['ethan', 'Ethan', 'ETHAN'];
  for (const input of variants) {
    const result = converter.convert(input);
    assert.equal(result.recommended, '이든');
    assert.equal(result.matchedBy, 'dictionary');
  }
});

test('fallback does not override exact dictionary match', () => {
  const result = converter.convert('xavier');
  assert.equal(result.recommended, '자비에르');
  assert.equal(result.matchedBy, 'dictionary');
  assert.ok(!result.alternatives.includes('자비어')); 
});

test('rule fallback still works for unknown names', () => {
  const result = converter.convert('Qzrt');
  assert.equal(result.matchedBy, 'rule');
  assert.equal(typeof result.recommended, 'string');
  assert.ok(result.recommended.length > 0);
});
