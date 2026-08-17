import FormControlField from "@c/components/FormControlField";
import FormSelect from "@c/components/FormSelect";
import { useBillContext } from "@c/context/BillsProvider";
import { useReferenceProvider } from "@c/context/ReferenceProvider";
import useReferenceHook from "@c/hooks/useReferenceHook";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Textarea } from "@c/lib/shadcn/components/ui/textarea";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const BillBasicInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { references } = useReferenceHook();
  const { errorList } = useBillContext();
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  return (
    <FieldSet>
      <FieldLegend>Basic Information</FieldLegend>
      <FieldDescription>
        Core identity and classification of the bill:
      </FieldDescription>
      <FieldGroup>
        <FormControlField
          label="Bill Title"
          type="text"
          placeHolder="e.g Rent"
          props={register?.("name")}
          errors={errorList}
        />
        {/* <FormControl
          label={{
            name: "Bill Title",
          }}
          input={{
            name: "name",
            placeholder: "e.g Rent",
            type: "text",
            props: { ...register?.("name") },
          }}
        /> */}
        <FormSelect
          control={control}
          label={{
            name: "Category",
          }}
          name="category"
          input={{
            placeholder: "Select Category",
            props: { ...register?.("category") },
          }}
          options={references?.category ?? []}
        />
        <div className="flex flex-col gap-2">
          <label className="font-medium text-muted-foreground">
            Description
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
