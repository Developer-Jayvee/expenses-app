export type InputTypes = "text" | "password";

export interface DefaultResponseI<R = Array<[]>, M = string> {
  data: R;
  message: M;
  status: boolean;
}

export type OptionTypes = "category" | "payments";

export interface ReferenceResponseI {
  label: string;
  key: string;
}
export type OptionFormatI = Array<{ label: string; key: string }>;
