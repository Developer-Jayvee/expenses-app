import { MdOutlineArrowBack } from "react-icons/md";
import {
  Navigate,
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
import { useBillDetail } from "@c/context/BillDetailsProvider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DefaultModal } from "@c/components/modals/DefaultModal";
import useBillsHook from "@c/hooks/useBillsHook";
import BillForm from "../components/BillForm/billForm";
import { updateBill_API } from "@c/hooks/api/bills-api";
import { useModal } from "@c/context/ModalProvider";
import PaymentLog from "../components/PaymentLog/paymentLog";
import {
  DialogDescription,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  logPaymentSchema,
  type ExtendedLogPayment,
  type LogPaymentType,
} from "@c/types/transactionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction_API } from "@c/hooks/api/transaction-api";
import useTransactionHook from "@c/hooks/useTransactionHook";
import { url_search } from "@c/utils/utilities.util";

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
export default function BillDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { details, getCallback } = useBillDetail();
  const { register, reset, control, getValues, onDelete } = useBillsHook();
  const { onOpen, onClose, configureModal } = useModal();
  const { resource, getTransactions } = useTransactionHook();

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const formRef = useRef(null);

  const confirmDelete = () => {
    configureModal?.({
      size: "md",
      type: "confirm",
      title: "Are you sure you want to delete this bill?",
      description: "This will deleted the bill permanently.",
      submitEvent: () => {
        onDelete(id ?? null).then((result) => {
          if (result?.status) {
            navigate("/expense/bills", { replace: true });
          }
        });
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
        await createTransaction_API(data).then((result) => {
          if (result) {
            if (id) {
              getCallback(id);
              getTransactions(id);
            }
            onClose();
          }
        });
      },
    });
    onOpen();
  };
  useEffect(() => {
    if (id !== null && id !== undefined) {
      getCallback(id);
      if (url_search(location.pathname, "transactions")) {
        getTransactions(id);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (details) {
      reset(details);
      LogReset((rest) => ({
        ...rest,
        payment_mode: details?.default_payment ?? "cash",
        transaction_date: details?.next_date_at ?? "",
      }));
    }
  }, [details, reset]);

  if (details === null) return null;

  const onUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return false;
    const response = await updateBill_API(id, getValues());
    if (response) {
      getCallback(id);
      alert("Successfully updated");
      setIsModalOpen(false);
    }
  };

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
            onClick={() => setIsModalOpen(true)}
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
      <BillDetailSummary />
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
          }}
        />
      </div>

      <DefaultModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
        showCloseButton={false}
        formProps={{
          onSubmit: onUpdate,
        }}
        formRef={formRef}
      >
        <></>
        <BillForm {...{ register, control }} />
      </DefaultModal>
    </div>
  );
}
