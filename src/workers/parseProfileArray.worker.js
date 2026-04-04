import { slimInstagramProfileOrEmpty } from "../utils/slimInstagramProfile.js";

self.onmessage = (event) => {
  const { buffer } = event.data;
  if (!(buffer instanceof ArrayBuffer)) {
    self.postMessage({ ok: false, error: "Invalid payload." });
    return;
  }

  try {
    const text = new TextDecoder("utf-8").decode(buffer);
    if (typeof text !== "string" || text.trim() === "") {
      self.postMessage({ ok: false, error: "File is empty." });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      self.postMessage({ ok: false, error: "Invalid JSON format." });
      return;
    }

    if (!Array.isArray(parsed)) {
      self.postMessage({
        ok: false,
        error: "JSON root must be an array of profiles.",
      });
      return;
    }

    const slimmed = parsed.map((item) => slimInstagramProfileOrEmpty(item));
    self.postMessage({ ok: true, data: slimmed });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to parse dataset.";
    self.postMessage({ ok: false, error: message });
  }
};
