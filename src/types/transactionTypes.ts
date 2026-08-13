import z from "zod";
import type { UserInterface } from "./login-types";

export interface TransactionDataI {
  amount: number;
  payment_mode: "gcash" | "cash";
  transaction_date: string;
  notes: string | null;
}
export interface TransactionResourceI {
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
}
export interface TransactionOutletI {
  list: TransactionResourceI[] | null;
}
