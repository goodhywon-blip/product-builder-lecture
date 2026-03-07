const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const JONG = ["", "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

const choIndex = Object.fromEntries(CHO.map((c, i) => [c, i]));
const jungIndex = Object.fromEntries(JUNG.map((c, i) => [c, i]));
const jongIndex = Object.fromEntries(JONG.map((c, i) => [c, i]));

const VOWELS = [
  ["eigh","에이"], ["igh","아이"],
  ["eau","오"], ["ieu","유"],
  ["ai","에이"], ["ay","에이"],
  ["air","에어"], ["ear","이어"],
  ["are","에어"], ["ere","이어"],
  ["eer","이어"], ["ier","이어"],
  ["er","어"], ["ir","어"], ["ur","어"],
  ["ar","아"], ["or","오"],
  ["ea","이"], ["ee","이"], ["ie","이"], ["ei","이"],
  ["ew","유"], ["ui","위"], ["ue","유"], ["eu","유"],
  ["oo","우"], ["ow","아우"], ["ou","아우"],
  ["au","오"], ["aw","오"],
  ["oi","오이"], ["oy","오이"],
  ["oa","오"], ["oe","오"],
  ["a","아"], ["e","에"], ["i","이"], ["o","오"], ["u","우"], ["y","이"]
];

const CONS = [
  ["tch","ㅊ"], ["dge","ㅈ"], ["dg","ㅈ"],
  ["ch","ㅊ"], ["sh","ㅅ"], ["ph","ㅍ"],
  ["th","ㅌ"], ["ck","ㅋ"], ["ng","ㅇ"], ["qu","ㅋ"], ["wh","ㅎ"],
  ["kn","ㄴ"], ["wr","ㄹ"], ["gn","ㄴ"], ["ps","ㅅ"], ["x","ㅋㅅ"],
  ["c","ㅋ"], ["g","ㄱ"], ["k","ㅋ"], ["j","ㅈ"], ["q","ㅋ"],
  ["r","ㄹ"], ["l","ㄹ"], ["m","ㅁ"], ["n","ㄴ"], ["b","ㅂ"], ["p","ㅍ"],
  ["d","ㄷ"], ["t","ㅌ"], ["f","ㅍ"], ["v","ㅂ"], ["h","ㅎ"], ["s","ㅅ"], ["z","ㅈ"], ["w","ㅇ"]
];

const SUFFIX_MAP = [
  ["tious","셔스"], ["cious","셔스"],
  ["tion","션"], ["sion","션"], ["cion","션"],
  ["tial","셜"], ["cial","셜"],
  ["ture","처"], ["sure","셔"],
  ["tia","시아"], ["cia","시아"], ["sia","시아"],
  ["tio","시오"], ["cio","시오"], ["sio","시오"],
  ["ment","먼트"], ["ness","니스"],
  ["able","에이블"], ["ible","이블"],
  ["son","슨"], ["sen","슨"], ["ton","턴"],
  ["man","맨"], ["men","맨"],
  ["lynne","린"], ["line","라인"], ["lyn","린"], ["ette","에트"]
];

const CONFIDENCE_ORDER = { low: 0, medium: 1, high: 2 };

function cleanEnglishInput(input) {
  return String(input || "")
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeConfidence(value) {
  return value === "high" || value === "medium" || value === "low" ? value : "medium";
}

function deDupCandidates(candidates, maxCandidates) {
  const bestByHangul = new Map();
  for (const candidate of candidates) {
    if (!candidate || !candidate.hangul) continue;
    const prev = bestByHangul.get(candidate.hangul);
    if (!prev || candidate.score > prev.score) bestByHangul.set(candidate.hangul, candidate);
  }
  return Array.from(bestByHangul.values())
    .sort((a, b) => b.score - a.score || a.hangul.localeCompare(b.hangul, "ko"))
    .slice(0, maxCandidates)
    .map((candidate, index) => ({ ...candidate, isRecommended: index === 0 }));
}

function combineConfidences(confidences) {
  if (!confidences.length) return "low";
  const normalized = confidences.map(normalizeConfidence);
  const floor = normalized.reduce((min, current) => {
    return CONFIDENCE_ORDER[current] < CONFIDENCE_ORDER[min] ? current : min;
  }, "high");
  return floor;
}

export function normalizeLookupKey(input, options = {}) {
  const { normalizeSeparators = true, compact = false } = options;
  let value = String(input || "").trim().toLowerCase();
  if (normalizeSeparators) {
    value = value.replace(/[\s'-]+/g, " ").replace(/\s+/g, " ").trim();
  }
  if (compact) value = value.replace(/[\s'-]+/g, "");
  return value;
}

function toEntry(rawKey, rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object") return null;
  const recommended = String(rawEntry.recommended || "").trim();
  if (!recommended) return null;
  const alternatives = Array.isArray(rawEntry.alternatives)
    ? rawEntry.alternatives.map((v) => String(v || "").trim()).filter(Boolean)
    : [];
  return {
    key: String(rawKey || "").trim(),
    name: String(rawEntry.name || rawKey || "").trim(),
    recommended,
    alternatives,
    confidence: normalizeConfidence(rawEntry.confidence),
    sourceTag: String(rawEntry.sourceTag || "dictionary")
  };
}

function createDictionaryLookup(seedDictionary) {
  const exactMap = new Map();
  const caseMap = new Map();
  const normalizedMap = new Map();
  const compactMap = new Map();

  for (const [key, rawEntry] of Object.entries(seedDictionary || {})) {
    const entry = toEntry(key, rawEntry);
    if (!entry) continue;

    const probeValues = [entry.key, entry.name].map((v) => String(v || "").trim()).filter(Boolean);
    for (const probe of probeValues) {
      if (!exactMap.has(probe)) exactMap.set(probe, entry);
      const lowered = probe.toLowerCase();
      if (!caseMap.has(lowered)) caseMap.set(lowered, entry);

      const normalized = normalizeLookupKey(probe, { normalizeSeparators: true, compact: false });
      if (normalized && !normalizedMap.has(normalized)) normalizedMap.set(normalized, entry);

      const compact = normalizeLookupKey(probe, { normalizeSeparators: true, compact: true });
      if (compact && !compactMap.has(compact)) compactMap.set(compact, entry);
    }
  }

  return function lookupName(input, options = {}) {
    const { normalizeSeparators = true } = options;
    const trimmed = String(input || "").trim();
    if (!trimmed) return null;

    const probes = [
      { value: trimmed, matchedBy: "exact" },
      { value: trimmed.toLowerCase(), matchedBy: "case-insensitive" }
    ];

    if (normalizeSeparators) {
      probes.push({
        value: normalizeLookupKey(trimmed, { normalizeSeparators: true, compact: false }),
        matchedBy: "normalized"
      });
      probes.push({
        value: normalizeLookupKey(trimmed, { normalizeSeparators: true, compact: true }),
        matchedBy: "normalized"
      });
    }

    for (const probe of probes) {
      if (!probe.value) continue;
      const entry = probe.matchedBy === "exact"
        ? exactMap.get(probe.value)
        : probe.matchedBy === "case-insensitive"
          ? caseMap.get(probe.value)
          : normalizedMap.get(probe.value) || compactMap.get(probe.value);
      if (entry) return { entry, matchedBy: probe.matchedBy };
    }
    return null;
  };
}

function composeSyllable(cho, jung, jong = "") {
  const safeCho = cho in choIndex ? cho : "ㅇ";
  const safeJung = jung in jungIndex ? jung : "ㅏ";
  const safeJong = jong in jongIndex ? jong : "";
  const code = 0xAC00 + (choIndex[safeCho] * 21 * 28) + (jungIndex[safeJung] * 28) + jongIndex[safeJong];
  return String.fromCharCode(code);
}

function tokenize(word) {
  const s = word.toLowerCase();
  const out = [];
  let i = 0;
  const isVowelLetter = (ch) => "aeiouy".includes(ch || "");

  while (i < s.length) {
    const ch = s[i];
    if (ch === "'" || ch === "-") {
      i += 1;
      continue;
    }

    if (s.startsWith("gh", i) && i > 0 && isVowelLetter(s[i - 1]) && !isVowelLetter(s[i + 2])) {
      i += 2;
      continue;
    }

    if (s[i] === "c" && (s[i + 1] === "e" || s[i + 1] === "i" || s[i + 1] === "y")) {
      out.push({ type: "C", val: "ㅅ" });
      i += 1;
      continue;
    }

    let matched = false;
    for (const [pat, val] of VOWELS) {
      if (s.startsWith(pat, i)) {
        out.push({ type: "V", val });
        i += pat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    for (const [pat, val] of CONS) {
      if (s.startsWith(pat, i)) {
        out.push({ type: "C", val, raw: pat });
        i += pat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    i += 1;
  }

  return out;
}

function splitSuffix(word) {
  for (const [suffix, hangul] of SUFFIX_MAP) {
    if (word.length > suffix.length && word.endsWith(suffix)) {
      return { base: word.slice(0, -suffix.length), suffix: hangul };
    }
  }
  return { base: word, suffix: "" };
}

function pickJung(vowelSyllables) {
  const map = [
    ["아","ㅏ"], ["애","ㅐ"], ["야","ㅑ"], ["예","ㅖ"], ["에","ㅔ"],
    ["어","ㅓ"], ["여","ㅕ"],
    ["오","ㅗ"], ["와","ㅘ"], ["왜","ㅙ"], ["외","ㅚ"],
    ["우","ㅜ"], ["워","ㅝ"], ["웨","ㅞ"], ["위","ㅟ"],
    ["유","ㅠ"], ["으","ㅡ"], ["의","ㅢ"], ["이","ㅣ"]
  ];
  for (const [prefix, jamo] of map) {
    if (vowelSyllables.startsWith(prefix)) return jamo;
  }
  return "ㅏ";
}

function toJong(consonantJamo) {
  const last = String(consonantJamo || "").slice(-1);
  if (JONG.includes(last)) return last;
  const close = { "ㅍ": "ㅂ", "ㅋ": "ㄱ", "ㅊ": "ㅈ", "ㅌ": "ㄷ", "ㅆ": "ㅅ" };
  return close[last] && JONG.includes(close[last]) ? close[last] : "";
}

function toCho(consonantJamo) {
  const first = String(consonantJamo || "")[0];
  if (CHO.includes(first)) return first;
  const close = { "ㅍ": "ㅂ", "ㅋ": "ㄱ", "ㅊ": "ㅈ", "ㅌ": "ㄷ", "ㅆ": "ㅅ" };
  return close[first] && CHO.includes(close[first]) ? close[first] : "ㅇ";
}

function splitHangulSyllables(text) {
  return Array.from(String(text || ""));
}

function ruleBasedHangul(word) {
  const { base, suffix } = splitSuffix(word);
  const tokens = tokenize(base);
  if (!tokens.length) return suffix || "";

  let result = "";
  let i = 0;
  while (i < tokens.length) {
    let cho = "ㅇ";
    if (tokens[i] && tokens[i].type === "C") {
      cho = toCho(tokens[i].val);
      i += 1;
    }
    if (!tokens[i] || tokens[i].type !== "V") break;

    const vowelSyllables = splitHangulSyllables(tokens[i].val);
    i += 1;

    let pendingFinal = false;
    let finalCon = null;
    if (tokens[i] && tokens[i].type === "C" && (!tokens[i + 1] || tokens[i + 1].type !== "V")) {
      pendingFinal = true;
      finalCon = tokens[i];
      i += 1;
    }

    const firstJung = pickJung(vowelSyllables[0]);
    if (vowelSyllables.length === 1) {
      let jong = "";
      if (pendingFinal) {
        if (finalCon && finalCon.raw === "x") {
          jong = "ㄱ";
          result += composeSyllable(cho, firstJung, jong) + "스";
          continue;
        }
        jong = toJong(finalCon ? finalCon.val : "");
      }
      result += composeSyllable(cho, firstJung, jong);
      continue;
    }

    result += composeSyllable(cho, firstJung, "");
    for (let idx = 1; idx < vowelSyllables.length; idx += 1) {
      const isLast = idx === vowelSyllables.length - 1;
      let jong = "";
      if (isLast && pendingFinal) {
        if (finalCon && finalCon.raw === "x") {
          jong = "ㄱ";
          result += composeSyllable("ㅇ", pickJung(vowelSyllables[idx]), jong) + "스";
          break;
        }
        jong = toJong(finalCon ? finalCon.val : "");
      }
      result += composeSyllable("ㅇ", pickJung(vowelSyllables[idx]), jong);
    }
  }

  return result + suffix;
}

function roughLetterFallback(word) {
  const map = {
    a: "아", b: "브", c: "크", d: "드", e: "이", f: "프", g: "그", h: "흐",
    i: "이", j: "제", k: "크", l: "르", m: "므", n: "느", o: "오", p: "프",
    q: "쿠", r: "르", s: "스", t: "트", u: "우", v: "브", w: "우", x: "엑스",
    y: "이", z: "즈"
  };
  const letters = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!letters) return "";
  return letters.split("").map((ch) => map[ch] || "").join("");
}

function buildDictionaryCandidates(entry, scoreBase, reasonPrefix, maxCandidates) {
  const candidates = [entry.recommended, ...entry.alternatives]
    .map((hangul, index) => ({
      hangul,
      score: Math.max(0, scoreBase - index * 0.03),
      reason: `${reasonPrefix} (${index === 0 ? "recommended" : "alternative"})`,
      isRecommended: index === 0
    }));
  return deDupCandidates(candidates, maxCandidates);
}

function buildRuleCandidates(word, maxCandidates) {
  const base = ruleBasedHangul(word) || roughLetterFallback(word);
  const thVariant = word.includes("th") ? ruleBasedHangul(word.replaceAll("th", "s")) : "";
  const candidates = [
    { hangul: base, score: 0.62, reason: "Pronunciation-aware fallback rule", isRecommended: true },
    thVariant ? { hangul: thVariant, score: 0.55, reason: "Fallback variant for 'th' sound", isRecommended: false } : null
  ].filter(Boolean);
  return deDupCandidates(candidates, maxCandidates);
}

function estimateRuleConfidence(word, candidatesLength) {
  if (!word) return "low";
  if (/[^a-z'-]/i.test(word)) return "low";
  if (candidatesLength > 1 && word.length <= 6) return "medium";
  if (word.length <= 5) return "medium";
  return "low";
}

function classifyMatchedBy(wordResults) {
  const sources = new Set(wordResults.map((w) => w.matchedBy));
  if (sources.size === 1) return sources.has("dictionary") ? "dictionary" : "rule";
  return "hybrid";
}

function combineWordCandidates(wordResults, maxCandidates) {
  const combined = [];
  for (let i = 0; i < maxCandidates; i += 1) {
    const parts = [];
    const reasons = [];
    const scores = [];
    for (const wordResult of wordResults) {
      const selected = wordResult.candidates[i] || wordResult.candidates[0];
      if (!selected) continue;
      parts.push(selected.hangul);
      reasons.push(selected.reason);
      scores.push(selected.score);
    }
    if (!parts.length) continue;
    const avgScore = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    combined.push({
      hangul: parts.join(" "),
      score: Number(avgScore.toFixed(4)),
      reason: reasons.join(" + "),
      isRecommended: i === 0
    });
  }
  return deDupCandidates(combined, maxCandidates);
}

export function createNameConverter(options = {}) {
  const {
    dictionary = {},
    fallbackDictionary = {},
    maxCandidates = 3
  } = options;

  const primaryLookup = createDictionaryLookup(dictionary);
  const secondaryLookup = createDictionaryLookup(fallbackDictionary);

  function convertToken(token, lookupOptions) {
    const primaryMatch = primaryLookup(token, lookupOptions);
    if (primaryMatch) {
      return {
        matchedBy: "dictionary",
        confidence: primaryMatch.entry.confidence,
        candidates: buildDictionaryCandidates(primaryMatch.entry, 0.99, `Starter dictionary ${primaryMatch.matchedBy} match`, maxCandidates)
      };
    }

    const secondaryMatch = secondaryLookup(token, lookupOptions);
    if (secondaryMatch) {
      return {
        matchedBy: "dictionary",
        confidence: "medium",
        candidates: buildDictionaryCandidates(secondaryMatch.entry, 0.9, `Built-in dictionary ${secondaryMatch.matchedBy} match`, maxCandidates)
      };
    }

    const normalizedWord = normalizeLookupKey(token, { normalizeSeparators: true, compact: true });
    const ruleCandidates = buildRuleCandidates(normalizedWord, maxCandidates);
    return {
      matchedBy: "rule",
      confidence: estimateRuleConfidence(normalizedWord, ruleCandidates.length),
      candidates: ruleCandidates
    };
  }

  function convert(input, lookupOptions = {}) {
    const cleanedInput = cleanEnglishInput(input);
    const tokens = cleanedInput.split(" ").map((v) => v.trim()).filter(Boolean);
    const normalizedInput = normalizeLookupKey(cleanedInput, { normalizeSeparators: true, compact: false });

    if (!tokens.length) {
      return {
        input: String(input || ""),
        normalizedInput,
        candidates: [],
        confidence: "low",
        matchedBy: "rule"
      };
    }

    const wordResults = tokens.map((token) => convertToken(token, {
      normalizeSeparators: lookupOptions.normalizeSeparators !== false
    }));

    const combinedCandidates = combineWordCandidates(wordResults, maxCandidates);
    return {
      input: String(input || ""),
      normalizedInput,
      candidates: combinedCandidates,
      confidence: combineConfidences(wordResults.map((w) => w.confidence)),
      matchedBy: classifyMatchedBy(wordResults)
    };
  }

  return {
    convert,
    lookup: (input, lookupOptions = {}) => primaryLookup(input, lookupOptions),
    normalizeLookupKey
  };
}

export {
  CHO,
  JUNG,
  JONG
};
