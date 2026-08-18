import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@c/lib/shadcn/components/ui/input-group";
import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { FrequencyOptions } from "@c/data/options";
import type { FrequencyTypes } from "@c/types/billsTypes";
import {
  get_frequency_options_for_range,
  today_date,
} from "@c/utils/utilities.util";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useBillFormLock } from "./billFormLockContext";

const BillingDetails = () => {
  const { register, control, setValue, getValues } = useFormContext();
  const { mode, locked } = useBillFormLock();
  const [frequency, billingDate, endDate] = useWatch({
    control,
    name: ["frequency", "billing_date", "end_date"],
  });
  const frequencyLabel =
    FrequencyOptions.find((option) => option.key === frequency)?.label ??
    frequency;

  const startDateInvalid =
    mode === "create" && (!billingDate || billingDate < today_date());
  const availableFrequencies = get_frequency_options_for_range(
    billingDate,
    endDate,
  );
  const frequencyOptions = FrequencyOptions.filter(
    (option) =>
      option.key === "" ||
      availableFrequencies.includes(option.key as FrequencyTypes),
  );

  useEffect(() => {
    if (locked) return;
    const currentFrequency = getValues("frequency") as FrequencyTypes;
    if (currentFrequency && !availableFrequencies.includes(currentFrequency)) {
      setValue("frequency", "", { shouldValidate: true, shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingDate, endDate, locked]);

  return (
    <FieldSet>
      <FieldLegend>Billing Details</FieldLegend>
      <FieldDescription>
        Information about the billing period and recurrence
      </FieldDescription>
      <FieldGroup>
        {locked && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-sm text-amber-700 dark:text-amber-400">
            Billing details are locked because this bill already has logged
            payments.
          </div>
        )}
        <Field>
          <FieldLabel>Amount (Pesos)</FieldLabel>
          <InputGroup>
            <InputGroupAddon className="border-r border-input bg-muted/60 font-semibold text-foreground">
              ₱
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              step="0.01"
              placeholder="0.00"
              className="font-semibold tabular-nums"
              disabled={locked}
              {...register?.("amount")}
            />
          </InputGroup>
        </Field>
        <div className="grid grid-cols-2 gap-x-4">
          <FormControl
            label={{ name: "Start Date" }}
            input={{
              name: "billing_date",
              placeholder: "Billing Date",
              type: "date",
              props: {
                ...register?.("billing_date"),
                min: mode === "create" ? today_date() : undefined,
                disabled: locked,
              },
            }}
          />
          <FormControl
            label={{ name: "End Date" }}
            input={{
              name: "end_date",
              placeholder: "End Date",
              type: "date",
              props: {
                ...register("end_date"),
                min: billingDate || undefined,
                disabled: locked,
              },
            }}
          />
        </div>
        <FormSelect
          control={control}
          label={{
            name: "Frequency",
          }}
          name="frequency"
          input={{
            placeholder: "Select Frequency",
            props: { ...register?.("frequency") },
          }}
          options={frequencyOptions}
          disabled={startDateInvalid || locked}
        />
        {billingDate && endDate && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground">
            {frequencyLabel} · starts {billingDate} · ends {endDate}
          </div>
        )}
      </FieldGroup>
    </FieldSet>
  );
};

export default BillingDetails;
