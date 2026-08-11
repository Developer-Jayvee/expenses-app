import FormSelect from "@c/components/FormSelect";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@c/lib/shadcn/components/ui/field";
import { Label } from "@c/lib/shadcn/components/ui/label";
import { Switch } from "@c/lib/shadcn/components/ui/switch";
import { PaymentOptions, StatusOptions } from "@c/data/options";

import { Controller } from "react-hook-form";
export default function PaymentSettings({
  register,
  control,
}: {
  register: any;
  control: any;
}) {
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
          options={PaymentOptions}
        />

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
}
