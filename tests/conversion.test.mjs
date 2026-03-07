import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNameConverter } from '../nameConversion.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dictionaryPath = path.resolve(__dirname, '../hangul_name_dictionary_starter_v1.json');
const starterDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

const converter = createNameConverter({
  dictionary: starterDictionary,
  maxCandidates: 3
});

const expected = {
  Jacob: '제이콥',
  Chloe: '클로이',
  Sean: '션',
  Xavier: '제이비어',
  Joaquin: '호아킨',
  Siobhan: '셔본',
  William: '윌리엄',
  Olivia: '올리비아',
  Sophia: '소피아',
  Zoe: '조이'
};

for (const [input, hangul] of Object.entries(expected)) {
  test(`dictionary match: ${input} -> ${hangul}`, () => {
    const result = converter.convert(input);
    assert.equal(result.matchedBy, 'dictionary');
    assert.equal(result.candidates[0]?.hangul, hangul);
    assert.ok(result.candidates[0]?.isRecommended);
    assert.ok(result.candidates.length >= 1);
  });
}

test('lookup normalization supports trim and case-insensitive match', () => {
  const result = converter.convert('   jAcOb   ');
  assert.equal(result.matchedBy, 'dictionary');
  assert.equal(result.candidates[0]?.hangul, '제이콥');
});

test('lookup normalization supports spaces, hyphens, and apostrophes', () => {
  const result = converter.convert("  jean - luc  o'connor ");
  assert.ok(result.candidates.length >= 1);
  assert.ok(['dictionary', 'hybrid', 'rule'].includes(result.matchedBy));
});

test('falls back to pronunciation rules when dictionary has no match', () => {
  const result = converter.convert('Qzrt');
  assert.equal(result.matchedBy, 'rule');
  assert.ok(result.candidates.length >= 1);
  assert.equal(typeof result.candidates[0]?.score, 'number');
});
