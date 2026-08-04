// import OffCanvasPanel from "@/components/modals/OffCanvas";
import type { Dispatch, SetStateAction } from "react";

interface CreateExpensesModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function CreateExpensesModal({
  isOpen,
  setIsOpen,
}: CreateExpensesModalProps) {
  return (
    <></>
    //  <OffCanvasPanel
    //     isOpen={isOpen}
    //     onClose={() => setIsOpen(false)}
    //     title="Add Expense"
    // >
    //     <div className="space-y-4">
    //         <input
    //             type="text"
    //             placeholder="Expense title"
    //             className="w-full rounded border p-2"
    //         />

    //         <input
    //             type="number"
    //             placeholder="Amount"
    //             className="w-full rounded border p-2"
    //         />
    //         <input
    //             type="date"
    //             className="w-full rounded border p-2"
    //         />
    //         <button className="w-full rounded bg-blue-600 py-2 text-white">
    //             Save
    //         </button>
    //     </div>
    // </OffCanvasPanel>
  );
}
