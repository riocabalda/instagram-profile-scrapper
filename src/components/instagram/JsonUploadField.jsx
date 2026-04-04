import { useCallback, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileJson2, Loader2, Upload } from "lucide-react";
import { JSON_FILE_ACCEPT } from "@/constants/instagramDataset";

/**
 * @param {{
 *   onDatasetFile: (
 *     buffer: ArrayBuffer,
 *     meta: { name: string; size: number },
 *   ) => void | Promise<void>;
 *   className?: string;
 *   disabled?: boolean;
 *   isLoading?: boolean;
 * }} props
 */
function JsonUploadField({
  onDatasetFile,
  className,
  disabled = false,
  isLoading = false,
}) {
  const inputId = useId();
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [isDragging, setIsDragging] = useState(false);

  const busy = disabled || isLoading;

  const processFile = useCallback(
    async (file) => {
      if (!file || busy) {
        return;
      }
      const buffer = await file.arrayBuffer();
      await onDatasetFile(buffer, { name: file.name, size: file.size });
    },
    [onDatasetFile, busy],
  );

  const openPicker = useCallback(() => {
    if (busy) {
      return;
    }
    inputRef.current?.click();
  }, [busy]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId}>Dataset (JSON array)</Label>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={JSON_FILE_ACCEPT}
        className="sr-only"
        disabled={busy}
        aria-label="Upload JSON dataset file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          await processFile(file);
          e.target.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-busy={isLoading}
        aria-disabled={busy}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (busy) {
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          if (busy) {
            return;
          }
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          if (busy) {
            return;
          }
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          if (busy) {
            return;
          }
          const file = e.dataTransfer.files?.[0];
          if (
            file &&
            (file.type === "application/json" || file.name.endsWith(".json"))
          ) {
            await processFile(file);
          }
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:border-violet-400/80 hover:bg-violet-50/50 dark:hover:bg-violet-950/20",
          isDragging && !busy
            ? "border-violet-500 bg-violet-50/70 dark:bg-violet-950/30"
            : "border-muted-foreground/25 bg-muted/20",
          busy && "cursor-not-allowed opacity-70",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
          {isLoading ? (
            <Loader2
              className="size-6 animate-spin text-violet-600"
              aria-hidden
            />
          ) : (
            <FileJson2 className="size-6 text-violet-600" aria-hidden />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isLoading
              ? "Parsing dataset…"
              : "Drop your scraper JSON here or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            Large files (e.g. tens of MB) are parsed off the main thread so the
            page stays responsive. Only profile fields needed for this tool are
            kept in memory.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="size-4" aria-hidden />
          )}
          {isLoading ? "Working…" : "Choose file"}
        </Button>
      </div>
    </div>
  );
}

export default JsonUploadField;
