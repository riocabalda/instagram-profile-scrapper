/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Returns true when url or inputUrl has a usable value.
 * @param {Record<string, unknown>} profile
 * @returns {boolean}
 */
export function hasUrlOrInputUrl(profile) {
  const url = profile.url;
  const inputUrl = profile.inputUrl;
  return isNonEmptyString(url) || isNonEmptyString(inputUrl);
}

/**
 * Single-profile completeness check for required scraper fields.
 * @param {unknown} profile
 * @returns {boolean}
 */
export function isProfileDataComplete(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }

  const p = /** @type {Record<string, unknown>} */ (profile);

  if (!isNonEmptyString(p.username)) {
    console.log("username is missing");
    return false;
  }

  if (!hasUrlOrInputUrl(p)) {
    console.log("url or inputUrl is missing");
    return false;
  }

  if (!isFiniteNumber(p.followersCount)) {
    console.log("followersCount is missing");
    return false;
  }

  return true;
}

/**
 * Counts how many array entries fail {@link isProfileDataComplete}.
 * @param {unknown[]} profiles
 * @returns {number}
 */
export function countProfilesWithMissingFields(profiles) {
  return profiles.reduce((acc, item) => {
    return acc + (isProfileDataComplete(item) ? 0 : 1);
  }, 0);
}
