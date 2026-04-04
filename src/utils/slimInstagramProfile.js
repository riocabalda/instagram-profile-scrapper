/**
 * Keeps only fields used by validation, filters, table, and Excel export.
 * Drops everything else (nested posts, raw payloads, extra metrics, etc.).
 *
 * @param {unknown} source
 * @returns {Record<string, unknown>}
 */
export function slimInstagramProfileRecord(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {};
  }

  const s = /** @type {Record<string, unknown>} */ (source);

  /** @type {Record<string, unknown>} */
  const record = {
    ...(typeof s.id === "string" || typeof s.id === "number"
      ? { id: s.id }
      : {}),
    username: s.username,
    url: s.url,
    inputUrl: s.inputUrl,
    fullName: s.fullName,
    biography: s.biography,
    followersCount: s.followersCount,
    private: s.private,
  };

  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  );
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
