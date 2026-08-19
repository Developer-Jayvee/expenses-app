import {
  Field,
  FieldError,
  FieldLabel,
} from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import type { ErrorResponseI } from "@c/types/globalTypes";
import type { HTMLInputTypeAttribute } from "react";

interface FormControlFieldI {
  label: string;
  labelClassName?: string;
  required?: boolean;

  type: HTMLInputTypeAttribute;
  inputClassName?: string;
  placeHolder?: string;
  errors?: ErrorResponseI;

  props?: any;
}
export default function FormControlField({
  label,
  labelClassName,
  required,
  placeHolder,
  type,
  inputClassName,

  errors,
  props,
}: FormControlFieldI) {
  return (
    <Field>
      <FieldLabel className={`${labelClassName}`}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Input
        type={type}
        placeholder={placeHolder}
        className={`${inputClassName}`}
        {...props}
      />
      {errors?.data && <FieldError>{errors.data?.[0] ?? ""}</FieldError>}
    </Field>
  );
}
