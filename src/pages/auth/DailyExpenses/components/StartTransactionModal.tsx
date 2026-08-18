import { FormProvider, type UseFormReturn } from "react-hook-form";
import { useModal } from "@c/context/providers/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import FormControlField from "@c/components/FormControlField";
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
import type { ErrorResponseI } from "@c/types/globalTypes";
import type { StartBudgetFormT } from "@c/types/dailyExpenseTypes";

interface StartTransactionModalI {
  formMethod: UseFormReturn<StartBudgetFormT>;
  onSubmit: (data: StartBudgetFormT) => Promise<boolean>;
  errorList: ErrorResponseI;
}

export default function StartTransactionModal({
  formMethod,
  onSubmit,
  errorList,
}: StartTransactionModalI) {
  const { onClose } = useModal();
  const { register, handleSubmit } = formMethod;

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
            label="Transaction Name"
            type="text"
            placeHolder="e.g. Grocery run"
            props={register("name")}
            errors={errorList}
          />
          <Field>
            <FieldLabel>Allotted Budget</FieldLabel>
            <InputGroup>
              <InputGroupAddon className="border-r border-input bg-muted/60 font-semibold text-foreground">
                ₱
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                step="0.01"
                placeholder="0.00"
                className="font-semibold tabular-nums"
                {...register("budget_amount")}
              />
            </InputGroup>
          </Field>
        </FieldGroup>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Start Transaction
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
