import {
  billSchema,
  type BillCategoryType,
  type FrequencyTypes,
  type PostBillDataI,
} from "@c/types/billsTypes";
import { useState, type FormEvent } from "react";
import {
  createBills_API,
  deleteBill_API,
  getBill_API,
  listBills_API,
  updateBill_API,
} from "./api/bills-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useBillsHook() {
  const [billList, setBillList] = useState<Array<PostBillDataI> | []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostBillDataI | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<PostBillDataI | null>(null);

  const { handleSubmit, register, reset, control, getValues } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
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
    },
  });
  const getBillData = async (id: string) => {
    setSelectedExp(await getBill_API(id));
  };

  const fetchList = async () => setBillList(await listBills_API());

  const onDelete = async (id: string | null) => {
    if (!id) return false;
    await deleteBill_API(id).then(() => fetchList());
  };

  const onOpenUpdate = (id: string) => {
    const data = billList.find((item) => item?.id == id);
    if (!data) return false;
    setIsUpdate(true);
    setFormData(data);
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isUpdate) setIsUpdate(false);
    const formData = new FormData(event.currentTarget);
    if (isUpdate) {
      return handleUpdate();
    }
    await createBills_API({
      ...{
        name: String(formData.get("name")) as string,
        amount: Number(formData.get("amount")),
        billing_date: String(formData.get("billing_date")),
        end_date: String(formData.get("end_date")),
        status: getValues("status"),
        frequency: getValues("frequency") as FrequencyTypes,
        category: getValues("category") as BillCategoryType,
        is_autopay: getValues("is_autopay"),
        description: formData.get("description") as string,
        default_payment: getValues("default_payment"),
      },
    }).then(async () => {
      await fetchList();
      await resetAll();
    });
    setIsUpdate(false);
  };
  const handleUpdate = async () => {
    if (!getValues()) return false;
    if (!selectedId) return false;

    await updateBill_API(selectedId, getValues()).then(async () => {
      await fetchList();
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
  };
}
