import FormControlField from "@c/components/FormControlField";
import FormSelect from "@c/components/FormSelect";
import { useBillContext } from "@c/context/providers/BillsProvider";
import useReferenceHook from "@c/hooks/useReferenceHook";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Textarea } from "@c/lib/shadcn/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const BillBasicInfo = () => {
  const { register, control } = useFormContext();
  const { references } = useReferenceHook();
  const { errorList } = useBillContext();

  return (
    <FieldSet>
      <FieldLegend>Basic Information</FieldLegend>
      <FieldDescription>
        Core identity and classification of the bill.
      </FieldDescription>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr]">
          <FormControlField
            label="Bill Title"
            required
            type="text"
            placeHolder="e.g Rent"
            props={register?.("name")}
            errors={errorList}
          />
          <FormSelect
            control={control}
            label={{
              name: "Category",
              required: true,
            }}
            name="category"
            input={{
              placeholder: "Select Category",
              props: { ...register?.("category") },
            }}
            options={references?.category ?? []}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Description{" "}
            <span className="font-normal text-muted-foreground/70">
              optional
            </span>
          </label>
          <Textarea
            placeholder="Type your bill description here"
            {...register?.("description")}
          />
        </div>
      </FieldGroup>
    </FieldSet>
  );
};

export default BillBasicInfo;
