import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cancelBudget_API,
  continueBudget_API,
  createDailyBudget_API,
  createExpense_API,
  deleteBudget_API,
  deleteExpense_API,
  getActiveBudget_API,
  getDailyBudget_API,
  listDailyBudgets_API,
  markBudgetDone_API,
} from "./api/daily-expenses-api";
import {
  expenseSchema,
  getDefaultExpenseFormValues,
  getDefaultStartBudgetFormValues,
  startBudgetSchema,
  type DailyBudgetI,
  type ExpenseFormT,
  type StartBudgetFormT,
} from "@c/types/dailyExpenseTypes";
import type { ErrorResponseI } from "@c/types/globalTypes";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import { useToast } from "@c/context/providers/ToastProvider";

export default function useDailyExpensesHook() {
  const { showToast } = useToast();
  const [activeBudget, setActiveBudget] = useState<DailyBudgetI | null>(null);
  const [budgetList, setBudgetList] = useState<Array<DailyBudgetI> | []>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);

  const startBudgetForm = useForm<StartBudgetFormT>({
    resolver: zodResolver(startBudgetSchema),
    defaultValues: getDefaultStartBudgetFormValues(),
  });

  const expenseForm = useForm<ExpenseFormT>({
    resolver: zodResolver(expenseSchema),
    defaultValues: getDefaultExpenseFormValues(),
  });

  const fetchActiveBudget = async (): Promise<DailyBudgetI | null> => {
    const budget = await getActiveBudget_API();
    setActiveBudget(budget);
    return budget;
  };

  const fetchList = async () => setBudgetList(await listDailyBudgets_API());

  const getBudgetDetails = async (
    id: string | number,
  ): Promise<DailyBudgetI | null> => {
    try {
      return await getDailyBudget_API(id);
    } catch {
      return null;
    }
  };

  const startBudget = async (data: StartBudgetFormT): Promise<boolean> => {
    let success = false;
    await createDailyBudget_API(data)
      .then(async (response) => {
        if (response?.status) {
          setActiveBudget(response.data);
          startBudgetForm.reset(getDefaultStartBudgetFormValues());
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to start transaction.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const addExpense = async (data: ExpenseFormT): Promise<boolean> => {
    if (!activeBudget) return false;
    let success = false;
    await createExpense_API(activeBudget.id, data)
      .then((response) => {
        if (response?.status) {
          setActiveBudget(response.data);
          expenseForm.reset(getDefaultExpenseFormValues());
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to add expense.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const deleteExpense = async (id: string | number): Promise<boolean> => {
    let success = false;
    await deleteExpense_API(id)
      .then((response) => {
        if (response?.status) {
          setActiveBudget(response.data);
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to delete expense.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const markDone = async (id?: string | number): Promise<boolean> => {
    const budgetId = id ?? activeBudget?.id;
    if (!budgetId) return false;
    let success = false;
    await markBudgetDone_API(budgetId)
      .then(async (response) => {
        if (response?.status) {
          setActiveBudget(null);
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to complete transaction.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const cancelBudget = async (): Promise<boolean> => {
    if (!activeBudget) return false;
    let success = false;
    await cancelBudget_API(activeBudget.id)
      .then(async (response) => {
        if (response?.status) {
          setActiveBudget(null);
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to cancel transaction.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const continueBudget = async (id: string | number): Promise<boolean> => {
    let success = false;
    await continueBudget_API(id)
      .then(async (response) => {
        if (response?.status) {
          setActiveBudget(response.data);
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to continue transaction.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const deleteBudget = async (id: string | number): Promise<boolean> => {
    let success = false;
    await deleteBudget_API(id)
      .then(async (response) => {
        if (response?.status) {
          setActiveBudget(null);
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to delete transaction.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  return {
    activeBudget,
    budgetList,
    isStartModalOpen,
    setIsStartModalOpen,
    isExpenseModalOpen,
    setIsExpenseModalOpen,
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
  };
}
