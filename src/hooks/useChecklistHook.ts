import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChecklistGroup_API,
  deleteChecklistGroup_API,
  getChecklistGroup_API,
  listChecklistGroups_API,
  updateChecklistGroup_API,
} from "./api/checklist-api";
import {
  checklistGroupSchema,
  getDefaultChecklistGroupFormValues,
  type ChecklistGroupFormT,
  type ChecklistGroupI,
} from "@c/types/checklistTypes";
import type { ErrorResponseI } from "@c/types/globalTypes";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import { useToast } from "@c/context/providers/ToastProvider";

export default function useChecklistHook() {
  const { showToast } = useToast();
  const [groupList, setGroupList] = useState<Array<ChecklistGroupI> | []>([]);
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);

  const groupForm = useForm<ChecklistGroupFormT>({
    resolver: zodResolver(checklistGroupSchema),
    defaultValues: getDefaultChecklistGroupFormValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: groupForm.control,
    name: "items",
  });

  const fetchList = async () => setGroupList(await listChecklistGroups_API());

  const getGroupDetails = async (
    id: string | number,
  ): Promise<ChecklistGroupI | null> => {
    try {
      return await getChecklistGroup_API(id);
    } catch {
      return null;
    }
  };

  const createGroup = async (data: ChecklistGroupFormT): Promise<boolean> => {
    let success = false;
    await createChecklistGroup_API(data)
      .then(async (response) => {
        if (response?.status) {
          groupForm.reset(getDefaultChecklistGroupFormValues());
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to create checklist.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const updateGroup = async (
    id: string | number,
    data: ChecklistGroupFormT,
  ): Promise<boolean> => {
    let success = false;
    await updateChecklistGroup_API(id, data)
      .then(async (response) => {
        if (response?.status) {
          groupForm.reset(getDefaultChecklistGroupFormValues());
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to update checklist.",
            variant: "danger",
          });
        }
      })
      .catch((err) => {
        setErrorList(extractRawHttpError(err));
      });
    return success;
  };

  const deleteGroup = async (id: string | number): Promise<boolean> => {
    let success = false;
    await deleteChecklistGroup_API(id)
      .then(async (response) => {
        if (response?.status) {
          await fetchList();
          success = true;
        } else {
          showToast({
            message: response?.message ?? "Failed to delete checklist.",
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
  };
}
