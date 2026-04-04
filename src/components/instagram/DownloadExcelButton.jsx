import { FileDown } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { downloadProfilesAsExcel } from "@/utils/exportProfilesToExcel";

/**
 * @param {{
 *   profiles: Record<string, unknown>[];
 *   sourceFileLabel?: string;
 *   className?: string;
 * }} props
 */
export function DownloadExcelButton({
  profiles,
  sourceFileLabel = "",
  className,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = useCallback(async () => {
    if (!profiles.length || isExporting) {
      return;
    }
    setIsExporting(true);
    try {
      const ok = await downloadProfilesAsExcel(profiles, sourceFileLabel);
      if (ok) {
        toast.success("Excel file download started.");
      } else {
        toast.error("No rows to export.");
      }
    } catch {
      toast.error("Could not create the Excel file.");
    } finally {
      setIsExporting(false);
    }
  }, [profiles, sourceFileLabel, isExporting]);

  const disabled = profiles.length === 0 || isExporting;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      disabled={disabled}
      onClick={() => void handleClick()}
    >
      <FileDown className="size-4" aria-hidden />
      {isExporting ? "Exporting…" : "Download Excel"}
    </Button>
  );
}
