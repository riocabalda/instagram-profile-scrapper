/**
 * @typedef {{ ok: true, data: unknown[] }} ParseJsonArraySuccess
 * @typedef {{ ok: false, error: string }} ParseJsonArrayFailure
 * @typedef {ParseJsonArraySuccess | ParseJsonArrayFailure} ParseJsonArrayResult
 */

/**
 * Parses text as JSON and ensures the root value is an array.
 * @param {string} text
 * @returns {ParseJsonArrayResult}
 */
export function parseJsonArray(text) {
  if (typeof text !== "string" || text.trim() === "") {
    return { ok: false, error: "File is empty." };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON format." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "JSON root must be an array of profiles." };
  }

  return { ok: true, data: parsed };
}
