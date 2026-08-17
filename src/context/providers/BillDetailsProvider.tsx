import type { PostBillDataI } from "@c/types/billsTypes";
import { createContext, useMemo } from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import useBillsHook from "@c/hooks/useBillsHook";

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
  const { getBillData, selectedExp } = useBillsHook();
  const values: BillContextI = useMemo(
    () => ({
      details: selectedExp,
      getCallback: getBillData,
    }),
    [selectedExp],
  );
  return (
    <ContextProvider<BillContextI | null>
      context={BillDetailContext}
      values={values}
    >
      {children}
    </ContextProvider>
  );
};
