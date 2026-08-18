import FormSelect from "@c/components/FormSelect";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Switch } from "@c/lib/shadcn/components/ui/switch";
import { PaymentOptions, StatusOptions } from "@c/data/options";
import { cn } from "@c/lib/shadcn/lib/utils";

import { Controller, useFormContext } from "react-hook-form";
import { useBillFormLock } from "./billFormLockContext";
export default function PaymentSettings() {
  const { register, control } = useFormContext();
  const { locked } = useBillFormLock();
  return (
    <FieldSet>
      <FieldLegend>Payment Settings</FieldLegend>
      <FieldDescription>
        Things that control how the bill is paid
      </FieldDescription>
      <FieldGroup>
        {locked && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-sm text-amber-700 dark:text-amber-400">
            Payment settings are locked because this bill already has logged
            payments.
          </div>
        )}
        <Controller
          control={control}
          name="is_autopay"
          render={({ field }) => (
            <div
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors",
                field.value
                  ? "border-primary/25 bg-primary/5"
                  : "border-border bg-transparent",
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Autopay</span>
                <span className="text-xs text-muted-foreground">
                  Charge the payment method automatically on the due date.
                </span>
              </div>
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={locked}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            control={control}
            label={{
              name: "Payment Method",
            }}
            name="default_payment"
            input={{
              placeholder: "Select Payment Method",
              props: { ...register?.("default_payment") },
            }}
            options={PaymentOptions}
            disabled={locked}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  {StatusOptions.map((option) => {
                    const isActive = field.value === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        disabled={locked}
                        onClick={() => field.onChange(option.key)}
                        className={cn(
                          "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
                          isActive
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                          locked && "cursor-not-allowed opacity-50",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
