import z from "zod";
import type { DefaultResponseI } from "@c/types/globalTypes";

export interface ChecklistItemI {
  id: string | number;
  checklist_group_id?: string | number;
  item_name: string;
  estimated_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface ChecklistGroupI {
  id: string | number;
  title: string;
  description: string | null;
  items_count: number;
  items?: ChecklistItemI[];
  created_at: string;
}

export const checklistItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required."),
  estimated_price: z
    .string()
    .min(1, "Estimated price is required.")
    .refine(
      (value) => Number(value) >= 0,
      "Estimated price must be 0 or greater.",
    ),
  quantity: z
    .string()
    .min(1, "Quantity is required.")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
      "Quantity must be at least 1.",
    ),
});
export type ChecklistItemFormT = z.infer<typeof checklistItemSchema>;

export const checklistGroupSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  items: z.array(checklistItemSchema).min(1, "Add at least one item."),
});
export type ChecklistGroupFormT = z.infer<typeof checklistGroupSchema>;

export const getDefaultChecklistGroupFormValues = (): ChecklistGroupFormT => ({
  title: "",
  description: "",
  items: [],
});

export const getDefaultChecklistItemFormValues = (): ChecklistItemFormT => ({
  item_name: "",
  estimated_price: "",
  quantity: "1",
});

export const mapChecklistGroupToFormValues = (
  group: ChecklistGroupI,
): ChecklistGroupFormT => ({
  title: group.title ?? "",
  description: group.description ?? "",
  items: (group.items ?? []).map((item) => ({
    item_name: item.item_name ?? "",
    estimated_price: String(item.estimated_price ?? 0),
    quantity: String(item.quantity ?? 1),
  })),
});

export type ChecklistGroupResponseI = DefaultResponseI<ChecklistGroupI>;
export type ChecklistGroupListResponseI = DefaultResponseI<ChecklistGroupI[]>;
