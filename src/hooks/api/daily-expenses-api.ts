import http from "@c/configs/axiosHttp";
import type {
  DailyActiveBudgetResponseI,
  DailyBudgetI,
  DailyBudgetListFiltersI,
  DailyBudgetListResponseI,
  DailyBudgetResponseI,
  expenseSchema,
  startBudgetSchema,
} from "@c/types/dailyExpenseTypes";
import type { DefaultResponseI } from "@c/types/globalTypes";
import type z from "zod";

const BASE_URL = "daily-budgets";

export const listDailyBudgets_API = async (
  filters?: DailyBudgetListFiltersI,
): Promise<DailyBudgetI[]> => {
  const response = await http.get(BASE_URL, { params: filters });
  return (response as unknown as DailyBudgetListResponseI)?.data ?? [];
};

export const getActiveBudget_API = async (): Promise<DailyBudgetI | null> => {
  const response = await http.get(`${BASE_URL}/active`);
  return (response as unknown as DailyActiveBudgetResponseI)?.data ?? null;
};

export const getDailyBudget_API = async (
  id: string | number,
): Promise<DailyBudgetI | null> => {
  const response = await http.get(`${BASE_URL}/${id}/details`);
  return (response as unknown as DailyBudgetResponseI)?.data ?? null;
};

export const createDailyBudget_API = async (
  data: z.infer<typeof startBudgetSchema>,
): Promise<DailyBudgetResponseI> => {
  const response = await http.post<DailyBudgetResponseI>(BASE_URL, {
    ...data,
  });
  return response as unknown as DailyBudgetResponseI;
};

export const markBudgetDone_API = async (
  id: string | number,
): Promise<DailyBudgetResponseI> => {
  const response = await http.patch<DailyBudgetResponseI>(
    `${BASE_URL}/${id}/done`,
  );
  return response as unknown as DailyBudgetResponseI;
};

export const cancelBudget_API = async (
  id: string | number,
): Promise<DailyBudgetResponseI> => {
  const response = await http.patch<DailyBudgetResponseI>(
    `${BASE_URL}/${id}/cancel`,
  );
  return response as unknown as DailyBudgetResponseI;
};

export const continueBudget_API = async (
  id: string | number,
): Promise<DailyBudgetResponseI> => {
  const response = await http.patch<DailyBudgetResponseI>(
    `${BASE_URL}/${id}/continue`,
  );
  return response as unknown as DailyBudgetResponseI;
};

export const deleteBudget_API = async (
  id: string | number,
): Promise<DefaultResponseI<null>> => {
  const response = await http.delete<DefaultResponseI<null>>(
    `${BASE_URL}/${id}/delete`,
  );
  return response as unknown as DefaultResponseI<null>;
};

export const createExpense_API = async (
  budgetId: string | number,
  data: z.infer<typeof expenseSchema>,
): Promise<DailyBudgetResponseI> => {
  const response = await http.post<DailyBudgetResponseI>(
    `${BASE_URL}/${budgetId}/expenses`,
    { ...data },
  );
  return response as unknown as DailyBudgetResponseI;
};

export const deleteExpense_API = async (
  id: string | number,
): Promise<DailyBudgetResponseI> => {
  const response = await http.delete<DailyBudgetResponseI>(
    `${BASE_URL}/expenses/${id}/delete`,
  );
  return response as unknown as DailyBudgetResponseI;
};
