import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@c/lib/shadcn/components/ui/pagination";
import type { ActivityMetaI } from "@c/types/activityTypes";

interface ActivityPaginationI {
  meta: ActivityMetaI | null;
  onPageChange: (page: number) => void;
}

type PageEntry = number | "ellipsis";

const getPageEntries = (current: number, last: number): PageEntry[] => {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages = [...new Set([1, last, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= last)
    .sort((a, b) => a - b);

  return pages.reduce<PageEntry[]>((entries, page, index) => {
    if (index > 0 && page - (pages[index - 1] as number) > 1) {
      entries.push("ellipsis");
    }
    entries.push(page);
    return entries;
  }, []);
};

export default function ActivityPagination({
  meta,
  onPageChange,
}: ActivityPaginationI) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page } = meta;

  return (
    <div className="flex items-center justify-between gap-4 border-t bg-muted/30 px-5 py-3">
      <span className="text-xs text-muted-foreground">
        Page {current_page} of {last_page}
      </span>
      <Pagination className="w-fit justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={current_page <= 1}
              onClick={() => onPageChange(current_page - 1)}
            />
          </PaginationItem>
          {getPageEntries(current_page, last_page).map((entry, index) =>
            entry === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  isActive={entry === current_page}
                  onClick={() => onPageChange(entry)}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              disabled={current_page >= last_page}
              onClick={() => onPageChange(current_page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
