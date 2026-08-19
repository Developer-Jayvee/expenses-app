import type { BillCategoryType, BillStatusT } from "@c/types/billsTypes";

export interface MonthlyExpenseI {
  month: number;
  label: string;
  total: number;
}

export interface BillCategoryTotalI {
  category: BillCategoryType | "uncategorized";
  label: string;
  total: number;
}

export interface UpcomingBillI {
  id: number;
  name: string;
  amount: number;
  category: BillCategoryType | null;
  category_label: string | null;
  due_date: string;
  status: BillStatusT;
}

export interface DashboardSummaryI {
  year: number;
  monthly_expenses: MonthlyExpenseI[];
  bills_by_category: BillCategoryTotalI[];
  upcoming_bills: UpcomingBillI[];
}

export type ExpensesPeriodT = "monthly" | "weekly";

export interface ExpensePointI {
  label: string;
  total: number;
}

export interface DashboardExpensesI {
  period: ExpensesPeriodT;
  data: ExpensePointI[];
}
