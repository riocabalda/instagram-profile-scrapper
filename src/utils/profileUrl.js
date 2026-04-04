/**
 * Resolves a profile link, preferring `url` and falling back to `inputUrl`.
 * @param {Record<string, unknown>} profile
 * @returns {string}
 */
export function resolveProfileUrl(profile) {
  const url = profile.url;
  if (typeof url === "string" && url.trim() !== "") {
    return url.trim();
  }
  const inputUrl = profile.inputUrl;
  if (typeof inputUrl === "string" && inputUrl.trim() !== "") {
    return inputUrl.trim();
  }
  return "";
}
