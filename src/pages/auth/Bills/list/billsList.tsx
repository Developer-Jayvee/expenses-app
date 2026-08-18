import { IoSearchOutline } from "react-icons/io5";
import { useBillContext } from "@c/context/providers/BillsProvider";
import useBillActionsHook from "@c/hooks/useBillActionsHook";
import useBillsListHook, {
  type BillSortT,
  type BillStatusFilterT,
} from "@c/hooks/useBillsListHook";
import BillsDataTable from "../components/bills-data-table";
import BillCardsGrid from "../components/bill-table";
import { Input } from "@c/lib/shadcn/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@c/lib/shadcn/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@c/lib/shadcn/components/ui/pagination";

const STATUS_TABS: Array<{ key: BillStatusFilterT; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "ongoing", label: "Ongoing" },
  { key: "inactive", label: "Inactive" },
  { key: "completed", label: "Completed" },
];

const PAGE_SIZE_OPTIONS = [12, 25, 50, 100];

type PageEntry = number | "ellipsis";

const getPageEntries = (current: number, last: number): PageEntry[] => {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

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

export default function BillsList() {
  const { bills } = useBillContext();
  const { handleOpen, handleDelete } = useBillActionsHook();
  const {
    query,
    onQueryChange,
    status,
    onStatusChange,
    sort,
    onSortChange,
    view,
    onViewChange,
    counts,
    pageItems,
    filteredCount,
    page,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
  } = useBillsListHook(bills);

  const rangeStart = filteredCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredCount);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3.5">
        <div className="relative min-w-55 flex-1">
          <IoSearchOutline
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            size={15}
          />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search biller or category…"
            className="h-10 pl-9"
          />
        </div>

        <Tabs
          value={status}
          onValueChange={(value) => onStatusChange(value as BillStatusFilterT)}
        >
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                <span className="text-[11px] font-bold opacity-60 tabular-nums">
                  {counts[tab.key] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as BillSortT)}
          className="h-10 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="due">Sort: Next due</option>
          <option value="amountDesc">Sort: Amount (high→low)</option>
          <option value="amountAsc">Sort: Amount (low→high)</option>
          <option value="name">Sort: Biller A→Z</option>
        </select>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => onViewChange("table")}
            className={`h-8 rounded-md px-3 text-sm font-semibold transition-colors ${
              view === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => onViewChange("cards")}
            className={`h-8 rounded-md px-3 text-sm font-semibold transition-colors ${
              view === "cards"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {view === "table" ? (
        <BillsDataTable
          bills={pageItems}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
      ) : (
        <div className="p-4">
          <BillCardsGrid
            bills={pageItems}
            onOpen={handleOpen}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-muted/30 px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {filteredCount === 0
            ? "No results"
            : `Showing ${rangeStart}–${rangeEnd} of ${filteredCount} bills`}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Rows
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground outline-none dark:bg-input/30"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {totalPages > 1 && (
            <Pagination className="w-fit justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                  />
                </PaginationItem>
                {getPageEntries(page, totalPages).map((entry, index) =>
                  entry === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={entry}>
                      <PaginationLink
                        isActive={entry === page}
                        onClick={() => onPageChange(entry)}
                      >
                        {entry}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
