import { useState } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { useModal } from "@c/context/providers/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import FormControlField from "@c/components/FormControlField";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@c/lib/shadcn/components/ui/input-group";
import type { ErrorResponseI } from "@c/types/globalTypes";
import type {
  BudgetChecklistI,
  StartBudgetFormT,
} from "@c/types/dailyExpenseTypes";
import type { ChecklistGroupI } from "@c/types/checklistTypes";
import { currency_formatter } from "@c/utils/utilities.util";

interface TemplateRowI {
  id: string | number;
  item_name: string;
  estimated_price: number;
  quantity: string;
}

const row_total = (row: TemplateRowI) =>
  Number(row.estimated_price) * Number(row.quantity || 0);

const rows_total = (rows: TemplateRowI[]) =>
  Math.round(rows.reduce((total, row) => total + row_total(row), 0) * 100) /
  100;

interface StartTransactionModalI {
  formMethod: UseFormReturn<StartBudgetFormT>;
  onSubmit: (data: StartBudgetFormT) => Promise<boolean>;
  errorList: ErrorResponseI;
  checklistGroups?: ChecklistGroupI[];
  onSelectGroup?: (id: string | number) => Promise<ChecklistGroupI | null>;
  onChecklistChange?: (checklist: BudgetChecklistI | null) => void;
}

export default function StartTransactionModal({
  formMethod,
  onSubmit,
  errorList,
  checklistGroups,
  onSelectGroup,
  onChecklistChange,
}: StartTransactionModalI) {
  const { onClose } = useModal();
  const { register, handleSubmit, setValue, getValues } = formMethod;
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groupTitle, setGroupTitle] = useState<string>("");
  const [rows, setRows] = useState<TemplateRowI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const groups = checklistGroups ?? [];

  const syncTemplate = (
    groupId: string,
    title: string,
    nextRows: TemplateRowI[],
  ) => {
    setRows(nextRows);
    setValue(
      "budget_amount",
      nextRows.length ? String(rows_total(nextRows)) : "",
    );
    onChecklistChange?.(
      nextRows.length
        ? {
            group_id: groupId,
            title,
            items: nextRows.map((row) => ({
              id: row.id,
              item_name: row.item_name,
              quantity: Number(row.quantity || 0),
              amount: row_total(row),
            })),
          }
        : null,
    );
  };

  const clearTemplate = () => {
    // Only drop the prefilled name/budget; anything typed by hand is kept.
    if ((getValues("name")?.trim() ?? "") === groupTitle) setValue("name", "");
    if (rows.length) setValue("budget_amount", "");
    setGroupTitle("");
    setRows([]);
    onChecklistChange?.(null);
  };

  const handleSelectGroup = async (value: string) => {
    setSelectedGroupId(value);
    if (!value || !onSelectGroup) {
      clearTemplate();
      return;
    }

    setIsLoading(true);
    try {
      const group = await onSelectGroup(value);
      const nextRows: TemplateRowI[] = (group?.items ?? []).map((item) => ({
        id: item.id,
        item_name: item.item_name,
        estimated_price: Number(item.estimated_price ?? 0),
        quantity: String(item.quantity ?? 1),
      }));
      const nextTitle = group?.title ?? "";
      const currentName = getValues("name")?.trim() ?? "";

      if (!currentName || currentName === groupTitle) {
        setValue("name", nextTitle);
      }
      setGroupTitle(nextTitle);
      syncTemplate(value, nextTitle, nextRows);
    } catch {
      clearTemplate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (id: string | number, quantity: string) => {
    syncTemplate(
      selectedGroupId,
      groupTitle,
      rows.map((row) => (row.id === id ? { ...row, quantity } : row)),
    );
  };

  return (
    <FormProvider {...formMethod}>
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await onSubmit(data);
          if (success) onClose();
        })}
      >
        <FieldGroup>
          {groups.length > 0 && (
            <Field>
              <FieldLabel>
                Checklist Template
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <select
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring"
                value={selectedGroupId}
                onChange={(e) => handleSelectGroup(e.target.value)}
              >
                <option value="">Start from scratch</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.title}
                  </option>
                ))}
              </select>

              {isLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading checklist…
                </p>
              )}

              {!isLoading && rows.length > 0 && (
                <div className="mt-1 flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
                  {rows.map((row) => (
                    <div key={row.id} className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {row.item_name}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {currency_formatter(row.estimated_price)} each
                        </div>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        aria-label={`Quantity for ${row.item_name}`}
                        className="h-8 w-20"
                        value={row.quantity}
                        onChange={(e) =>
                          handleQuantityChange(row.id, e.target.value)
                        }
                      />
                      <span className="w-24 text-right font-mono text-sm font-semibold">
                        {currency_formatter(row_total(row))}
                      </span>
                    </div>
                  ))}
                  <div className="mt-1 flex items-center justify-between border-t pt-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Estimated total
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {currency_formatter(rows_total(rows))}
                    </span>
                  </div>
                </div>
              )}
            </Field>
          )}

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
