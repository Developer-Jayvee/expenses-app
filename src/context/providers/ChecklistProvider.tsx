import useChecklistHook from "@c/hooks/useChecklistHook";
import type {
  ChecklistGroupFormT,
  ChecklistGroupI,
} from "@c/types/checklistTypes";
import type { ErrorResponseI } from "@c/types/globalTypes";
import { createContext, useMemo } from "react";
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { useContextProvider } from "./BaseContextProvider";

interface ChecklistContextI {
  groupList: Array<ChecklistGroupI> | [];
  errorList: ErrorResponseI;
  groupForm: UseFormReturn<ChecklistGroupFormT> | null;
  fields: Array<FieldArrayWithId<ChecklistGroupFormT, "items", "id">>;
  append: UseFieldArrayAppend<ChecklistGroupFormT, "items">;
  remove: UseFieldArrayRemove;
  fetchList: () => Promise<void>;
  getGroupDetails: (id: string | number) => Promise<ChecklistGroupI | null>;
  createGroup: (data: ChecklistGroupFormT) => Promise<boolean>;
  updateGroup: (
    id: string | number,
    data: ChecklistGroupFormT,
  ) => Promise<boolean>;
  deleteGroup: (id: string | number) => Promise<boolean>;
}
interface ChecklistProviderI {
  children: React.ReactNode;
}

export const ChecklistContext = createContext<ChecklistContextI | null>({
  groupList: [],
  errorList: null,
  groupForm: null,
  fields: [],
  append: () => {},
  remove: () => {},
  fetchList: async () => {},
  getGroupDetails: async () => null,
  createGroup: async () => false,
  updateGroup: async () => false,
  deleteGroup: async () => false,
});

export const useChecklistContext = () =>
  useContextProvider<ChecklistContextI>(ChecklistContext);

export default function ChecklistProvider({ children }: ChecklistProviderI) {
  const {
    groupList,
    errorList,
    groupForm,
    fields,
    append,
    remove,
    fetchList,
    getGroupDetails,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useChecklistHook();

  const providerValues = useMemo<ChecklistContextI>(
    () => ({
      groupList,
      errorList,
      groupForm,
      fields,
      append,
      remove,
      fetchList,
      getGroupDetails,
      createGroup,
      updateGroup,
      deleteGroup,
    }),
    [groupList, errorList, fields],
  );

  return (
    <ChecklistContext.Provider value={providerValues}>
      {children}
    </ChecklistContext.Provider>
  );
}
