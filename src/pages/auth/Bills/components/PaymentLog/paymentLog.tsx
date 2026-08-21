import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { DestructiveAlert } from "@c/components/alerts/DestructiveAlert";
import { PaymentOptions } from "@c/data/options";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import type { PostBillDataI } from "@c/types/billsTypes";
import type { LogPaymentType } from "@c/types/transactionTypes";
import { useEffect } from "react";
import { useFormState } from "react-hook-form";
import { useParams } from "react-router";

export default function PaymentLog({
  control,
  register,
  setValue,
  details,
  dateBounds,
}: {
  control: any;
  register: any;
  setValue: any;
  details: PostBillDataI | null;
  dateBounds?: { min: string; max: string } | null;
}) {
  const { id } = useParams();
  const { errors } = useFormState<LogPaymentType>({ control });

  const fieldErrors = Object.entries(errors).reduce<Record<string, string[]>>(
    (acc, [field, error]) => {
      if (field === "root") return acc;
      const message = (error as { message?: string } | undefined)?.message;
      if (message) acc[field] = [message];
      return acc;
    },
    {},
  );
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const serverErrorMessage = errors?.root?.serverError?.message;

  useEffect(() => {
    if (details?.amount) {
      setValue("amount", details.amount);
    }
  }, [details]);

  if (!id) return null;
  return (
    <div className="w-auto mb-4">
      <FieldGroup>
        {serverErrorMessage && <DestructiveAlert title={serverErrorMessage} />}
        {hasFieldErrors && (
          <DestructiveAlert
            title="Please fix the following before continuing"
            description={fieldErrors}
          />
        )}
        <FieldSet>
          <FormSelect
            control={control}
            label={{
              name: "Payment Method",
              required: true,
            }}
            name="payment_mode"
            input={{
              placeholder: "Select Payment Method",
              props: { ...register?.("payment_mode") },
            }}
            options={PaymentOptions}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex-1 min-w-0">
              <FormControl
                label={{ name: "Transaction Date", required: true }}
                input={{
                  name: "transaction_date",
                  placeholder: "End Date",
                  type: "date",
                  props: {
                    ...register("transaction_date"),
                    min: dateBounds?.min,
                    max: dateBounds?.max,
                  },
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <FormControl
                label={{ name: "Notes" }}
                input={{
                  name: "notes",
                  placeholder: "Notes",
                  type: "text",
                  props: {
                    ...register("notes"),
                  },
                }}
              />
            </div>
          </div>
          <Field>
            <FieldLabel>
              Amount
              <span className="text-destructive"> *</span>
            </FieldLabel>
            <Input
              id="amount"
              type="number"
              {...register("amount", {
                valueAsNumber: true,
              })}
            />
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
