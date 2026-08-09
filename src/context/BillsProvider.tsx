import useBillsHook from "@c/hooks/useBillsHook";
import type { BillDataI, BillFormI, PostBillDataI } from "@c/types/billsTypes";
import {
  createContext,
  useMemo,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import type {
  Control,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

interface BillsContextI {
  bills: Array<PostBillDataI> | [];
  register: UseFormRegister<BillFormI> | null;
  handleSubmit: UseFormHandleSubmit<BillFormI> | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: string) => void;
  onOpenUpdate: (id: string) => void;
  control: Control<BillFormI> | null;
}
interface BillsProviderI {
  children: React.ReactNode;
}

export const BillsContext = createContext<BillsContextI>({
  bills: [],
  register: null,
  handleSubmit: null,
  onSubmit: async () => false,
  isModalOpen: false,
  setIsModalOpen: () => false,
  onDelete: () => false,
  onOpenUpdate: () => false,
  control: null,
});

export default function BillsProvider({ children }: BillsProviderI) {
  const {
    billList,
    register,
    handleSubmit,
    onSubmit,
    isModalOpen,
    setIsModalOpen,
    onDelete,
    onOpenUpdate,
    control,
  } = useBillsHook();

  const providerValues = useMemo<BillsContextI>(
    () => ({
      bills: billList,
      register,
      handleSubmit,
      onSubmit,
      isModalOpen,
      setIsModalOpen,
      onDelete,
      onOpenUpdate,
      control,
    }),
    [billList, isModalOpen],
  );

  return (
    <BillsContext.Provider value={providerValues}>
      {children}
    </BillsContext.Provider>
  );
}
