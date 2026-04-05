/**
 * @param {Record<string, unknown>} profile
 * @param {number} minFollowers
 * @param {number} maxFollowers
 * @returns {boolean}
 */
export function filterByFollowsCountInRange(
  profile,
  minFollowers,
  maxFollowers,
) {
  if (!profile || typeof profile !== "object") {
    return false;
  }
  const n = profile.followersCount;
  if (typeof n !== "number" || !Number.isFinite(n)) {
    return false;
  }
  return n >= minFollowers && n <= maxFollowers;
}

/**
 * @param {Record<string, unknown>} profile
 * @returns {boolean}
 */
export function filterByPublicAccount(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }
  return profile.private === false;
}

/**
 * Applies every predicate; each predicate must be a single-purpose filter function.
 * @param {Record<string, unknown>[]} profiles
 * @param {Array<(p: Record<string, unknown>) => boolean>} predicates
 * @returns {Record<string, unknown>[]}
 */
export function applyProfileFilters(profiles, predicates) {
  return profiles.filter((profile) =>
    predicates.every((predicate) => predicate(profile)),
  );
}

/**
 * Default pipeline for this app: follows band + public only.
 * @param {Record<string, unknown>[]} profiles
 * @param {number} minFollowers
 * @param {number} maxFollowers
 * @returns {Record<string, unknown>[]}
 */
export function filterProfilesForResultsTable(
  profiles,
  minFollowers,
  maxFollowers,
) {
  return applyProfileFilters(profiles, [
    (p) => filterByFollowsCountInRange(p, minFollowers, maxFollowers),
    filterByPublicAccount,
  ]);
}
