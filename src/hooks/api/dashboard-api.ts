import http from "@c/configs/axiosHttp";
import type { DashboardSummaryI } from "@c/types/dashboardTypes";

export const dashboardSummary_API = async (): Promise<DashboardSummaryI> => {
  const response = await http.get("dashboard/summary");
  return response?.data as DashboardSummaryI;
};
