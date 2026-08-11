import type { PostBillDataI } from "@c/types/billsTypes";
import { createContext, useState } from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import { getBill_API } from "@c/hooks/api/bills/bills-api";

interface ProviderI {
  children: React.ReactNode;
}
export interface BillContextI {
  details: PostBillDataI | null;
  getCallback: (id: string) => void;
}
export const BillDetailContext = createContext<BillContextI | null>({
  details: null,
  getCallback: () => {},
});
export const useBillDetail = () =>
  useContextProvider<BillContextI>(BillDetailContext);
export const BillContextProvider = ({ children }: ProviderI) => {
  const [selectedExp, setSelectedExp] = useState<PostBillDataI | null>(null);

  const values: BillContextI = {
    details: selectedExp,
    getCallback: async (id: string) => setSelectedExp(await getBill_API(id)),
  };
  return (
    <ContextProvider<BillContextI | null>
      context={BillDetailContext}
      values={values}
    >
      {children}
    </ContextProvider>
  );
};
