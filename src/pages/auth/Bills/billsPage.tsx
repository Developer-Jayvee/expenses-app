import BillsProvider from "@c/context/BillsProvider";
import { Outlet } from "react-router";

export default function BillsPage() {
  return (
    <div className="w-full h-screen p-2">
      <div className="w-full h-full flex flex-col p-5">
        <div>
          <h1 className="text-3xl font-bold">Bills</h1>
          <p className="text-md small">Manage your recurring payments.</p>
        </div>
        <BillsProvider>
          <Outlet />
        </BillsProvider>
      </div>
    </div>
  );
}
