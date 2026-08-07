import http from "@c/configs/axiosHttp";
import type {
  BillDataI,
  PostBillDataI,
  PostBillResponseI,
} from "@c/types/billsTypes";
import type { DefaultResponseI } from "@c/types/globalTypes";

export const createBills_API = async (
  data: BillDataI,
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
  const response = await http.delete<DefaultResponseI>(`bills/${id}`);
  return response?.data;
};

export const updateBill_API = async (
  id: string,
  data: Partial<BillDataI>,
): Promise<PostBillResponseI> => {
  const response = await http.patch<PostBillResponseI>(`bills/${id}`, {
    ...data,
  });
  return response?.data;
};

export const getBill_API = async (id: string): Promise<PostBillDataI> => {
  const response = await http.get(`bills/${id}`);
  return response?.data as PostBillDataI;
};
