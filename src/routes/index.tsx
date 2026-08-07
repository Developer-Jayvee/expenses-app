import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Authenticated from "@c/components/auth/Authenticated";

const GuestAuth = lazy(() => import("@c/components/auth/GuestAuth"));

const LoginPage = lazy(() => import("@c/pages/Login/login"));

const BillsPage = lazy(() => import("@c/pages/auth/Bills/billsPage"));
const BillList = lazy(() => import("@c/pages/auth/Bills/list/billsList"));
const BillDetailsLayout = lazy(
  () => import("@c/pages/auth/Bills/details/billDetailLayout"),
);
const BillTransactions = lazy(
  () => import("@c/pages/auth/Bills/details/billTransactions"),
);

const Router = createBrowserRouter([
  {
    path: "/",
    element: <GuestAuth />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/expense",
    element: <Authenticated />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <></>,
      },
      {
        path: "bills",
        element: <BillsPage />,
        children: [
          {
            index: true,
            element: <BillList />,
          },
        ],
      },
      {
        path: "bills/:id",
        element: <BillDetailsLayout />,
        children: [
          // {
          //   index:true,
          //   element: <Navigate to="transaction" replace/>
          // },
          {
            path: "transactions",
            element: <BillTransactions />,
          },
        ],
      },
    ],
  },
]);

export default Router;
