import z from "zod";

export type BillStatusT = "active" | "inactive" | "completed";

export interface BillDataI {
  name: string;
  amount: number;
  billing_date: string;
  end_date: string;
  status: BillStatusT;
}

export interface PostBillDataI extends BillDataI {
  id: string;
}

export interface PostBillResponseI {
  data: Array<PostBillDataI>;
  message: string;
}

export interface BillCardI extends BillDataI {}

export const billSchema = z.object({
  name: z.string(),
  amount: z.number(),
  billing_date: z.string(),
  end_date: z.string(),
  status: z.enum(["active", "inactive", "completed"]),
});
