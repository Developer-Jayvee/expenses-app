import z from "zod";
import {
  get_frequency_options_for_range,
  today_date,
} from "@c/utils/utilities.util";

export type BillStatusT = "active" | "ongoing" | "inactive" | "completed";

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
]);
export type FrequencyTypes = "monthly" | "yearly" | "daily" | "once" | "";
export const FrequencySchema = z.enum([
  "monthly",
  "yearly",
  "daily",
  "once",
  "",
]);
export interface BillFormI {
  name: string;
  amount: string;
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

export const billSchema = z
  .object({
    name: z.string().min(1, "Bill title is required."),
    amount: z.string().min(1, "Bill amount is invalid"),
    billing_date: z.string().min(1, "Invalid date"),
    end_date: z.string().min(1, "Invalid date"),
    status: z.enum(["active", "ongoing", "inactive", "completed"]),
    category: BillCategorySchema,
    is_autopay: z.boolean(),
    description: z.string().optional(),
    frequency: FrequencySchema,
    default_payment: z.enum(["gcash", "cash"]),
  })
  .superRefine((data, ctx) => {
    if (!data.billing_date || !data.end_date) return;
    if (data.end_date <= data.billing_date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date must be after the start date.",
      });
      return;
    }
    if (!data.frequency) {
      ctx.addIssue({
        code: "custom",
        path: ["frequency"],
        message: "Please select a frequency.",
      });
      return;
    }
    const validFrequencies = get_frequency_options_for_range(
      data.billing_date,
      data.end_date,
    );
    if (!validFrequencies.includes(data.frequency)) {
      ctx.addIssue({
        code: "custom",
        path: ["frequency"],
        message: `${data.frequency} is not valid for the selected date range.`,
      });
    }
  });

export const createBillSchema = billSchema.superRefine((data, ctx) => {
  if (data.billing_date && data.billing_date < today_date()) {
    ctx.addIssue({
      code: "custom",
      path: ["billing_date"],
      message: "Start date cannot be in the past.",
    });
  }
});

export const editBillSchema = z
  .object({
    name: z.string().min(1, "Bill title is required."),
    amount: z.string(),
    billing_date: z.string(),
    end_date: z.string().min(1, "Invalid date"),
    status: z.enum(["active", "ongoing", "inactive", "completed"]),
    category: BillCategorySchema,
    is_autopay: z.boolean(),
    description: z.string().optional(),
    frequency: FrequencySchema,
    default_payment: z.enum(["gcash", "cash"]),
  })
  .superRefine((data, ctx) => {
    if (!data.frequency) {
      ctx.addIssue({
        code: "custom",
        path: ["frequency"],
        message: "Please select a frequency.",
      });
    }
    if (
      data.billing_date &&
      data.end_date &&
      data.end_date <= data.billing_date
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date must be after the start date.",
      });
    }
  });

export const getDefaultBillFormValues = (): BillFormI => {
  return {
    name: "",
    amount: "0",
    status: "active",
    is_autopay: true,
    description: "",
    category: "other",
    frequency: "",
    billing_date: today_date(),
    end_date: "",
    default_payment: "cash",
  };
};

export interface DynamicDetailsI {
  children: React.ReactNode;
  type: string;
  value: React.ReactNode;
}
