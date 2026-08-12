import http from "@c/configs/axiosHttp";
import type { DefaultResponseI } from "@c/types/globalTypes";
import type {
  ExtendedLogPayment,
  TransactionDataI,
} from "@c/types/transactionTypes";

type ResponseType = DefaultResponseI<Array<TransactionDataI>>;

export const BASE_TRANSACTION_URL = "transaction";
export const createTransaction_API = async (
  data: ExtendedLogPayment,
): Promise<ResponseType> => {
  const response = await http.post<ResponseType>(
    `${BASE_TRANSACTION_URL}/create`,
    { ...data },
  );
  return response?.data;
};
