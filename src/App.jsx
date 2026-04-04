import { Filter, Instagram, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { DownloadExcelButton } from "@/components/instagram/DownloadExcelButton";
import { JsonUploadField } from "@/components/instagram/JsonUploadField";
import { ProfilesResultsTable } from "@/components/instagram/ProfilesResultsTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  FOLLOWERS_COUNT_MAX,
  FOLLOWERS_COUNT_MIN,
} from "@/constants/instagramDataset";
import { countProfilesWithMissingFields } from "@/utils/profileFieldCompleteness";
import { filterProfilesForResultsTable } from "@/utils/profileFilters";
import { parseProfileDatasetBuffer } from "@/utils/parseProfileDataset";

function App() {
  const [rawProfiles, setRawProfiles] = useState(
    /** @type {Record<string, unknown>[]} */ ([]),
  );
  const [fileLabel, setFileLabel] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const filteredProfiles = useMemo(
    () => filterProfilesForResultsTable(rawProfiles),
    [rawProfiles],
  );

  const handleDatasetFile = useCallback(
    async (buffer, meta) => {
      setIsParsing(true);
      try {
        const parsed = await parseProfileDatasetBuffer(buffer);
        if (!parsed.ok) {
          toast.error(parsed.error);
          return;
        }

        const asRecords = /** @type {Record<string, unknown>[]} */ (
          parsed.data
        );

        const missingCount = countProfilesWithMissingFields(asRecords);
        if (missingCount > 0) {
          toast.warning(
            `${missingCount} profile${missingCount === 1 ? "" : "s"} missing required fields (username, URL/inputUrl, or followersCount).`,
          );
        } else {
          toast.success("Dataset loaded. All profiles include required fields.");
        }

        setRawProfiles(asRecords);
        setFileLabel(meta.name);
      } catch {
        toast.error("Could not read that file. Try again.");
      } finally {
        setIsParsing(false);
      }
    },
    [],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gradient-to-b from-violet-50/80 via-background to-background dark:from-violet-950/25">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Instagram className="size-3.5 text-pink-600" aria-hidden />
                Instagram profile toolkit
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Profile filter
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Upload your scraper JSON (array of creators). We validate the
                shape, flag incomplete rows, and list only public profiles whose
                follower count is between{" "}
                {FOLLOWERS_COUNT_MIN.toLocaleString()} and{" "}
                {FOLLOWERS_COUNT_MAX.toLocaleString()}. Large JSON files are
                parsed in a background worker and trimmed to the fields this UI
                needs, so hundreds of profiles stay fast.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
                <Filter className="size-3.5 text-violet-600" aria-hidden />
                Live filters on
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs font-medium shadow-sm">
                <Sparkles className="size-3.5 text-amber-500" aria-hidden />
                Clipboard actions
              </span>
            </div>
          </header>

          <Card className="border-violet-100/80 shadow-md dark:border-violet-900/40">
            <CardHeader>
              <CardTitle>Import dataset</CardTitle>
              <CardDescription>
                JSON must be an array. Each profile should include{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  username
                </code>
                , a non-empty{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  url
                </code>{" "}
                or{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  inputUrl
                </code>
                , and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  followersCount
                </code>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <JsonUploadField
                onDatasetFile={handleDatasetFile}
                isLoading={isParsing}
                disabled={isParsing}
              />
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {fileLabel ? (
                    <>
                      Loaded{" "}
                      <span className="font-medium text-foreground">
                        {fileLabel}
                      </span>
                    </>
                  ) : (
                    "No file loaded yet."
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-md bg-muted px-2 py-1 font-medium tabular-nums">
                    Total rows: {rawProfiles.length.toLocaleString()}
                  </span>
                  <span className="rounded-md bg-violet-100 px-2 py-1 font-medium tabular-nums text-violet-900 dark:bg-violet-950 dark:text-violet-100">
                    After filters: {filteredProfiles.length.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  Filtered results
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Private accounts hidden · followersCount outside range hidden
                </p>
              </div>
              <DownloadExcelButton
                profiles={filteredProfiles}
                sourceFileLabel={fileLabel}
                className="shrink-0 gap-2 self-start sm:self-auto"
              />
            </div>
            <ProfilesResultsTable profiles={filteredProfiles} />
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
