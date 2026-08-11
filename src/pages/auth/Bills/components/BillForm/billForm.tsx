import { useReferenceProvider } from "@c/context/ReferenceProvider";
import { FieldGroup, FieldSeparator } from "@c/lib/shadcn/components/ui/field";
import PaymentSettings from "./paymentSettings";
import BillingDetails from "./billingDetails";
import BillBasicInfo from "./billBasicInfo";

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
          <BillBasicInfo {...{ register, control, references }} />
          <FieldSeparator />

          <BillingDetails {...{ register, control }} />
          <FieldSeparator />

          <PaymentSettings {...{ register, control }} />
        </FieldGroup>
      </div>
    </div>
  );
}
