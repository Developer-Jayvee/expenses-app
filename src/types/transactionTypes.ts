import z from "zod";

export interface TransactionDataI {
  amount: number;
  payment_mode: "gcash" | "cash";
  transaction_date: string;
  notes: string | null;
}
export const logPaymentSchema = z.object({
  amount: z.number(),
  payment_mode: z.enum(["gcash", "cash"]),
  transaction_date: z.string(),
  notes: z.string().optional(),
});
export type LogPaymentType = z.infer<typeof logPaymentSchema>;
export interface ExtendedLogPayment extends LogPaymentType {
  billsId: string;
}
