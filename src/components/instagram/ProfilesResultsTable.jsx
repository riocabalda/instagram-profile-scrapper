import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { getProfileRowValues } from "@/utils/profileRowValues";
import { useProfileDatasetStore } from "@/stores/profileDatasetStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CopyTextButton from "@/components/instagram/CopyTextButton";

/**
 * @param {{ profiles: Record<string, unknown>[]; isLoading?: boolean; className?: string }} props
 */
function ProfilesResultsTable({ profiles, className }) {
  const urlClickedRowIndex = useProfileDatasetStore(
    (s) => s.urlClickedRowIndexes,
  );
  const addUrlClickedRow = useProfileDatasetStore((s) => s.addUrlClickedRow);

  if (profiles.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed bg-muted/30 px-6 py-16 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        No profiles match the filters. Upload a dataset or adjust your source
        file.
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 min-w-[3rem] text-center tabular-nums">
              #
            </TableHead>
            <TableHead className="min-w-[140px]">Full name</TableHead>
            <TableHead className="min-w-[160px]">Username</TableHead>
            <TableHead className="min-w-[220px]">URL</TableHead>
            <TableHead className="w-[120px] whitespace-nowrap">
              Followers
            </TableHead>
            <TableHead className="min-w-[240px]">Bio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile, index) => {
            const row = getProfileRowValues(profile);
            const username = row.username;
            const url = row.url;
            const key =
              typeof profile.id === "string" || typeof profile.id === "number"
                ? String(profile.id)
                : `${username || "row"}-${index}`;

            const isUrlRowActive = urlClickedRowIndex.includes(index);
            const rowNumber = index + 1;
            const followersDisplay =
              row.followersValue === null
                ? "—"
                : row.followersValue.toLocaleString();

            return (
              <TableRow
                key={key}
                className={cn(
                  isUrlRowActive &&
                    "bg-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/45",
                )}
              >
                <TableCell className="text-center tabular-nums text-muted-foreground">
                  {rowNumber}
                </TableCell>
                <TableCell className="font-medium">
                  {row.fullName || ""}
                </TableCell>
                <TableCell className="">
                  <div className="flex items-start gap-1">
                    <span className="break-all pt-2 text-sm">
                      {username || "—"}
                    </span>
                    <CopyTextButton
                      text={username}
                      label="Copy username"
                      className="mt-0.5"
                    />
                  </div>
                </TableCell>
                <TableCell className="">
                  {url ? (
                    <div className="flex items-start gap-1">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => addUrlClickedRow(index)}
                        className="inline-flex max-w-[min(420px,55vw)] items-center gap-1 break-all pt-2 text-sm font-medium underline-offset-4 hover:text-blue-400 hover:underline dark:text-white  dark:hover:text-blue-400"
                      >
                        <span className="line-clamp-2">{url}</span>
                        <ExternalLink
                          className="size-3.5 shrink-0 opacity-70"
                          aria-hidden
                        />
                      </a>
                      <CopyTextButton text={url} label="Copy URL" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="tabular-nums">
                  {followersDisplay}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <span className="line-clamp-4 whitespace-pre-wrap break-words">
                    {row.bio || "—"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProfilesResultsTable;
