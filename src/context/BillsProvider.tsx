import useBillsHook from "@c/hooks/useBillsHook";
import type { billSchema, PostBillDataI } from "@c/types/billsTypes";
import type { DefaultResponseI, ErrorResponseI } from "@c/types/globalTypes";
import {
  createContext,
  useEffect,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReturn,
  UseFormTrigger,
} from "react-hook-form";
import { useLocation } from "react-router";
import type z from "zod";
import { useContextProvider } from "./BaseContextProvider";

export type BillFormSchema = z.infer<typeof billSchema>;
interface BillsContextI<T extends FieldValues = BillFormSchema> {
  bills: Array<PostBillDataI> | [];
  register: UseFormRegister<BillFormSchema> | null;
  handleSubmit: UseFormHandleSubmit<BillFormSchema> | null;
  onSubmit: (data: BillFormSchema) => void;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: string) => Promise<DefaultResponseI | null>;
  onOpenUpdate: (id: string) => void;
  control: Control<BillFormSchema> | null;
  billFormErrors?: FieldErrors<BillFormSchema>;
  trigger?: UseFormTrigger<BillFormSchema>;
  errorList: ErrorResponseI;
  formMethod: UseFormReturn<T> | null;
}
interface BillsProviderI {
  children: React.ReactNode;
}

export const BillsContext = createContext<BillsContextI | null>({
  bills: [],
  register: null,
  handleSubmit: null,
  onSubmit: async () => false,
  isModalOpen: false,
  setIsModalOpen: () => false,
  onDelete: async () => null,
  onOpenUpdate: () => false,
  control: null,
  errorList: null,
  formMethod: null,
});

export const useBillContext = () =>
  useContextProvider<BillsContextI>(BillsContext);

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
    billFormErrors,
    errorList,
    trigger,
    formMethod,
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
      billFormErrors,
      errorList,
      trigger,
      formMethod,
    }),
    [billList, isModalOpen, errorList],
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
        amount: "0",
        status: "active",
        is_autopay: true,
        description: "",
        frequency: "monthly",
        category: "other",
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
