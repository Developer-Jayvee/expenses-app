import useBillsHook from "@c/hooks/useBillsHook";
import type { billSchema, PostBillDataI } from "@c/types/billsTypes";
import {
  createContext,
  useEffect,
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
import { useLocation } from "react-router";
import type z from "zod";

type BillFormSchema = z.infer<typeof billSchema>;
interface BillsContextI {
  bills: Array<PostBillDataI> | [];
  register: UseFormRegister<BillFormSchema> | null;
  handleSubmit: UseFormHandleSubmit<BillFormSchema> | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: string) => void;
  onOpenUpdate: (id: string) => void;
  control: Control<BillFormSchema> | null;
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
  const location = useLocation();

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
    fetchList,
    reset,
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
  useEffect(() => {
    const abort = new AbortController();
    fetchList();
    return () => {
      abort.abort();
    };
  }, [location.pathname]);
  useEffect(() => {
    if (!isModalOpen)
      reset({
        name: "",
        amount: 0,
        status: "active",
        is_autopay: true,
        description: "",
        frequency: "monthly",
        category: "",
        billing_date: new Date("Y-m-d").toLocaleDateString(),
        end_date: new Date().toLocaleDateString(),
        default_payment: "cash",
      });
  }, [isModalOpen, reset]);

  return (
    <BillsContext.Provider value={providerValues}>
      {children}
    </BillsContext.Provider>
  );
}
