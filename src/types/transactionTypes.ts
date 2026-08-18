import z from "zod";
import type { UserInterface } from "./login-types";

export const TRANSACTION_DELETE_WINDOW_MS = 10000;
export const TRANSACTION_PAGE_SIZE = 5;

export interface TransactionDataI {
  amount: number;
  payment_mode: "gcash" | "cash";
  transaction_date: string;
  notes: string | null;
}
export interface TransactionResourceI {
  id: string | number;
  bills_id: string | number;
  user_id: string | number;
  user: UserInterface;
  payment_mode: {
    value: string;
    label: string;
  };
  amount: number;
  change: number;
  order: number;
  notes: string | null;
  transaction_date: string;
  created_at: string;
}
export const logPaymentSchema = z.object({
  amount: z.number(),
  payment_mode: z.enum(["gcash", "cash"]),
  transaction_date: z.string(),
  notes: z.string().optional(),
});
export type LogPaymentType = z.infer<typeof logPaymentSchema>;
export interface ExtendedLogPayment extends LogPaymentType {
  billsId: string;
}

export interface TransactionsTableI<T = TransactionResourceI[] | null> {
  list: T;
  onDelete?: (transaction: TransactionResourceI) => void;
  pendingDeleteIds?: Set<string | number>;
}

export type TransactionSortByI =
  "transaction_date" | "amount" | "created_at" | "order";
export type TransactionSortDirI = "asc" | "desc";

export interface TransactionListParamsI {
  page?: number;
  per_page?: number;
  sort_by?: TransactionSortByI;
  sort_dir?: TransactionSortDirI;
}

export interface TransactionMetaI {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
}

export interface TransactionSummaryI {
  total_paid: number;
  payments_count: number;
  last_payment: TransactionResourceI | null;
}

export interface TransactionListResponseI {
  items: TransactionResourceI[];
  meta: TransactionMetaI;
  summary: TransactionSummaryI;
}

export interface TransactionOutletI {
  list: TransactionResourceI[] | null;
  onDelete: (transaction: TransactionResourceI) => void;
  pendingDeleteIds: Set<string | number>;
  meta: TransactionMetaI | null;
  summary: TransactionSummaryI | null;
  onPageChange: (page: number) => void;
}
