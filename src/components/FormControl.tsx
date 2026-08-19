import type { FormControlI } from "@c/types/formControlTypes";

export default function FormControl({ label, input }: FormControlI) {
  return (
    <div className="flex flex-col gap-2">
      <label
        {...label.props}
        className={`${label.customClass ?? "font-medium text-muted-foreground"} `}
      >
        {label.name}
        {label.required && <span className="text-destructive"> *</span>}
      </label>
      <input
        {...input.props}
        type={input.type}
        name={input.name}
        placeholder={`${input.placeholder ?? "Please complete this field."}`}
      />
    </div>
  );
}
