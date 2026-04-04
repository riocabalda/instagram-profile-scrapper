import { resolveProfileUrl } from "@/utils/profileUrl";

/**
 * Normalized row fields shared by the results table and Excel export.
 *
 * @param {Record<string, unknown>} profile
 * @returns {{
 *   fullName: string;
 *   username: string;
 *   url: string;
 *   followersValue: number | null;
 *   bio: string;
 * }}
 */
export function getProfileRowValues(profile) {
  const fullName =
    typeof profile.fullName === "string" ? profile.fullName : "";
  const username =
    typeof profile.username === "string" ? profile.username : "";
  const url = resolveProfileUrl(profile);
  const followers = profile.followersCount;
  const followersValue =
    typeof followers === "number" && Number.isFinite(followers)
      ? followers
      : null;
  const bio = typeof profile.biography === "string" ? profile.biography : "";

  return { fullName, username, url, followersValue, bio };
}
