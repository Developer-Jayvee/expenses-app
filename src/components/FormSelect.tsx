import type { ElementI, InputTextI } from "@c/types/formControlTypes";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/lib/shadcn/components/ui/combobox";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

export default function FormSelect<T, TForm extends FieldValues>({
  label,
  input,
  name,
  options,
  control,
}: {
  label: ElementI;
  input: Pick<InputTextI, "placeholder" | "props">;
  options: T[] | [];
  control: Control<TForm> | null;
  name: Path<TForm>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className={`${label.customClass ?? "font-medium text-muted-foreground"}`}
      >
        {label.name}
      </label>
      <div>
        {control && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                items={options}
              >
                <ComboboxInput placeholder={input.placeholder} />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => {
                      const label =
                        typeof item === "object" ? item.label : item;
                      const value = typeof item === "object" ? item.key : item;

                      return (
                        <ComboboxItem key={value} value={value}>
                          {label}
                        </ComboboxItem>
                      );
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
        )}
      </div>
    </div>
  );
}
