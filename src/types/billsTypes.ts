import z from "zod";

export type BillStatusT = "active" | "inactive" | "completed";

export type BillCategoryType =
  | "housing"
  | "food_dining"
  | "transportation"
  | "utilities"
  | "shopping"
  | "healthcare"
  | "education"
  | "entertainment"
  | "financial"
  | "family"
  | "travel"
  | "pets"
  | "gifts_donations"
  | "work_business"
  | "other";
export const BillCategorySchema = z.enum([
  "housing",
  "food_dining",
  "transportation",
  "utilities",
  "shopping",
  "healthcare",
  "education",
  "entertainment",
  "financial",
  "family",
  "travel",
  "pets",
  "gifts_donations",
  "work_business",
  "other",
  "",
]);
export type FrequencyTypes = "monthly" | "yearly" | "daily" | "once";
export const FrequencySchema = z.enum(["monthly", "yearly", "daily", "once"]);
export interface BillFormI {
  name: string;
  amount: number;
  billing_date: string;
  end_date: string;
  status: BillStatusT;
  category: BillCategoryType;
  is_autopay: boolean;
  description: string;
  frequency: FrequencyTypes;
  default_payment: "cash" | "gcash";
  next_date_at?: string;
}
export interface BillDataI {
  name: string;
  amount: number;
  billing_date: string;
  end_date: string;
  status: BillStatusT;
}

export interface PostBillDataI extends BillFormI {
  id: string;
}

export interface PostBillResponseI {
  data: PostBillDataI[];
  message: string;
}
export interface GetBillResponseI {
  data: PostBillDataI;
  message: string;
}

export interface BillCardI extends BillDataI {}

export const billSchema = z.object({
  name: z.string(),
  amount: z.number(),
  billing_date: z.string(),
  end_date: z.string(),
  status: z.enum(["active", "inactive", "completed"]),
  category: BillCategorySchema,
  is_autopay: z.boolean(),
  description: z.string().optional(),
  frequency: FrequencySchema,
  default_payment: z.enum(["gcash", "cash"]),
});

export type PillColor = "primary" | "danger" | "warning";

export interface DynamicDetailsI {
  children: React.ReactNode;
  type: string;
  value: string;
}

export interface KPICardI extends DynamicDetailsI {
  description: string;
  iconColor?: PillColor;
}
