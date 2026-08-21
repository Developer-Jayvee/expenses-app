import { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useModal } from "@c/context/providers/ModalProvider";
import { ModalContextService } from "@c/context/ModalContext";
import { useChecklistContext } from "@c/context/providers/ChecklistProvider";
import ChecklistExpenseNav from "@c/components/ChecklistExpenseNav";
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
import type {
  DailyBudgetI,
  DailyExpenseI,
  ExpenseFormT,
} from "@c/types/dailyExpenseTypes";
import { getDefaultExpenseFormValues } from "@c/types/dailyExpenseTypes";
import {
  daily_budget_is_same_day_session,
  date_formatter,
} from "@c/utils/utilities.util";

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
    continueBudget,
    deleteBudget,
  } = useDailyExpensesHook();
  const {
    groupList: checklistGroups,
    fetchList: fetchChecklistGroups,
    getGroupDetails,
  } = useChecklistContext();
  const { configureModal, onOpen } = useModal();
  const {
    onOpen: onConfirmOpen,
    confirmModalConfig,
    handleConfirm,
  } = ModalContextService.confirmModal();

  useEffect(() => {
    fetchActiveBudget();
    fetchList();
    fetchChecklistGroups();
  }, []);

  const handleUseChecklistItem = (name: string, amount: number) => {
    handleAddExpense({ name, amount: String(amount) });
  };

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

  const handleAddExpense = (prefill?: Partial<ExpenseFormT>) => {
    expenseForm.reset({ ...getDefaultExpenseFormValues(), ...prefill });
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

  const handleContinueTransaction = (budget: DailyBudgetI) => {
    confirmModalConfig({
      title: "Continue this transaction?",
      description:
        "It will reset and clear all logged expenses and move the transaction date to today. Are you sure you want to continue?",
    });
    handleConfirm(() => {
      continueBudget(budget.id);
    });
    onConfirmOpen();
  };

  const handleCloseTransaction = (budget: DailyBudgetI) => {
    confirmModalConfig({
      title: "Close this transaction?",
      description:
        "This in-progress transaction will be closed and kept in your history.",
    });
    handleConfirm(() => {
      markDone(budget.id);
    });
    onConfirmOpen();
  };

  const handleDeleteTransaction = (budget: DailyBudgetI) => {
    confirmModalConfig({
      title: `Delete "${budget.name}"?`,
      description:
        "This transaction and all of its logged expenses will be permanently deleted.",
    });
    handleConfirm(() => {
      deleteBudget(budget.id);
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
            {daily_budget_is_same_day_session(activeBudget)
              ? "Track today's spending in real time."
              : activeBudget
                ? "You have an in-progress transaction from a previous day. Resolve it below to start a new one."
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

      <ChecklistExpenseNav />

      {daily_budget_is_same_day_session(activeBudget) ? (
        <ActiveSessionView
          budget={activeBudget}
          onAddExpense={() => handleAddExpense()}
          onDeleteExpense={handleDeleteExpense}
          onDone={handleDone}
          onCancel={handleCancel}
          checklistGroups={checklistGroups}
          onSelectGroup={getGroupDetails}
          onUseChecklistItem={handleUseChecklistItem}
        />
      ) : (
        <DailyBudgetsList
          budgetList={budgetList}
          onView={handleViewSession}
          onContinue={handleContinueTransaction}
          onCloseTransaction={handleCloseTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
    </div>
  );
}
