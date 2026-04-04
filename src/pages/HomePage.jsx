import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfileDatasetStore } from "@/stores/profileDatasetStore";
import { parseProfileDatasetBuffer } from "@/utils/parseProfileDataset";
import { countProfilesWithMissingFields } from "@/utils/profileFieldCompleteness";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FOLLOWERS_COUNT_MAX,
  FOLLOWERS_COUNT_MIN,
} from "@/constants/instagramDataset";
import JsonUploadField from "@/components/instagram/JsonUploadField";

function HomePage() {
  const navigate = useNavigate();
  const setDataset = useProfileDatasetStore((s) => s.setDataset);
  const [isParsing, setIsParsing] = useState(false);

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
            `${missingCount} profile${
              missingCount === 1 ? "" : "s"
            } missing required fields (username, URL/inputUrl, or followersCount).`,
          );
        } else {
          toast.success(
            "Dataset loaded. All profiles include required fields.",
          );
        }

        setDataset(asRecords, meta.name);
        navigate("/table");
      } catch {
        toast.error("Could not read that file. Try again.");
      } finally {
        setIsParsing(false);
      }
    },
    [setDataset, navigate],
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile filter
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Upload your scraper JSON (array of creators). We validate the shape,
            flag incomplete rows, and list only public profiles whose follower
            count is between {FOLLOWERS_COUNT_MIN.toLocaleString()} and{" "}
            {FOLLOWERS_COUNT_MAX.toLocaleString()}. Large JSON files are parsed
            in a background worker and trimmed to the fields this UI needs, so
            hundreds of profiles stay fast.
          </p>
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
            <code className="rounded bg-muted px-1 py-0.5 text-xs">url</code> or{" "}
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
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
