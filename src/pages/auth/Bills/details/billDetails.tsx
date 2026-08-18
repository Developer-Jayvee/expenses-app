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
import { LiaWalletSolid } from "react-icons/lia";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useBillDetail } from "@c/context/providers/BillDetailsProvider";
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
import BillForm from "../components/BillForm/billForm";
import { extractRawHttpError } from "@c/utils/axios-error.util";

const LogPaymentHeader = () => {
  return (
    <>
      <DialogTitle>Log Payment</DialogTitle>
      <DialogDescription>
        Record a payment to keep your transactions organized.
      </DialogDescription>
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

const EditForm = ({ id, onUpdated }: { id: string; onUpdated: () => void }) => {
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
        <BillForm />
      </form>
    </FormProvider>
  );
};
export default function BillDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { details, getCallback } = useBillDetail();
  const { formMethod, onDelete } = useBillContext();
  const { onOpen, configureModal } = useModal();
  const { showUndoToast, showToast } = useToast();
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
    reset: LogReset,
  } = useForm<LogPaymentType>({
    resolver: zodResolver(logPaymentSchema),
    defaultValues: {
      payment_mode: "cash",
      transaction_date:
        details?.next_date_at ?? new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const confirmDelete = () => {
    configureModal?.({
      size: "md",
      type: "confirm",
      title: "Are you sure you want to delete this bill?",
      description: "This will deleted the bill permanently.",
      submitEvent: () => {
        if (id) {
          onDelete(id ?? null).then((result) => {
            if (result?.status) {
              showToast({
                message: "Bill deleted successfully.",
                variant: "success",
              });
              navigate("/expense/bills", { replace: true });
            } else {
              showToast({
                message: result?.message ?? "Failed to delete bill.",
                variant: "danger",
              });
            }
          });
        }
      },
    });
    onOpen();
  };
  const handleLogPayment = () => {
    configureModal?.({
      header: <LogPaymentHeader />,
      size: "lg",
      content: (
        <PaymentLog
          details={details}
          control={LogControl}
          register={LogRegister}
          setValue={LogSetValue}
        />
      ),
      submitEvent: async () => {
        const data: ExtendedLogPayment = {
          billsId: String(id),
          amount: LogGetValues("amount"),
          payment_mode: LogGetValues("payment_mode"),
          transaction_date: LogGetValues("transaction_date"),
          notes: LogGetValues("notes"),
        };
        await createTransaction_API(data)
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
                  onClick: () => navigate(`/expense/bills/${id}/transactions`),
                },
              });
            } else {
              showToast({
                message: result?.message ?? "Failed to log payment.",
                variant: "danger",
              });
            }
          })
          .catch((err) => {
            const errors = extractRawHttpError(err);
            showToast({
              message: errors?.message ?? "Failed to log payment.",
              variant: "danger",
            });
          });
      },
    });
    onOpen();
  };
  const handleUpdate = () => {
    if (!id) return;
    configureModal?.({
      type: "general",
      content: <EditForm id={id} onUpdated={() => getCallback(id)} />,
      size: "xl",
      showFooter: false,
      header: <EditFormHeader />,
    });
    onOpen();
  };
  useEffect(() => {
    if (id !== null && id !== undefined) {
      getCallback(id);
      getTransactions(id, { page: 1, per_page: TRANSACTION_PAGE_SIZE });
    }
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
        transaction_date: details?.next_date_at ?? "",
      }));
    }
  }, [details, formMethod?.reset]);

  if (details === null) return null;

  return (
    <div className="p-5">
      <div className="flex">
        {/* Button header */}
        <div className="">
          <button
            className="font-normal! flex gap-2 items-center cursor-pointer"
            onClick={() => navigate("/expense/bills", { replace: true })}
          >
            <MdOutlineArrowBack size={20} />
            Back to bills
          </button>
        </div>
      </div>
      {/* Main header */}
      <BillDetailHeaders />
      {/* ACTIONS */}
      <div className="mt-5">
        <div className="btn-group">
          <button
            className="primary btn-flex"
            onClick={() => handleLogPayment()}
          >
            <LiaWalletSolid size={20} />
            Log Payment
          </button>
          <button
            className="ghost-primary btn-flex"
            disabled={details === null}
            onClick={() => handleUpdate()}
          >
            <CiEdit size={20} />
            Edit Bill
          </button>
          <button
            onClick={() => confirmDelete()}
            className="ghost-danger btn-flex"
          >
            <CiTrash size={20} />
            Delete
          </button>
        </div>
      </div>
      {/* KPI */}
      <BillDetailSummary summary={summary} />
      {/* TABS */}
      <div className="mt-5">
        <ul className="flex gap-4 border-0 border-b pb-4">
          <li>
            <NavLink
              to="transactions"
              className={({ isActive }) =>
                `text-lg py-3 pb-4 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Transactions
            </NavLink>
          </li>
        </ul>
      </div>
      {/* ACTIVITIES */}
      <div className="mt-4">
        <Outlet
          context={{
            list: resource,
            onDelete: (transaction: TransactionResourceI) =>
              deleteTransaction(transaction, showUndoToast),
            pendingDeleteIds,
            meta,
            onPageChange: goToPage,
          }}
        />
      </div>
    </div>
  );
}
