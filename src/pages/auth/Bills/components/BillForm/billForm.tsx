import { FieldGroup, FieldSeparator } from "@c/lib/shadcn/components/ui/field";
import PaymentSettings from "./paymentSettings";
import BillingDetails from "./billingDetails";
import BillBasicInfo from "./billBasicInfo";
import { useBillContext } from "@c/context/providers/BillsProvider";
import { DestructiveAlert } from "@c/components/alerts/DestructiveAlert";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { useModal } from "@c/context/providers/ModalProvider";

export default function BillForm() {
  const { errorList } = useBillContext();
  const { onClose } = useModal();
  return (
    <div className="p-4 flex h-screen flex-col">
      <h3 className="font-bold text-2xl">
        <div className="mt-4">
          {errorList && (
            <DestructiveAlert
              title={errorList?.message}
              description={errorList?.data}
            />
          )}
        </div>
      </h3>
      <div className=" flex flex-col gap-2">
        <FieldGroup>
          <BillBasicInfo />
          <FieldSeparator />

          <BillingDetails />
          <FieldSeparator />
          <PaymentSettings />
          <div className="grid grid-cols-[auto_auto] place-content-end gap-2 mt-1">
            <Button onClick={() => onClose()} variant="outline">
              Close
            </Button>
            <Button className="px-6!" variant="primary" type="submit">
              {" "}
              Submit
            </Button>
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}
