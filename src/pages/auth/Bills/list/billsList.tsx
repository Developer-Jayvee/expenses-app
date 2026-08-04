import { useContext, type Dispatch, type SetStateAction } from "react";
import { BiPlus } from "react-icons/bi";
import { DefaultModal } from "@c/components/modals/DefaultModal";
import BillTable from "../components/bill-table";
import BillForm from "../components/billForm";
import { BillsContext } from "@c/context/BillsProvider";

const Filters = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <button
        type="button"
        className="primary px-5!  flex gap-2 items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <BiPlus />
        New Bill
      </button>
    </div>
  );
};

export default function BillsList() {
  const { onSubmit , isModalOpen , setIsModalOpen} = useContext(BillsContext)
  return (
    <div className="w-full h-full p-1 flex flex-col">
      {/* Filters */}
      <div className="flex justify-end">
        <Filters setIsOpen={setIsModalOpen} />
      </div>
      {/* Table */}
      <div className="mt-4 h-150 overflow-y-auto">
        <BillTable />
      </div>

      {/* Global Modal  */}
      <DefaultModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
        showCloseButton={false}
        formProps={{
            onSubmit : onSubmit
        }}
      >
        <BillForm />
      </DefaultModal>
    </div>
  );
}
