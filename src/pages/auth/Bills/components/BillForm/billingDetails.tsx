import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { FrequencyOptions } from "@c/data/options";

const BillingDetails = ({
  register,
  control,
}: {
  register: any;
  control: any;
}) => {
  return (
    <FieldSet>
      <FieldLegend>Billing Details</FieldLegend>
      <FieldDescription>
        Information about the billing period and recurrence
      </FieldDescription>
      <FieldGroup>
        <FormControl
          label={{ name: "Amount(Pesos)" }}
          input={{
            name: "amount",
            placeholder: "0.00",
            type: "number",
            props: { ...register?.("amount") },
          }}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <FormControl
            label={{ name: "Start Date" }}
            input={{
              name: "billing_date",
              placeholder: "Billing Date",
              type: "date",
              props: { ...register?.("billing_date") },
            }}
          />
          <FormControl
            label={{ name: "End Date" }}
            input={{
              name: "end_date",
              placeholder: "End Date",
              type: "date",
              props: {
                ...register("end_date", {
                  valueAsDate: true,
                }),
              },
            }}
          />
        </div>
        <FormSelect
          control={control}
          label={{
            name: "Frequency",
          }}
          name="frequency"
          input={{
            placeholder: "Select Frequency",
            props: { ...register?.("frequency") },
          }}
          options={FrequencyOptions}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default BillingDetails;
