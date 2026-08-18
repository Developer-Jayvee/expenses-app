import {
  Field,
  FieldError,
  FieldLabel,
} from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import type { HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface AuthInputFieldProps {
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  props?: UseFormRegisterReturn;
}

export default function AuthInputField({
  label,
  type,
  placeholder,
  error,
  props,
}: AuthInputFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...props}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
