import { getProfileRowValues } from "@/utils/profileRowValues";

/**
 * @param {Record<string, unknown>[]} profiles
 * @returns {Record<string, string | number>[]}
 */
export function buildProfilesExcelRows(profiles) {
  return profiles.map((profile, index) => {
    const v = getProfileRowValues(profile);
    return {
      "#": index + 1,
      "Full name": v.fullName,
      Username: v.username,
      URL: v.url,
      Followers: v.followersValue ?? "",
      Bio: v.bio,
    };
  });
}

/**
 * Writes filtered profiles to an .xlsx file in the browser.
 *
 * @param {Record<string, unknown>[]} profiles
 * @param {string} [baseFileName]
 * @returns {Promise<boolean>} false if there is nothing to export
 */
export async function downloadProfilesAsExcel(profiles, baseFileName) {
  if (!profiles.length) {
    return false;
  }

  const rows = buildProfilesExcelRows(profiles);
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Profiles");

  const safeBase =
    typeof baseFileName === "string" && baseFileName.trim() !== ""
      ? baseFileName.replace(/\.[^/.]+$/, "").replace(/[^\w-]+/g, "_")
      : "instagram-profiles-filtered";

  const dated = `${safeBase}-${new Date().toISOString().slice(0, 10)}`;
  XLSX.writeFile(workbook, `${dated}.xlsx`);
  return true;
}
