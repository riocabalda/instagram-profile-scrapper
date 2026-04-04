/**
 * Keeps only fields needed for validation, filters, and the results table.
 * Drops nested arrays (posts, IGTV, etc.) so memory stays proportional to row count.
 *
 * @param {unknown} source
 * @returns {Record<string, unknown>}
 */
export function slimInstagramProfileRecord(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {};
  }

  const s = /** @type {Record<string, unknown>} */ (source);

  return {
    id: s.id,
    username: s.username,
    url: s.url,
    inputUrl: s.inputUrl,
    fullName: s.fullName,
    biography: s.biography,
    followersCount: s.followersCount,
    followsCount: s.followsCount,
    private: s.private,
  };
}

/**
 * @param {unknown} item
 * @returns {Record<string, unknown>}
 */
export function slimInstagramProfileOrEmpty(item) {
  return item && typeof item === "object" && !Array.isArray(item)
    ? slimInstagramProfileRecord(item)
    : {};
}
