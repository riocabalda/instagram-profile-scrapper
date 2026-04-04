import {
  FOLLOWERS_COUNT_MAX,
  FOLLOWERS_COUNT_MIN,
} from "@/constants/instagramDataset";

/**
 * @param {Record<string, unknown>} profile
 * @returns {boolean}
 */
export function filterByFollowsCountInRange(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }
  const n = profile.followersCount;
  if (typeof n !== "number" || !Number.isFinite(n)) {
    return false;
  }
  return n >= FOLLOWERS_COUNT_MIN && n <= FOLLOWERS_COUNT_MAX;
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
 * @returns {Record<string, unknown>[]}
 */
export function filterProfilesForResultsTable(profiles) {
  return applyProfileFilters(profiles, [
    filterByFollowsCountInRange,
    filterByPublicAccount,
  ]);
}
