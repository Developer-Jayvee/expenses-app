import http from "@c/configs/axiosHttp";
import type {
  DashboardExpensesI,
  DashboardSummaryI,
  ExpensesPeriodT,
} from "@c/types/dashboardTypes";

export const dashboardSummary_API = async (): Promise<DashboardSummaryI> => {
  const response = await http.get("dashboard/summary");
  return response?.data as DashboardSummaryI;
};

export const dashboardExpenses_API = async (
  period: ExpensesPeriodT,
): Promise<DashboardExpensesI> => {
  const response = await http.get("dashboard/expenses", { params: { period } });
  return response?.data as DashboardExpensesI;
};
