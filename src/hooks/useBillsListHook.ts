import { useMemo, useState } from "react";
import type { BillStatusT, PostBillDataI } from "@c/types/billsTypes";

export type BillSortT = "due" | "amountDesc" | "amountAsc" | "name";
export type BillViewT = "table" | "cards";
export type BillStatusFilterT = "all" | BillStatusT;

const DEFAULT_PAGE_SIZE = 12;

export default function useBillsListHook(bills: Array<PostBillDataI>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BillStatusFilterT>("all");
  const [sort, setSort] = useState<BillSortT>("due");
  const [view, setView] = useState<BillViewT>("table");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const counts = useMemo(() => {
    const result: Record<BillStatusFilterT, number> = {
      all: bills.length,
      active: 0,
      ongoing: 0,
      inactive: 0,
      completed: 0,
    };
    bills.forEach((bill) => {
      result[bill.status] += 1;
    });
    return result;
  }, [bills]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let rows = bills;
    if (status !== "all") rows = rows.filter((bill) => bill.status === status);
    if (term)
      rows = rows.filter(
        (bill) =>
          bill.name.toLowerCase().includes(term) ||
          (bill.category ?? "").toLowerCase().includes(term),
      );
    return [...rows].sort((a, b) => {
      if (sort === "amountDesc") return Number(b.amount) - Number(a.amount);
      if (sort === "amountAsc") return Number(a.amount) - Number(b.amount);
      if (sort === "name") return a.name.localeCompare(b.name);
      return (
        new Date(a.billing_date).getDate() - new Date(b.billing_date).getDate()
      );
    });
  }, [bills, status, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const onQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const onStatusChange = (value: BillStatusFilterT) => {
    setStatus(value);
    setPage(1);
  };
  const onSortChange = (value: BillSortT) => {
    setSort(value);
    setPage(1);
  };
  const onPageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  return {
    query,
    onQueryChange,
    status,
    onStatusChange,
    sort,
    onSortChange,
    view,
    onViewChange: setView,
    counts,
    pageItems,
    filteredCount: filtered.length,
    page: currentPage,
    totalPages,
    onPageChange: setPage,
    pageSize,
    onPageSizeChange,
  };
}
