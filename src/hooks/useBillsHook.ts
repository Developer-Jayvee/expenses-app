import {
  createBillSchema,
  editBillSchema,
  getDefaultBillFormValues,
  type PostBillDataI,
} from "@c/types/billsTypes";
import { useRef, useState } from "react";
import {
  createBills_API,
  deleteBill_API,
  getBill_API,
  listBills_API,
  updateBill_API,
} from "./api/bills-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DefaultResponseI, ErrorResponseI } from "@c/types/globalTypes";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import type { BillFormSchema } from "@c/context/providers/BillsProvider";

export default function useBillsHook() {
  const [billList, setBillList] = useState<Array<PostBillDataI> | []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostBillDataI | null>(null);
  const [, setSelectedId] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<PostBillDataI | null>(null);
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);
  const formModeRef = useRef<"create" | "edit">("create");
  const setFormMode = (mode: "create" | "edit") => {
    formModeRef.current = mode;
  };
  const formMethod = useForm<BillFormSchema>({
    resolver: (values, context, options) =>
      zodResolver(
        formModeRef.current === "edit" ? editBillSchema : createBillSchema,
      )(values, context, options),
    defaultValues: getDefaultBillFormValues(),
  });
  const {
    trigger,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    formState: { errors: billFormErrors },
  } = formMethod;
  const getBillData = async (id: string): Promise<PostBillDataI | null> => {
    try {
      const data = await getBill_API(id);
      const bill = data?.id ? data : null;
      setSelectedExp(bill);
      return bill;
    } catch {
      setSelectedExp(null);
      return null;
    }
  };

  const fetchList = async () => setBillList(await listBills_API());

  const onDelete = async (
    id: string | null,
  ): Promise<DefaultResponseI | null> => {
    if (!id) return null;
    const response = await deleteBill_API(id);
    if (response.status) {
      await fetchList();
    }
    return response;
  };

  const onOpenUpdate = (id: string) => {
    const data = billList.find((item) => item?.id == id);
    if (!data) return false;
    setFormData(data);
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const onSubmit = async (data: BillFormSchema): Promise<boolean> => {
    let success = false;
    await createBills_API({
      ...data,
    })
      .then(async () => {
        await resetAll();
        success = true;
      })
      .catch((err) => {
        const errors = extractRawHttpError(err);
        setErrorList(errors);
      });
    return success;
  };
  const resetAll = async () => {
    setIsModalOpen(false);
    setSelectedId(null);
    await fetchList();
  };

  const onUpdate = async (
    id: string,
    data: BillFormSchema,
  ): Promise<boolean> => {
    let success = false;
    await updateBill_API(id, data)
      .then(() => {
        success = true;
      })
      .catch((err) => {
        const errors = extractRawHttpError(err);
        setErrorList(errors);
      });
    return success;
  };

  return {
    billList,
    setBillList,
    fetchList,
    handleSubmit,
    register,
    control,
    onSubmit,
    onUpdate,
    setIsModalOpen,
    isModalOpen,
    onDelete,
    onOpenUpdate,
    formData,
    getBillData,
    selectedExp,
    reset,
    getValues,
    billFormErrors,
    errorList,
    trigger,
    formMethod,
    setFormMode,
  };
}
