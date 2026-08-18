import { useEffect, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { FieldGroup } from "@c/lib/shadcn/components/ui/field";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { cn } from "@c/lib/shadcn/lib/utils";
import {
  useBillContext,
  type BillFormSchema,
} from "@c/context/providers/BillsProvider";
import { useModal } from "@c/context/providers/ModalProvider";
import { DestructiveAlert } from "@c/components/alerts/DestructiveAlert";
import { getDefaultBillFormValues } from "@c/types/billsTypes";
import { today_date } from "@c/utils/utilities.util";
import { BILL_FORM_SECTIONS } from "./billFormSections";
import BillBasicInfo from "./billBasicInfo";
import BillingDetails from "./billingDetails";
import PaymentSettings from "./paymentSettings";
import { BillFormLockContext } from "./billFormLockContext";

const STEP_CONTENT = [BillBasicInfo, BillingDetails, PaymentSettings];

interface BillFormWizardI {
  mode?: "create" | "edit";
  locked?: boolean;
}

export default function BillFormWizard({
  mode = "create",
  locked = false,
}: BillFormWizardI) {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const { control, trigger, reset } = useFormContext<BillFormSchema>();
  const { errors } = useFormState<BillFormSchema>({ control });
  const { errorList } = useBillContext();
  const { onClose } = useModal();
  const [billingDate, frequency] = useWatch({
    control,
    name: ["billing_date", "frequency"],
  });

  useEffect(() => {
    if (mode !== "create") return;
    return () => reset(getDefaultBillFormValues());
  }, [reset, mode]);

  const lastStep = BILL_FORM_SECTIONS.length - 1;
  const currentSection = BILL_FORM_SECTIONS[step];
  const StepContent = STEP_CONTENT[step];

  const stepErrors = currentSection.fields.reduce<Record<string, string[]>>(
    (acc, field) => {
      const message = errors[field]?.message;
      if (message) acc[field] = [message];
      return acc;
    },
    {},
  );
  const hasStepErrors = Object.keys(stepErrors).length > 0;

  const isBillingDetailsStep = currentSection.id === "billing-details";
  const billingDetailsInvalid =
    isBillingDetailsStep &&
    (mode === "create"
      ? !billingDate || billingDate < today_date() || !frequency
      : !frequency);

  const goToStep = (index: number) => {
    if (index <= furthestStep) setStep(index);
  };

  const handleNext = async () => {
    const valid = await trigger(currentSection.fields);
    if (!valid) return;
    const next = Math.min(step + 1, lastStep);
    setStep(next);
    setFurthestStep((prev) => Math.max(prev, next));
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const formEl = event.currentTarget.form;
    const valid = await trigger();
    if (valid) {
      formEl?.requestSubmit();
      return;
    }
    const erroredFields = Object.keys(errors);
    const invalidStep = BILL_FORM_SECTIONS.findIndex((section) =>
      section.fields.some((field) => erroredFields.includes(field)),
    );
    if (invalidStep !== -1) {
      setStep(invalidStep);
      setFurthestStep((prev) => Math.max(prev, invalidStep));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-center gap-1.5 overflow-x-auto border-b bg-popover/95 px-4 py-2.5 backdrop-blur supports-backdrop-filter:bg-popover/80">
        {BILL_FORM_SECTIONS.map((section, index) => {
          const isActive = index === step;
          const isDone = index < step;
          const isReachable = index <= furthestStep;
          return (
            <button
              key={section.id}
              type="button"
              disabled={!isReachable}
              onClick={() => goToStep(index)}
              className={cn(
                "flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : isReachable
                    ? "border-transparent text-muted-foreground hover:bg-muted"
                    : "border-transparent text-muted-foreground/40",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
                  isActive || isDone
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              {section.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-5">
        {errorList && (
          <DestructiveAlert
            title={errorList?.message}
            description={errorList?.data}
          />
        )}
        {hasStepErrors && (
          <DestructiveAlert
            title="Please fix the following before continuing"
            description={stepErrors}
          />
        )}
        <BillFormLockContext.Provider value={{ mode, locked }}>
          <FieldGroup>
            <StepContent />
          </FieldGroup>
        </BillFormLockContext.Provider>
      </div>

      <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between gap-4 border-t bg-popover/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-popover/80">
        <span className="text-xs text-muted-foreground">
          Step {step + 1} of {BILL_FORM_SECTIONS.length} ·{" "}
          {currentSection.label}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={() => onClose()} variant="outline" type="button">
            Close
          </Button>
          {step > 0 && (
            <Button onClick={handlePrevious} variant="outline" type="button">
              Previous
            </Button>
          )}
          {step < lastStep && (
            <Button
              className="px-6!"
              variant="primary"
              type="button"
              onClick={handleNext}
              disabled={billingDetailsInvalid}
            >
              Next
            </Button>
          )}
          {step === lastStep && (
            <Button
              className="px-6!"
              variant="primary"
              type="button"
              onClick={handleSubmitClick}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
