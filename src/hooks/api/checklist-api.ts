import http from "@c/configs/axiosHttp";
import type {
  ChecklistGroupFormT,
  ChecklistGroupI,
  ChecklistGroupListResponseI,
  ChecklistGroupResponseI,
} from "@c/types/checklistTypes";
import type { DefaultResponseI } from "@c/types/globalTypes";

const BASE_URL = "/checklist-groups";

export const listChecklistGroups_API = async (): Promise<ChecklistGroupI[]> => {
  const response = await http.get(BASE_URL);
  return (response as unknown as ChecklistGroupListResponseI)?.data ?? [];
};

export const getChecklistGroup_API = async (
  id: string | number,
): Promise<ChecklistGroupI | null> => {
  const response = await http.get(`${BASE_URL}/${id}`);
  return (response as unknown as ChecklistGroupResponseI)?.data ?? null;
};

export const createChecklistGroup_API = async (
  data: ChecklistGroupFormT,
): Promise<ChecklistGroupResponseI> => {
  const response = await http.post<ChecklistGroupResponseI>(BASE_URL, {
    title: data.title,
    description: data.description,
    items: data.items.map((item) => ({
      item_name: item.item_name,
      estimated_price: Number(item.estimated_price),
      quantity: Number(item.quantity),
    })),
  });
  return response as unknown as ChecklistGroupResponseI;
};

export const updateChecklistGroup_API = async (
  id: string | number,
  data: ChecklistGroupFormT,
): Promise<ChecklistGroupResponseI> => {
  const response = await http.put<ChecklistGroupResponseI>(
    `${BASE_URL}/${id}`,
    {
      title: data.title,
      description: data.description,
      items: data.items.map((item) => ({
        item_name: item.item_name,
        estimated_price: Number(item.estimated_price),
        quantity: Number(item.quantity),
      })),
    },
  );
  return response as unknown as ChecklistGroupResponseI;
};

export const deleteChecklistGroup_API = async (
  id: string | number,
): Promise<DefaultResponseI> => {
  const response = await http.delete<DefaultResponseI>(`${BASE_URL}/${id}`);
  return response as unknown as DefaultResponseI;
};
