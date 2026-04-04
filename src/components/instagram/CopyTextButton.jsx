import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * @param {{
 *   text: string;
 *   label: string;
 *   className?: string;
 *   size?: "default" | "sm" | "lg" | "icon";
 * }} props
 */
function CopyTextButton({ text, label, className, size = "icon" }) {
  const { copy, copied } = useCopyToClipboard();

  const disabled = !text;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex", disabled && "pointer-events-none")}>
          <Button
            type="button"
            variant="ghost"
            size={size}
            className={cn("shrink-0", className)}
            disabled={disabled}
            aria-label={label}
            onClick={() => void copy(text)}
          >
            {copied ? (
              <Check className="size-4 text-emerald-600" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{copied ? "Copied" : label}</TooltipContent>
    </Tooltip>
  );
}

export default CopyTextButton;
