import { MdOutlineArrowBack } from "react-icons/md";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import BillDetailHeaders from "./billDetaillHeaders";
import BillDetailSummary from "./billDetailSummary";
import { useBillDetail } from "@c/context/providers/BillDetailsProvider";
import { Card } from "@c/lib/shadcn/components/ui/card";
import { useEffect } from "react";
import { useModal } from "@c/context/providers/ModalProvider";
import { useToast } from "@c/context/providers/ToastProvider";
import PaymentLog from "../components/PaymentLog/paymentLog";
import {
  DialogDescription,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import {
  logPaymentSchema,
  TRANSACTION_PAGE_SIZE,
  type ExtendedLogPayment,
  type LogPaymentType,
  type TransactionResourceI,
} from "@c/types/transactionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction_API } from "@c/hooks/api/transaction-api";
import useTransactionHook from "@c/hooks/useTransactionHook";
import { useBillContext } from "@c/context/providers/BillsProvider";
import BillFormWizard from "../components/BillForm/billFormWizard";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import { SuccessAlert } from "@c/components/alerts/SuccessAlert";
import { ModalContextService } from "@c/context/ModalContext";
import {
  currency_formatter,
  date_formatter,
  get_periods_for_date,
  get_transaction_date_bounds,
  period_unit_label,
  today_date,
} from "@c/utils/utilities.util";

const LogPaymentHeader = ({ isFullyPaid }: { isFullyPaid: boolean }) => {
  return (
    <>
      <DialogTitle>Log Payment</DialogTitle>
      <DialogDescription>
        Record a payment to keep your transactions organized.
      </DialogDescription>
      {isFullyPaid && (
        <SuccessAlert
          title="This bill is fully paid"
          description="You've successfully logged every payment for this bill — there's nothing left to pay, so logging another one is disabled."
        />
      )}
    </>
  );
};

const EditFormHeader = () => {
  return (
    <>
      <DialogTitle>Edit Bill</DialogTitle>
      <DialogDescription>Update this bill's details.</DialogDescription>
    </>
  );
};

const EditForm = ({
  id,
  locked,
  onUpdated,
}: {
  id: string;
  locked: boolean;
  onUpdated: () => void;
}) => {
  const { formMethod, onUpdate, handleSubmit } = useBillContext();
  const { onClose } = useModal();
  const { showToast } = useToast();
  if (!formMethod) return null;
  return (
    <FormProvider {...formMethod}>
      <form
        onSubmit={handleSubmit?.(async (data) => {
          const success = await onUpdate(id, data);
          if (success) {
            showToast({
              message: "Bill updated successfully.",
              variant: "success",
            });
            onUpdated();
            onClose();
          } else {
            showToast({
              message: "Failed to update bill. Please check the form.",
              variant: "danger",
            });
          }
        })}
      >
        <BillFormWizard mode="edit" locked={locked} />
      </form>
    </FormProvider>
  );
};
export default function BillDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { details, getCallback } = useBillDetail();
  const { formMethod, onDelete, setFormMode } = useBillContext();
  const { onOpen, onClose, configureModal } = useModal();
  const {
    onOpen: onConfirmOpen,
    confirmModalConfig,
    handleConfirm,
  } = ModalContextService.confirmModal();
  const { showUndoToast, showToast } = useToast();
  const isOngoing = details?.status === "ongoing";
  const {
    resource,
    meta,
    summary,
    pendingDeleteIds,
    getTransactions,
    deleteTransaction,
  } = useTransactionHook();
  const goToPage = (nextPage: number) => {
    if (!id) return;
    getTransactions(id, { page: nextPage, per_page: TRANSACTION_PAGE_SIZE });
  };

  const {
    control: LogControl,
    register: LogRegister,
    setValue: LogSetValue,
    getValues: LogGetValues,
    trigger: LogTrigger,
    reset: LogReset,
    setError: LogSetError,
    clearErrors: LogClearErrors,
  } = useForm<LogPaymentType>({
    resolver: zodResolver(logPaymentSchema),
    defaultValues: {
      payment_mode: "cash",
      transaction_date: today_date(),
      notes: "",
    },
  });

  const confirmDelete = () => {
    if (!id || isOngoing) return;
    confirmModalConfig({
      title: "Are you sure you want to delete this bill?",
      description: "This will delete the bill permanently.",
    });
    handleConfirm(() => {
      onDelete(id).then((result) => {
        if (result?.status) {
          showToast({
            message: "Bill deleted successfully.",
            variant: "success",
          });
          navigate("/expense/bills", { replace: true });
        } else {
          showToast({
            message: "Please try again later.",
            variant: "danger",
          });
        }
      });
    });
    onConfirmOpen();
  };
  const handleLogPayment = () => {
    const isFullyPaid = details?.status === "completed";
    const paymentsCount = summary?.payments_count ?? 0;
    const dateBounds = details
      ? get_transaction_date_bounds(
          details.billing_date,
          paymentsCount,
          details.frequency,
          details.end_date,
        )
      : null;
    LogClearErrors();
    configureModal?.({
      header: <LogPaymentHeader isFullyPaid={isFullyPaid} />,
      size: "lg",
      disableSubmit: isFullyPaid,
      content: (
        <PaymentLog
          details={details}
          control={LogControl}
          register={LogRegister}
          setValue={LogSetValue}
          dateBounds={dateBounds}
        />
      ),
      submitEvent: async () => {
        const isValid = await LogTrigger();
        if (!isValid) return false;
        LogClearErrors();

        const transactionDate = LogGetValues("transaction_date");
        if (dateBounds && transactionDate < dateBounds.min) {
          LogSetError("transaction_date", {
            type: "validate",
            message:
              paymentsCount > 0
                ? "You have already logged a payment for the current billing period."
                : "Invalid transaction date",
          });
          return false;
        }
        if (dateBounds && transactionDate > dateBounds.max) {
          LogSetError("transaction_date", {
            type: "validate",
            message:
              details && dateBounds.max === details.end_date
                ? "Transaction date can't be later than the bill's end date."
                : "Transaction date is too far in the future for this bill.",
          });
          return false;
        }

        const periods = details
          ? get_periods_for_date(
              details.billing_date,
              paymentsCount,
              details.frequency,
              transactionDate,
            )
          : 1;

        const data: ExtendedLogPayment = {
          billsId: String(id),
          amount: LogGetValues("amount"),
          payment_mode: LogGetValues("payment_mode"),
          transaction_date: LogGetValues("transaction_date"),
          notes: LogGetValues("notes"),
          periods,
        };

        const isMultiPeriod = periods > 1;
        const unitLabel = period_unit_label(details?.frequency ?? "", periods);
        confirmModalConfig(
          isMultiPeriod
            ? {
                title: `Log ${periods} ${unitLabel}?`,
                description: `This date is ${periods} ${unitLabel} out — this will record ${periods} separate ${currency_formatter(data.amount)} payments for this bill, one per ${period_unit_label(details?.frequency ?? "", 1)}, through ${date_formatter(new Date(transactionDate))}.`,
              }
            : {
                title: "Log this payment?",
                description: `This will record a ${currency_formatter(data.amount)} payment for this bill.`,
              },
        );
        handleConfirm(() => {
          createTransaction_API(data)
            .then((result) => {
              if (result?.status) {
                if (id) {
                  getCallback(id);
                  getTransactions(id, {
                    page: 1,
                    per_page: TRANSACTION_PAGE_SIZE,
                  });
                }
                showToast({
                  message: "Payment logged successfully.",
                  variant: "success",
                  action: {
                    label: "View Transactions",
                    onClick: () =>
                      navigate(`/expense/bills/${id}/transactions`),
                  },
                });
                onClose();
              } else {
                const message = result?.message ?? "Failed to log payment.";
                LogSetError("root.serverError", { type: "server", message });
                showToast({ message, variant: "danger" });
              }
            })
            .catch((err) => {
              const httpError = extractRawHttpError(err);
              const message = httpError?.message ?? "Failed to log payment.";
              Object.entries(httpError?.data ?? {}).forEach(
                ([field, messages]) => {
                  LogSetError(field as keyof LogPaymentType, {
                    type: "server",
                    message: messages?.[0] ?? message,
                  });
                },
              );
              LogSetError("root.serverError", { type: "server", message });
              showToast({ message, variant: "danger" });
            });
        });
        onConfirmOpen();
        return false;
      },
    });
    onOpen();
  };
  const hasLoggedPayments = (summary?.payments_count ?? 0) > 0;
  const handleUpdate = () => {
    if (!id || !details) return;
    setFormMode?.("edit");
    formMethod?.reset({
      ...details,
      amount: String(details.amount),
      is_autopay: Boolean(details.is_autopay),
    });
    configureModal?.({
      type: "general",
      content: (
        <EditForm
          id={id}
          locked={hasLoggedPayments}
          onUpdated={() => getCallback(id)}
        />
      ),
      size: "3xl",
      showFooter: false,
      header: <EditFormHeader />,
    });
    onOpen();
  };
  useEffect(() => {
    const isInvalidId = !id || Number.isNaN(Number(id));
    if (isInvalidId) {
      navigate("/expense/bills", { replace: true });
      return;
    }
    getCallback(id).then((bill) => {
      if (!bill) {
        navigate("/expense/bills", { replace: true });
      }
    });
    getTransactions(id, { page: 1, per_page: TRANSACTION_PAGE_SIZE });
  }, [location.pathname]);

  useEffect(() => {
    if (details) {
      formMethod?.reset({
        ...details,
        amount: String(details.amount),
        is_autopay: Boolean(details.is_autopay),
      });
      LogReset((rest) => ({
        ...rest,
        payment_mode: details?.default_payment ?? "cash",
        transaction_date: today_date(),
      }));
    }
  }, [details, formMethod?.reset]);

  if (details === null) return null;

  return (
    <div className="p-5">
      <button
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/expense/bills", { replace: true })}
      >
        <MdOutlineArrowBack size={16} />
        Back to bills
      </button>

      <Card className="gap-0 overflow-hidden rounded-2xl py-0">
        <BillDetailHeaders
          onLogPayment={handleLogPayment}
          onEdit={handleUpdate}
          onDelete={confirmDelete}
        />
        <BillDetailSummary summary={summary} />
      </Card>

      <div className="mt-7 flex items-center gap-6 border-b">
        <NavLink
          to="transactions"
          className={({ isActive }) =>
            `-mb-px flex items-center gap-2 border-b-2 pb-2.5 text-sm font-semibold ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`
          }
        >
          Transactions
          <span className="font-mono text-xs font-normal text-muted-foreground">
            {summary?.payments_count ?? 0}
          </span>
        </NavLink>
        <NavLink
          to="activities"
          className={({ isActive }) =>
            `-mb-px flex items-center gap-2 border-b-2 pb-2.5 text-sm font-semibold ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`
          }
        >
          Activity
        </NavLink>
      </div>

      <Card className="gap-0 overflow-hidden rounded-t-none rounded-b-2xl py-0">
        <Outlet
          context={{
            list: resource,
            onDelete: (transaction: TransactionResourceI) =>
              deleteTransaction(transaction, showUndoToast),
            pendingDeleteIds,
            meta,
            summary,
            onPageChange: goToPage,
          }}
        />
      </Card>
    </div>
  );
}
