import { useMemo } from "react";
import { Outlet } from "react-router";
import { FormProvider } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import BillForm from "./components/BillForm/billForm";
import { useModal } from "@c/context/providers/ModalProvider";
import { useBillContext } from "@c/context/providers/BillsProvider";
import {
  DialogDescription,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import { Button } from "@c/lib/shadcn/components/ui/button";
import type { PostBillDataI } from "@c/types/billsTypes";

const CreateForm = () => {
  const { formMethod, onSubmit, handleSubmit } = useBillContext();
  const { onClose } = useModal();
  if (!formMethod) return null;
  return (
    <FormProvider {...formMethod}>
      <form
        onSubmit={handleSubmit?.(async (data) => {
          const success = await onSubmit(data);
          if (success) onClose();
        })}
      >
        <BillForm />
      </form>
    </FormProvider>
  );
};

const CreateFormHeader = () => (
  <>
    <DialogTitle>Create new Bill</DialogTitle>
    <DialogDescription>Create new bill data here.</DialogDescription>
  </>
);

const short_money = (n: number) =>
  n >= 1_000_000
    ? `₱${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `₱${(n / 1_000).toFixed(1)}k`
      : `₱${Math.round(n)}`;

const csv_escape = (value: string | number) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export default function BillsPage() {
  const { bills } = useBillContext();
  const { configureModal, onOpen } = useModal();

  const handleCreate = () => {
    configureModal?.({
      type: "general",
      content: <CreateForm />,
      size: "xl",
      showFooter: false,
      header: <CreateFormHeader />,
    });
    onOpen();
  };

  const handleExport = () => {
    const header = [
      "Biller",
      "Category",
      "Amount",
      "Status",
      "Monthly Deadline",
      "End Date",
    ];
    const rows = bills.map((bill) => [
      bill.name,
      bill.category,
      bill.amount,
      bill.status,
      `Day ${new Date(bill.billing_date).getDate()}`,
      bill.end_date,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(csv_escape).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bills.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const sum = (list: Array<PostBillDataI>) =>
      list.reduce((total, bill) => total + Number(bill.amount || 0), 0);
    const pending = bills.filter(
      (bill) => bill.status === "active" || bill.status === "ongoing",
    );
    const inactive = bills.filter((bill) => bill.status === "inactive");
    const completed = bills.filter((bill) => bill.status === "completed");

    return [
      {
        label: "Active & Ongoing",
        value: short_money(sum(pending)),
        sub: `${pending.length.toLocaleString()} bills upcoming`,
      },
      {
        label: "Inactive",
        value: short_money(sum(inactive)),
        sub: `${inactive.length.toLocaleString()} paused bills`,
        muted: true,
      },
      {
        label: "Completed",
        value: short_money(sum(completed)),
        sub: `${completed.length.toLocaleString()} settled`,
        accent: "text-emerald-600 dark:text-emerald-400",
      },
      {
        label: "Monthly Committed",
        value: short_money(Math.round(sum(bills) / 12)),
        sub: `across ${bills.length.toLocaleString()} billers`,
      },
    ];
  }, [bills]);

  return (
    <div className="flex w-full flex-col gap-5 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your recurring bills — {bills.length.toLocaleString()}{" "}
            tracked.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={handleExport}>
            <FiDownload size={15} />
            Export CSV
          </Button>
          <Button type="button" variant="primary" onClick={handleCreate}>
            <BiPlus size={17} />
            New Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-2xl border bg-card px-4.5 py-4"
          >
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              {stat.label}
            </span>
            <span
              className={`text-2xl font-extrabold tracking-tight tabular-nums ${
                stat.accent ?? (stat.muted ? "text-muted-foreground" : "")
              }`}
            >
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.sub}</span>
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
