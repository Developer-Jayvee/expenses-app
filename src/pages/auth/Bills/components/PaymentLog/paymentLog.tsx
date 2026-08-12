import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { PaymentOptions } from "@c/data/options";
import useBillsHook from "@c/hooks/useBillsHook";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function PaymentLog({
  control,
  register,
  setValue,
}: {
  control: any;
  register: any;
  setValue: any;
}) {
  const { id } = useParams();
  const { selectedExp, getBillData } = useBillsHook();
  if (!id) return null;

  useEffect(() => {
    getBillData(id);
  }, [id]);

  useEffect(() => {
    if (selectedExp?.amount) {
      setValue("amount", selectedExp.amount);
    }
  }, [selectedExp]);
  return (
    <div className="w-auto mb-4">
      <FieldGroup>
        <FieldSet>
          <FormSelect
            control={control}
            label={{
              name: "Payment Method",
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
                label={{ name: "Transaction Date" }}
                input={{
                  name: "transaction_date",
                  placeholder: "End Date",
                  type: "date",
                  props: {
                    ...register("transaction_date"),
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
            <FieldLabel>Amount</FieldLabel>
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
