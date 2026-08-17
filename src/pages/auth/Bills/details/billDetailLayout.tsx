import { BillContextProvider } from "@c/context/providers/BillDetailsProvider";
import BillDetails from "./billDetails";

export default function BillDetailLayout() {
  return (
    <BillContextProvider>
      <BillDetails />
    </BillContextProvider>
  );
}
