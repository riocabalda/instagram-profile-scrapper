import { useCallback, useState } from "react";

/**
 * @param {{ onCopied?: () => void }} [options]
 */
export function useCopyToClipboard(options = {}) {
  const { onCopied } = options;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      const value = typeof text === "string" ? text : String(text ?? "");
      if (!value) {
        return false;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopied(true);
        onCopied?.();
        window.setTimeout(() => setCopied(false), 1500);
        return true;
      } catch {
        return false;
      }
    },
    [onCopied],
  );

  return { copy, copied };
}
