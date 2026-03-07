export function createCanonicalResult(input, conversionResult) {
  const base = {
    input: String(input || "").trim(),
    normalizedInput: conversionResult?.normalizedInput || "",
    recommended: conversionResult?.recommended || "",
    alternatives: Array.isArray(conversionResult?.alternatives) ? conversionResult.alternatives.filter(Boolean) : [],
    confidence: conversionResult?.confidence || "low",
    matchedBy: conversionResult?.matchedBy || "rule",
    reason: conversionResult?.reason || conversionResult?.note || ""
  };
  return {
    ...base,
    displayHangul: base.recommended || ""
  };
}

export function getHangulOptions(state) {
  if (!state) return [];
  return [state.recommended, ...(state.alternatives || [])].filter(Boolean);
}

export function selectDisplayedHangul(state, hangul) {
  if (!state) return state;
  const options = getHangulOptions(state);
  if (!hangul || !options.includes(hangul)) return state;
  return {
    ...state,
    displayHangul: hangul
  };
}

export function getDisplayedHangul(state) {
  return state?.displayHangul || state?.recommended || "";
}

export function buildSurfacePayload(state) {
  const hangul = getDisplayedHangul(state);
  return {
    mainResult: hangul,
    idCard: hangul,
    download: hangul,
    practice: hangul,
    share: hangul
  };
}

export function pushRecentName(recent, name, max = 8) {
  const clean = String(name || "").trim();
  if (!clean) return Array.isArray(recent) ? recent : [];
  const list = Array.isArray(recent) ? recent.filter(Boolean) : [];
  const deduped = [clean, ...list.filter((v) => v.toLowerCase() !== clean.toLowerCase())];
  return deduped.slice(0, max);
}
