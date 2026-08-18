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
  onSubmit: (data: BillFormSchema) => Promise<boolean>;
  onUpdate: (id: string, data: BillFormSchema) => Promise<boolean>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: string) => Promise<DefaultResponseI | null>;
  onOpenUpdate: (id: string) => void;
  control: Control<BillFormSchema> | null;
  billFormErrors?: FieldErrors<BillFormSchema>;
  trigger?: UseFormTrigger<BillFormSchema>;
  errorList: ErrorResponseI;
  formMethod: UseFormReturn<T> | null;
  setFormMode: (mode: "create" | "edit") => void;
}
interface BillsProviderI {
  children: React.ReactNode;
}

export const BillsContext = createContext<BillsContextI | null>({
  bills: [],
  register: null,
  handleSubmit: null,
  onSubmit: async () => false,
  onUpdate: async () => false,
  isModalOpen: false,
  setIsModalOpen: () => false,
  onDelete: async () => null,
  onOpenUpdate: () => false,
  control: null,
  errorList: null,
  formMethod: null,
  setFormMode: () => undefined,
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
    onUpdate,
    isModalOpen,
    setIsModalOpen,
    onDelete,
    onOpenUpdate,
    control,
    fetchList,
    billFormErrors,
    errorList,
    trigger,
    formMethod,
    setFormMode,
  } = useBillsHook();

  const providerValues = useMemo<BillsContextI>(
    () => ({
      bills: billList,
      register,
      handleSubmit,
      onSubmit,
      onUpdate,
      isModalOpen,
      setIsModalOpen,
      onDelete,
      onOpenUpdate,
      control,
      billFormErrors,
      errorList,
      trigger,
      formMethod,
      setFormMode,
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
  return (
    <BillsContext.Provider value={providerValues}>
      {children}
    </BillsContext.Provider>
  );
}
