import { BillContextProvider } from "@c/context/BillDetailsProvider";
import BillDetails from "./billDetails";

export default function BillDetailLayout() {
  return (
    <BillContextProvider>
      <BillDetails />
    </BillContextProvider>
  );
}
