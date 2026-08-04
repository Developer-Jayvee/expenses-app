import type { InputTypes } from "@/types/globalTypes";

interface InputFieldProps {
  label: {
    title: string;
  };
  input: {
    placeholder: string;
    type: InputTypes;
  };
  props?: any;
}
export default function InputField({ label, input, props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="secondary font-bold">{label.title}</label>
      <input type={input.type} placeholder={input.placeholder} {...props} />
    </div>
  );
}
