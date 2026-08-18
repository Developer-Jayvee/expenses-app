import { createContext, useContext } from "react";

export interface BillFormLockStateI {
  mode: "create" | "edit";
  locked: boolean;
}

export const BillFormLockContext = createContext<BillFormLockStateI>({
  mode: "create",
  locked: false,
});

export const useBillFormLock = () => useContext(BillFormLockContext);
