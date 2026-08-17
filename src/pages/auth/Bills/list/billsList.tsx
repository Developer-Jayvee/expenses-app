import { BiPlus } from "react-icons/bi";
import BillTable from "../components/bill-table";
import BillForm from "../components/BillForm/billForm";
import { useModal } from "@c/context/ModalProvider";
import {
  DialogDescription,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { useBillContext } from "@c/context/BillsProvider";

const CreateForm = () => {
  const { formMethod, onSubmit, handleSubmit } = useBillContext();
  if (!formMethod) return null;
  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleSubmit?.(onSubmit)}>
        <BillForm />
      </form>
    </FormProvider>
  );
};
const CreateFormHeader = () => {
  return (
    <>
      <DialogTitle>Create new Bill</DialogTitle>
      <DialogDescription>Create new bill data here.</DialogDescription>
    </>
  );
};
export default function BillsList() {
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
  return (
    <div className="w-full h-full p-1 flex flex-col">
      <div className="flex justify-end">
        <div>
          <button
            type="button"
            className="primary px-5!  flex gap-2 items-center justify-center"
            onClick={handleCreate}
          >
            <BiPlus />
            New Bill
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="mt-4 h-150 ">
        <BillTable />
      </div>
    </div>
  );
}
