import { parseJsonArray } from "@/utils/parseJsonArray";
import { slimInstagramProfileOrEmpty } from "@/utils/slimInstagramProfile.js";

/** Above this size, parse in a worker so the UI thread does not freeze. */
export const PROFILE_DATASET_WORKER_THRESHOLD_BYTES = 512 * 1024;

/**
 * @typedef {{ ok: true, data: Record<string, unknown>[] }} ParseProfilesSuccess
 * @typedef {{ ok: false, error: string }} ParseProfilesFailure
 * @typedef {ParseProfilesSuccess | ParseProfilesFailure} ParseProfilesResult
 */

/**
 * @param {ArrayBuffer} buffer
 * @returns {Promise<ParseProfilesResult>}
 */
function parseProfileDatasetInWorker(buffer) {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL("../workers/parseProfileArray.worker.js", import.meta.url),
      { type: "module" },
    );

    const onMessage = (event) => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      worker.terminate();
      resolve(/** @type {ParseProfilesResult} */ (event.data));
    };

    const onError = () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      worker.terminate();
      resolve({
        ok: false,
        error: "Worker failed while parsing. Try a smaller file or reload.",
      });
    };

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);

    const transferable = buffer.byteLength > 0 ? [buffer] : [];
    worker.postMessage({ buffer }, transferable);
  });
}

/**
 * Validates JSON root array, then returns a slim copy per profile (small memory footprint).
 *
 * @param {ArrayBuffer} buffer
 * @returns {Promise<ParseProfilesResult>}
 */
export async function parseProfileDatasetBuffer(buffer) {
  if (buffer.byteLength >= PROFILE_DATASET_WORKER_THRESHOLD_BYTES) {
    return parseProfileDatasetInWorker(buffer);
  }

  const text = new TextDecoder("utf-8").decode(buffer);
  const parsed = parseJsonArray(text);
  if (!parsed.ok) {
    return parsed;
  }

  const slimmed = parsed.data.map((item) => slimInstagramProfileOrEmpty(item));
  return { ok: true, data: slimmed };
}
