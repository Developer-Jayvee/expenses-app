import { FormProvider, type UseFormReturn } from "react-hook-form";
import { useModal } from "@c/context/providers/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import FormControlField from "@c/components/FormControlField";
import FormSelect from "@c/components/FormSelect";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@c/lib/shadcn/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@c/lib/shadcn/components/ui/input-group";
import { DailyExpenseTypeOptions, PaymentOptions } from "@c/data/options";
import type { ErrorResponseI } from "@c/types/globalTypes";
import type { ExpenseFormT } from "@c/types/dailyExpenseTypes";

interface AddExpenseModalI {
  formMethod: UseFormReturn<ExpenseFormT>;
  onSubmit: (data: ExpenseFormT) => Promise<boolean>;
  errorList: ErrorResponseI;
}

export default function AddExpenseModal({
  formMethod,
  onSubmit,
  errorList,
}: AddExpenseModalI) {
  const { onClose } = useModal();
  const { register, control, handleSubmit } = formMethod;

  return (
    <FormProvider {...formMethod}>
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await onSubmit(data);
          if (success) onClose();
        })}
      >
        <FieldGroup>
          <FormControlField
            label="Expense Name"
            type="text"
            placeHolder="e.g. Lunch"
            props={register("name")}
            errors={errorList}
          />
          <FormSelect
            control={control}
            label={{ name: "Type" }}
            name="type"
            input={{
              placeholder: "Select Type",
              props: { ...register("type") },
            }}
            options={DailyExpenseTypeOptions}
          />
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon className="border-r border-input bg-muted/60 font-semibold text-foreground">
                ₱
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                step="0.01"
                placeholder="0.00"
                className="font-semibold tabular-nums"
                {...register("amount")}
              />
            </InputGroup>
          </Field>
          <FormSelect
            control={control}
            label={{ name: "Payment Type" }}
            name="payment_type"
            input={{
              placeholder: "Select Payment Type",
              props: { ...register("payment_type") },
            }}
            options={PaymentOptions}
          />
        </FieldGroup>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Expense
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
