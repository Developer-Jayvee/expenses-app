import { billSchema, type PostBillDataI } from "@c/types/billsTypes";
import { useEffect, useState, type FormEvent } from "react";
import {
  createBills_API,
  deleteBill_API,
  listBills_API,
  updateBill_API,
} from "./api/bills/bills-api";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useBillsHook() {
  const location = useLocation();
  const [billList, setBillList] = useState<Array<PostBillDataI> | []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostBillDataI | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { handleSubmit, register, reset, control, getValues } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billing_date: new Date("Y-m-d").toLocaleDateString(),
      end_date: new Date().toLocaleDateString(),
    },
  });

  const fetchList = async () => setBillList(await listBills_API());

  const onDelete = async (id: string) => {
    await deleteBill_API(id).then(() => fetchList());
  };

  const onOpenUpdate = (id: string) => {
    const data = billList.find((item) => item?.id == id);
    if (!data) return false;
    setIsUpdate(true);
    setFormData(data);
    setIsModalOpen(true);
    setSelectedId(id);
    reset({ ...data });
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
        name: String(formData.get("name")),
        amount: Number(formData.get("amount")),
        billing_date: String(formData.get("billing_date")),
        end_date: String(formData.get("end_date")),
        status: "active",
      },
    })
      .then(async () => await fetchList())
      .finally(async () => await resetAll());

    setIsUpdate(false);
  };
  const handleUpdate = async () => {
    if (!getValues()) return false;
    if (!selectedId) return false;

    await updateBill_API(selectedId, getValues())
      .then(async () => await fetchList())
      .finally(async () => await resetAll());
  };
  const resetAll = async () => {
    setIsModalOpen(false);
    setSelectedId(null);
    await fetchList();
  };

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
        status: "active",
        amount: 0,
        name: "",
        billing_date: "",
        end_date: "",
      });
  }, [isModalOpen, reset]);

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
  };
}
