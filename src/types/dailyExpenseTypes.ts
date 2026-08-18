import z from "zod";
import type { DefaultResponseI } from "@c/types/globalTypes";

export type DailyExpenseTypeT = "food" | "utilities" | "gas" | "transport_fee";

export const DailyExpenseTypeSchema = z.enum([
  "food",
  "utilities",
  "gas",
  "transport_fee",
]);

export type DailyBudgetStatusT = "active" | "done" | "cancelled";

export type DailyPaymentTypeT = "cash" | "gcash";

export interface DailyExpenseI {
  id: string | number;
  daily_budget_id?: string | number;
  name: string;
  type: DailyExpenseTypeT;
  type_label: string;
  amount: number;
  payment_type: DailyPaymentTypeT;
  payment_type_label: string;
  created_at: string;
}

export interface DailyBudgetI {
  id: string | number;
  name: string;
  budget_amount: number;
  status: DailyBudgetStatusT;
  status_label: string;
  budget_date: string;
  total_spent: number;
  remaining_budget: number;
  expenses_count: number;
  created_at: string;
  expenses?: DailyExpenseI[];
}

export const startBudgetSchema = z.object({
  name: z.string().min(1, "Transaction name is required."),
  budget_amount: z
    .string()
    .min(1, "Budget amount is required.")
    .refine(
      (value) => Number(value) > 0,
      "Budget amount must be greater than 0.",
    ),
});
export type StartBudgetFormT = z.infer<typeof startBudgetSchema>;

export const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required."),
  type: DailyExpenseTypeSchema,
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((value) => Number(value) > 0, "Amount must be greater than 0."),
  payment_type: z.enum(["cash", "gcash"]),
});
export type ExpenseFormT = z.infer<typeof expenseSchema>;

export const getDefaultStartBudgetFormValues = (): StartBudgetFormT => ({
  name: "",
  budget_amount: "",
});

export const getDefaultExpenseFormValues = (): ExpenseFormT => ({
  name: "",
  type: "food",
  amount: "",
  payment_type: "cash",
});

export type DailyBudgetResponseI = DefaultResponseI<DailyBudgetI>;
export type DailyActiveBudgetResponseI = DefaultResponseI<DailyBudgetI | null>;
export type DailyBudgetListResponseI = DefaultResponseI<DailyBudgetI[]>;

export interface DailyBudgetListFiltersI {
  name?: string;
  date?: string;
}
