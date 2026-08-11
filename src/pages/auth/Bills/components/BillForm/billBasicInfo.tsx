import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Textarea } from "@c/lib/shadcn/components/ui/textarea";

const BillBasicInfo = ({
  register,
  control,
  references,
}: {
  register: any;
  control: any;
  references: any;
}) => {
  return (
    <FieldSet>
      <FieldLegend>Basic Information</FieldLegend>
      <FieldDescription>
        Core identity and classification of the bill:
      </FieldDescription>
      <FieldGroup>
        <FormControl
          label={{
            name: "Bill Title",
          }}
          input={{
            name: "name",
            placeholder: "e.g Rent",
            type: "text",
            props: { ...register?.("name") },
          }}
        />
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
