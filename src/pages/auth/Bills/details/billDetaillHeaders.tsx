import { RiResetRightFill } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { LiaWalletSolid } from "react-icons/lia";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useBillDetail } from "@c/context/providers/BillDetailsProvider";
import useReferenceHook from "@c/hooks/useReferenceHook";
import {
  bill_status_pill_class,
  currency_formatter,
} from "@c/utils/utilities.util";
import type { DynamicDetailsI } from "@c/types/billsTypes";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import { Switch } from "@c/lib/shadcn/components/ui/switch";

const DynamicDetails = ({ children, type, value }: DynamicDetailsI) => {
  return (
    <div className="flex items-center gap-3 bg-card px-4 py-3">
      {children}
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {type}
        </div>
        <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
};

interface BillDetailHeadersI {
  onLogPayment: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BillDetailHeaders({
  onLogPayment,
  onEdit,
  onDelete,
}: BillDetailHeadersI) {
  const { details } = useBillDetail();
  const { references } = useReferenceHook();
  const isOngoing = details?.status === "ongoing";
  const isCompleted = details?.status === "completed";
  const categoryLabel =
    references?.category?.find(({ key }) => key == details?.category)?.label ??
    "";

  return (
    <div className="grid grid-cols-1 gap-8 p-6 pb-5 md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {details?.name}
          </h1>
          <Badge className={bill_status_pill_class(details?.status)}>
            <span className="size-1.5 rounded-full bg-current" />
            {details?.status}
          </Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
          <IoPricetagOutline size={14} />
          {[categoryLabel, details?.description].filter(Boolean).join(" · ")}
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-medium tracking-tight">
            {currency_formatter(details?.amount ?? 0)}
          </span>
          <span className="text-sm text-muted-foreground">
            due {details?.frequency}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button variant="primary" onClick={onLogPayment}>
            <LiaWalletSolid size={16} />
            Log Payment
          </Button>
          <Button
            variant="outline"
            disabled={details === null}
            onClick={onEdit}
          >
            <CiEdit size={16} />
            Edit Bill
          </Button>
          {!isCompleted && (
            <Button
              variant="destructive"
              disabled={details === null || isOngoing}
              title={isOngoing ? "Ongoing bills can't be deleted." : undefined}
              onClick={onDelete}
            >
              <CiTrash size={16} />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border self-start">
        <DynamicDetails
          type="Next Due"
          value={
            details?.next_date_at
              ? new Date(details.next_date_at).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
        >
          <IoCalendarNumberOutline
            size={17}
            className="text-muted-foreground"
          />
        </DynamicDetails>
        <DynamicDetails
          type="Auto Pay"
          value={
            <span className="flex items-center gap-2">
              <Switch
                checked={Boolean(details?.is_autopay)}
                onCheckedChange={() => {}}
                disabled
              />
              {details?.is_autopay ? "On" : "Off"}
            </span>
          }
        >
          <RiResetRightFill size={17} className="text-muted-foreground" />
        </DynamicDetails>
        <DynamicDetails
          type="Method"
          value={
            details?.default_payment
              ? String(details.default_payment).toUpperCase()
              : "—"
          }
        >
          <FaRegCreditCard size={17} className="text-muted-foreground" />
        </DynamicDetails>
        <DynamicDetails type="Category" value={categoryLabel || "—"}>
          <IoPricetagOutline size={17} className="text-muted-foreground" />
        </DynamicDetails>
      </div>
    </div>
  );
}
