import http from "@c/configs/axiosHttp";
import type { BillFormSchema } from "@c/context/providers/BillsProvider";
import type {
  billSchema,
  PostBillDataI,
  PostBillResponseI,
} from "@c/types/billsTypes";
import type { DefaultResponseI } from "@c/types/globalTypes";
import type z from "zod";

export const createBills_API = async (
  data: BillFormSchema,
): Promise<PostBillResponseI> => {
  const response = await http.post<PostBillResponseI>("bills", {
    ...data,
  });
  return response?.data;
};

export const listBills_API = async (): Promise<PostBillDataI[]> => {
  const response = await http.get("bills");
  return response?.data;
};

export const deleteBill_API = async (id: string): Promise<DefaultResponseI> => {
  const response = await http.delete<DefaultResponseI>(`bills/${id}/delete`);
  return response?.data;
};

export const updateBill_API = async (
  id: string,
  data: Partial<z.infer<typeof billSchema>>,
): Promise<PostBillResponseI> => {
  const response = await http.patch<PostBillResponseI>(`bills/${id}/update`, {
    ...data,
  });
  return response?.data;
};

export const getBill_API = async (id: string): Promise<PostBillDataI> => {
  const response = await http.get(`bills/${id}/details`);
  return response?.data as PostBillDataI;
};
