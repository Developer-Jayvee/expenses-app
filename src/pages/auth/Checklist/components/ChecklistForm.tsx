import { useState } from "react";
import {
  FormProvider,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormReturn,
} from "react-hook-form";
import { CiTrash } from "react-icons/ci";
import { BiPlus } from "react-icons/bi";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { Card } from "@c/lib/shadcn/components/ui/card";
import { Field, FieldLabel } from "@c/lib/shadcn/components/ui/field";
import { Input } from "@c/lib/shadcn/components/ui/input";
import { Textarea } from "@c/lib/shadcn/components/ui/textarea";
import FormControlField from "@c/components/FormControlField";
import {
  checklistItemSchema,
  type ChecklistGroupFormT,
} from "@c/types/checklistTypes";
import type { ErrorResponseI } from "@c/types/globalTypes";
import { currency_formatter } from "@c/utils/utilities.util";

interface ItemErrorsI {
  item_name?: string;
  estimated_price?: string;
  quantity?: string;
}

interface ChecklistFormI {
  groupForm: UseFormReturn<ChecklistGroupFormT>;
  fields: Array<FieldArrayWithId<ChecklistGroupFormT, "items", "id">>;
  append: UseFieldArrayAppend<ChecklistGroupFormT, "items">;
  remove: UseFieldArrayRemove;
  onSubmit: (data: ChecklistGroupFormT) => Promise<boolean>;
  submitLabel?: string;
  errorList: ErrorResponseI;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ChecklistForm({
  groupForm,
  fields,
  append,
  remove,
  onSubmit,
  submitLabel = "Submit Checklist",
  errorList,
  onCancel,
  onSuccess,
}: ChecklistFormI) {
  const { register, handleSubmit } = groupForm;

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemErrors, setItemErrors] = useState<ItemErrorsI>({});

  const handleAddItem = () => {
    const result = checklistItemSchema.safeParse({
      item_name: itemName.trim(),
      estimated_price: itemPrice,
      quantity: itemQty,
    });

    if (!result.success) {
      const errors: ItemErrorsI = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (
          (field === "item_name" ||
            field === "estimated_price" ||
            field === "quantity") &&
          !errors[field]
        ) {
          errors[field] = issue.message;
        }
      });
      setItemErrors(errors);
      return;
    }

    append(result.data);
    setItemName("");
    setItemPrice("");
    setItemQty("1");
    setItemErrors({});
  };

  const handleDraftKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const estimatedTotal = (fields ?? []).reduce(
    (sum, field) =>
      sum + Number(field.estimated_price ?? 0) * Number(field.quantity ?? 0),
    0,
  );

  return (
    <FormProvider {...groupForm}>
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await onSubmit(data);
          if (success) onSuccess();
        })}
        className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
      >
        <div className="flex flex-wrap gap-4 border-b p-4 sm:p-5">
          <div className="min-w-[180px] flex-1">
            <FormControlField
              label="Title"
              type="text"
              placeHolder="e.g. Weekly Groceries"
              props={register("title")}
              errors={errorList}
            />
          </div>
          <div className="min-w-[220px] flex-[2]">
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Optional notes about this checklist"
                rows={1}
                className="min-h-9 resize-none"
                {...register("description")}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-b bg-muted/30 px-4 py-4 sm:px-5">
          <div>
            <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Estimated Total
            </div>
            <div className="mt-1 font-mono text-2xl font-medium tracking-tight">
              {currency_formatter(estimatedTotal)}
            </div>
          </div>
          <div className="flex-1" />
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={(fields ?? []).length === 0}
          >
            {submitLabel}
          </Button>
        </div>

        <div className="p-4 sm:p-5 sm:pb-0">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-input bg-muted/20 p-3">
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyDown={handleDraftKeyDown}
              placeholder="Item name — e.g. Rice"
              className="min-w-[140px] flex-[3] bg-background"
            />
            <Input
              type="number"
              step="0.01"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              onKeyDown={handleDraftKeyDown}
              placeholder="0.00"
              className="w-24 flex-1 bg-background text-right font-mono"
            />
            <Input
              type="number"
              step="1"
              value={itemQty}
              onChange={(e) => setItemQty(e.target.value)}
              onKeyDown={handleDraftKeyDown}
              className="w-16 flex-none bg-background text-right font-mono"
            />
            <Button type="button" onClick={handleAddItem}>
              <BiPlus size={16} />
              Add Item
            </Button>
          </div>
          {(itemErrors.item_name ||
            itemErrors.estimated_price ||
            itemErrors.quantity) && (
            <div className="mt-2 flex flex-col gap-0.5 text-xs text-destructive">
              {itemErrors.item_name && <span>{itemErrors.item_name}</span>}
              {itemErrors.estimated_price && (
                <span>{itemErrors.estimated_price}</span>
              )}
              {itemErrors.quantity && <span>{itemErrors.quantity}</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 pt-5 sm:px-5">
          <h3 className="text-sm font-bold">Items</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {(fields ?? []).length}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {(fields ?? []).length > 0 ? (
            <Card className="gap-0 overflow-hidden rounded-xl py-0" size="sm">
              {(fields ?? []).map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-wrap items-center gap-3 border-b px-4 py-3 last:border-b-0"
                >
                  <span className="min-w-[120px] flex-1 text-sm font-semibold">
                    {field.item_name}
                  </span>
                  <span className="min-w-[96px] text-right font-mono text-xs text-muted-foreground">
                    {currency_formatter(Number(field.estimated_price ?? 0))} ×{" "}
                    {Number(field.quantity ?? 0)}
                  </span>
                  <span className="min-w-[92px] text-right font-mono text-sm font-medium">
                    {currency_formatter(
                      Number(field.estimated_price ?? 0) *
                        Number(field.quantity ?? 0),
                    )}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Remove item"
                    onClick={() => remove(index)}
                  >
                    <CiTrash size={16} />
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed py-10 text-center">
              <span className="text-sm font-semibold">
                Nothing on this list yet
              </span>
              <span className="max-w-[320px] text-xs text-muted-foreground">
                Add the first thing you plan to buy — price and quantity are
                optional.
              </span>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
