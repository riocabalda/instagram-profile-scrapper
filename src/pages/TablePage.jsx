import { useState, useEffect, useTransition } from "react";
import { Separator } from "@/components/ui/separator";
import { useProfileDatasetStore } from "@/stores/profileDatasetStore";
import { filterProfilesForResultsTable } from "@/utils/profileFilters";
import {
  FOLLOWERS_COUNT_MAX,
  FOLLOWERS_COUNT_MIN,
} from "@/constants/instagramDataset";
import TableSkeleton from "@/components/instagram/TableSkeleton";
import DownloadExcelButton from "@/components/instagram/DownloadExcelButton";
import ProfilesResultsTable from "@/components/instagram/ProfilesResultsTable";
import { Loader2 } from "lucide-react";

function TablePage() {
  const rawProfiles = useProfileDatasetStore((s) => s.rawProfiles);
  const fileLabel = useProfileDatasetStore((s) => s.fileLabel);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (rawProfiles.length === 0) {
      startTransition(() => {
        setFilteredProfiles([]);
      });
      return;
    }
    const results = filterProfilesForResultsTable(rawProfiles);

    startTransition(() => {
      setFilteredProfiles(results);
    });
  }, [rawProfiles]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Filtered results
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Private accounts hidden · Followers Count between{" "}
              {FOLLOWERS_COUNT_MIN.toLocaleString()} and{" "}
              {FOLLOWERS_COUNT_MAX.toLocaleString()} · Profiles missing required
              fields excluded
            </p>
          </div>
          <DownloadExcelButton
            profiles={filteredProfiles}
            sourceFileLabel={fileLabel}
            className="shrink-0 gap-2 self-start sm:self-auto"
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {fileLabel ? (
              <>
                Loaded{" "}
                <span className="font-medium text-foreground">{fileLabel}</span>
              </>
            ) : (
              "No file loaded yet."
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="min-w-[111px] rounded-md bg-muted px-2 py-1 font-medium tabular-nums">
              Total rows:{" "}
              {isPending ? "..." : rawProfiles.length.toLocaleString()}
            </span>
            <span className="min-w-[118px] rounded-md bg-violet-100 px-2 py-1 font-medium tabular-nums text-violet-900 dark:bg-violet-950 dark:text-violet-100">
              After filters:{" "}
              {isPending ? "..." : filteredProfiles.length.toLocaleString()}
            </span>
          </div>
        </div>

        {isPending ? (
          <div className="w-full h-[30svh] flex items-center justify-center rounded-lg border border-dashed bg-muted/30">
            <Loader2 className="size-8 animate-spin text-pink-300" />
          </div>
        ) : (
          <ProfilesResultsTable profiles={filteredProfiles} />
        )}
      </section>
    </div>
  );
}

export default TablePage;
