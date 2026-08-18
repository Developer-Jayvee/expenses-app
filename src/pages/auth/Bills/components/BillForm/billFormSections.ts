import type { BillFormSchema } from "@c/context/providers/BillsProvider";

export interface BillFormSectionI {
  id: string;
  label: string;
  fields: Array<keyof BillFormSchema>;
}

export const BILL_FORM_SECTIONS: Array<BillFormSectionI> = [
  {
    id: "basic-information",
    label: "Basic Information",
    fields: ["name", "category", "description"],
  },
  {
    id: "billing-details",
    label: "Billing Details",
    fields: ["amount", "billing_date", "end_date", "frequency"],
  },
  {
    id: "payment-settings",
    label: "Payment Settings",
    fields: ["is_autopay", "default_payment", "status"],
  },
];
