export type InputTypesT = "text" | "password" | "button" | "number" | "date";
export interface ElementI {
  name: string;
  customClass?: string;
  props?: any;
}

export interface InputTextI extends ElementI {
  placeholder: string;
  type: InputTypesT;
}
export interface FormControlI {
  label: ElementI;
  input: InputTextI;
}
