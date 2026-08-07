import { MdOutlineArrowBack } from "react-icons/md";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import BillDetailHeaders from "./billDetaillHeaders";
import BillDetailSummary from "./billDetailSummary";
import { LiaWalletSolid } from "react-icons/lia";
import { CiEdit, CiPause1, CiTrash } from "react-icons/ci";
import { useBillDetail } from "@c/context/BillDetailsProvider";
import { useEffect } from "react";
// import { useBillDetail } from "@c/context/BillDetailsProvider";
export interface DynamicDetailsI {
  children: React.ReactNode;
  type: string;
  value: string;
}
export type PillColor = "primary" | "danger" | "warning";
export interface KPICardI extends DynamicDetailsI {
  description: string;
  iconColor?: PillColor;
}

export default function BillDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const { details, getCallback } = useBillDetail();

  useEffect(() => {
    if (id !== null && id !== undefined) {
      getCallback(id);
    }
  }, [location.pathname]);

  if (details === null) return null;

  return (
    <div className="p-5">
      <div className="flex">
        {/* Button header */}
        <div className="">
          <button
            className="font-normal! flex gap-2 items-center cursor-pointer"
            onClick={() => navigate("/expense/bills", { replace: true })}
          >
            <MdOutlineArrowBack size={20} />
            Back to bills
          </button>
        </div>
      </div>
      {/* Main header */}
      <BillDetailHeaders />
      {/* ACTIONS */}
      <div className="mt-5">
        <div className="btn-group">
          <button className="primary btn-flex">
            <LiaWalletSolid size={20} />
            Pay Now
          </button>
          <button className="ghost-primary btn-flex">
            <CiEdit size={20} />
            Edit Bill
          </button>
          <button className="ghost-primary btn-flex">
            <CiPause1 size={20} />
            Pause
          </button>
          <button className="ghost-danger btn-flex">
            <CiTrash size={20} />
            Delete
          </button>
        </div>
      </div>
      {/* KPI */}
      <BillDetailSummary />
      {/* TABS */}
      <div className="mt-5">
        <ul className="flex gap-4 border-0 border-b pb-4">
          <li>
            <NavLink
              to="transactions"
              className={({ isActive }) =>
                `text-lg py-3 pb-4 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Transactions
            </NavLink>
          </li>
        </ul>
      </div>
      {/* ACTIVITIES */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
