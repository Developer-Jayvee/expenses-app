import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { PaymentOptions } from "@c/data/options";
import { FieldGroup, FieldSet } from "@c/lib/shadcn/components/ui/field";
import { logPaymentSchema, type LogPaymentType } from "@c/types/billsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export default function PaymentLog() {
  const { id } = useParams();

  if (!id) return null;
  const { control, register } = useForm<LogPaymentType>({
    resolver: zodResolver(logPaymentSchema),
    defaultValues: {
      payment_mode: "cash",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });
  return (
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
      </FieldSet>
    </FieldGroup>
  );
}
