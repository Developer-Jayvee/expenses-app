import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { useReferenceProvider } from "@c/context/ReferenceProvider";
import { StatusOptions } from "@c/data/options";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Label } from "@c/lib/shadcn/components/ui/label";
import { Switch } from "@c/lib/shadcn/components/ui/switch";
import { Textarea } from "@c/lib/shadcn/components/ui/textarea";
import { Controller } from "react-hook-form";

export const BasicInfo = ({
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
export const BillingDetails = ({ register }: { register: any }) => {
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

        {/* frequency */}
      </FieldGroup>
    </FieldSet>
  );
};
export const PaymentSettings = ({
  register,
  control,
}: {
  control: any;
  register: any;
}) => {
  return (
    <FieldSet>
      <FieldLegend>Payment Settings</FieldLegend>
      <FieldDescription>
        Things that control how the bill is paid
      </FieldDescription>
      <FieldGroup>
        {/* auto pay */}
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="is_autopay"
            render={({ field }) => {
              console.log("is_autopay:", field.value, typeof field.value);

              return (
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              );
            }}
          />

          <Label className="font-medium text-muted-foreground">
            Is Autopay
          </Label>
        </div>

        <div className="flex gap-2 items-center">
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
            options={["monthly", "yearly", "daily", "once"]}
          />
          <FormSelect
            control={control}
            label={{
              name: "Payment Method",
            }}
            name="default_payment"
            input={{
              placeholder: "Select Payment Method",
              props: { ...register?.("default_payment") },
            }}
            options={["cash", "gcash"]}
          />
        </div>

        <FormSelect
          control={control}
          label={{
            name: "Status",
          }}
          name="status"
          input={{
            placeholder: "Select Status",
            props: { ...register?.("status") },
          }}
          options={StatusOptions}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default function BillForm({
  register,
  control,
}: {
  register: any;
  control: any;
}) {
  const { references } = useReferenceProvider();
  if (!register) return null;
  return (
    <div className="p-4 flex h-screen flex-col">
      <h3 className="font-bold text-2xl">Bills</h3>
      <div className="mt-4 flex flex-col gap-2">
        <FieldGroup>
          <BasicInfo {...{ register, control, references }} />
          <FieldSeparator />

          <BillingDetails {...{ register }} />
          <FieldSeparator />

          <PaymentSettings {...{ register, control }} />
        </FieldGroup>
      </div>
    </div>
  );
}
