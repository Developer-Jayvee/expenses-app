import { billSchema, type PostBillDataI } from "@c/types/billsTypes";
import { useState } from "react";
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
import type { BillFormSchema } from "@c/context/BillsProvider";

export default function useBillsHook() {
  const [billList, setBillList] = useState<Array<PostBillDataI> | []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostBillDataI | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<PostBillDataI | null>(null);
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);
  const formMethod = useForm<BillFormSchema>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      name: "",
      amount: "0",
      status: "active",
      is_autopay: true,
      description: "",
      category: "other",
      frequency: "monthly",
      billing_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      default_payment: "cash",
    },
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
  const getBillData = async (id: string) => {
    setSelectedExp(await getBill_API(id));
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
    setIsUpdate(true);
    setFormData(data);
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const onSubmit = async (data: BillFormSchema) => {
    await createBills_API({
      ...data,
    })
      .then(async () => {
        await resetAll();
      })
      .catch((err) => {
        const errors = extractRawHttpError(err);
        setErrorList(errors);
      });
    setIsUpdate(false);
  };
  const handleUpdate = async () => {
    if (!getValues()) return false;
    if (!selectedId) return false;

    await updateBill_API(selectedId, getValues()).then(async () => {
      await resetAll();
    });
  };
  const resetAll = async () => {
    setIsModalOpen(false);
    setSelectedId(null);
    await fetchList();
  };

  return {
    billList,
    setBillList,
    fetchList,
    handleSubmit,
    register,
    control,
    onSubmit,
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
  };
}
