import { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useModal } from "@c/context/providers/ModalProvider";
import { ModalContextService } from "@c/context/ModalContext";
import useDailyExpensesHook from "@c/hooks/useDailyExpensesHook";
import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  DialogDescription,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import StartTransactionModal from "./components/StartTransactionModal";
import AddExpenseModal from "./components/AddExpenseModal";
import ActiveSessionView from "./components/ActiveSessionView";
import DailyBudgetsList from "./list/dailyBudgetsList";
import type { DailyBudgetI, DailyExpenseI } from "@c/types/dailyExpenseTypes";
import { date_formatter } from "@c/utils/utilities.util";

const StartTransactionHeader = () => (
  <>
    <DialogTitle>Start Transaction</DialogTitle>
    <DialogDescription>
      Set a name and allotted budget for today's spending.
    </DialogDescription>
  </>
);

const AddExpenseHeader = () => (
  <>
    <DialogTitle>Add Expense</DialogTitle>
    <DialogDescription>
      Log an expense against the active transaction.
    </DialogDescription>
  </>
);

const ViewSessionHeader = ({ budget }: { budget: DailyBudgetI }) => (
  <>
    <DialogTitle>{budget.name}</DialogTitle>
    <DialogDescription>
      {budget.status_label} · {date_formatter(new Date(budget.budget_date))}
    </DialogDescription>
  </>
);

export default function DailyExpensesPage() {
  const {
    activeBudget,
    budgetList,
    errorList,
    startBudgetForm,
    expenseForm,
    fetchActiveBudget,
    fetchList,
    getBudgetDetails,
    startBudget,
    addExpense,
    deleteExpense,
    markDone,
    cancelBudget,
  } = useDailyExpensesHook();
  const { configureModal, onOpen } = useModal();
  const {
    onOpen: onConfirmOpen,
    confirmModalConfig,
    handleConfirm,
  } = ModalContextService.confirmModal();

  useEffect(() => {
    fetchActiveBudget();
    fetchList();
  }, []);

  const handleStartTransaction = () => {
    startBudgetForm.reset();
    configureModal?.({
      type: "general",
      showFooter: false,
      size: "md",
      header: <StartTransactionHeader />,
      content: (
        <StartTransactionModal
          formMethod={startBudgetForm}
          errorList={errorList}
          onSubmit={startBudget}
        />
      ),
    });
    onOpen();
  };

  const handleAddExpense = () => {
    expenseForm.reset();
    configureModal?.({
      type: "general",
      showFooter: false,
      size: "md",
      header: <AddExpenseHeader />,
      content: (
        <AddExpenseModal
          formMethod={expenseForm}
          errorList={errorList}
          onSubmit={addExpense}
        />
      ),
    });
    onOpen();
  };

  const handleDeleteExpense = (expense: DailyExpenseI) => {
    confirmModalConfig({
      title: `Delete "${expense.name}"?`,
      description:
        "This expense will be permanently removed from this transaction.",
    });
    handleConfirm(() => {
      deleteExpense(expense.id);
    });
    onConfirmOpen();
  };

  const handleDone = () => {
    confirmModalConfig({
      title: "Mark this transaction as done?",
      description:
        "You won't be able to log more expenses once it's marked as done.",
    });
    handleConfirm(() => {
      markDone();
    });
    onConfirmOpen();
  };

  const handleCancel = () => {
    confirmModalConfig({
      title: "Cancel this transaction?",
      description: "The transaction will be kept in your history as cancelled.",
    });
    handleConfirm(() => {
      cancelBudget();
    });
    onConfirmOpen();
  };

  const handleViewSession = async (id: string | number) => {
    const budget = await getBudgetDetails(id);
    if (!budget) return;
    configureModal?.({
      type: "general",
      showFooter: false,
      size: "lg",
      header: <ViewSessionHeader budget={budget} />,
      content: <ActiveSessionView budget={budget} readOnly />,
    });
    onOpen();
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 sm:gap-5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Daily Expenses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeBudget
              ? "Track today's spending in real time."
              : "Start a transaction to begin tracking today's spending."}
          </p>
        </div>
        {!activeBudget && (
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={handleStartTransaction}
          >
            <BiPlus size={17} />
            Start Transaction
          </Button>
        )}
      </div>

      {activeBudget ? (
        <ActiveSessionView
          budget={activeBudget}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          onDone={handleDone}
          onCancel={handleCancel}
        />
      ) : (
        <DailyBudgetsList budgetList={budgetList} onView={handleViewSession} />
      )}
    </div>
  );
}
