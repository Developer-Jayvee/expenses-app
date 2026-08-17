import http from "@c/configs/axiosHttp";
import type { DefaultResponseI } from "@c/types/globalTypes";
import type {
  ExtendedLogPayment,
  TransactionDataI,
  TransactionResourceI,
} from "@c/types/transactionTypes";

type CreateResponseType = DefaultResponseI<Array<TransactionDataI>>;

export const BASE_TRANSACTION_URL = "transaction";
export const createTransaction_API = async (
  data: ExtendedLogPayment,
): Promise<CreateResponseType> => {
  const response = await http.post(`${BASE_TRANSACTION_URL}/create`, {
    ...data,
  });
  return response as unknown as CreateResponseType;
};

export const userTransactions_API = async (
  billId: string,
): Promise<TransactionResourceI[]> => {
  const response = await http.get(`${BASE_TRANSACTION_URL}/${billId}/list`);
  return response?.data;
};

export const deleteTransaction_API = async (
  id: string | number,
): Promise<DefaultResponseI> => {
  const response = await http.delete(`${BASE_TRANSACTION_URL}/${id}/delete`);
  return response as unknown as DefaultResponseI;
};
