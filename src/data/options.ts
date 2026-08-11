import type { OptionFormatI } from "@c/types/globalTypes";

export const StatusOptions: OptionFormatI = [
  { label: "Active", key: "active" },
  { label: "Inactive", key: "inactive" },
  { label: "Completed", key: "completed" },
];

export const FrequencyOptions: OptionFormatI = [
  { label: "Monthly", key: "monthly" },
  { label: "Yearly", key: "yearly" },
  { label: "Daily", key: "daily" },
  { label: "Once", key: "once" },
];

export const PaymentOptions: OptionFormatI = [
  { label: "Cash", key: "cash" },
  { label: "GCash", key: "gcash" },
];
