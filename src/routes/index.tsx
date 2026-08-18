import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Authenticated from "@c/components/auth/Authenticated";

const GuestAuth = lazy(() => import("@c/components/auth/GuestAuth"));

const LoginPage = lazy(() => import("@c/pages/Login/login"));

const DashboardPage = lazy(
  () => import("@c/pages/auth/Dashboard/dashboardPage"),
);

const BillsPage = lazy(() => import("@c/pages/auth/Bills/billsPage"));
const BillList = lazy(() => import("@c/pages/auth/Bills/list/billsList"));
const BillDetailsLayout = lazy(
  () => import("@c/pages/auth/Bills/details/billDetailLayout"),
);
const BillTransactions = lazy(
  () => import("@c/pages/auth/Bills/details/billTransactions"),
);
const BillActivity = lazy(
  () => import("@c/pages/auth/Bills/details/billActivity"),
);

const DailyExpensesPage = lazy(
  () => import("@c/pages/auth/DailyExpenses/dailyExpensesPage"),
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
        element: <DashboardPage />,
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
          {
            index: true,
            element: <Navigate to="transactions" replace />,
          },
          {
            path: "transactions",
            element: <BillTransactions />,
          },
          {
            path: "activities",
            element: <BillActivity />,
          },
        ],
      },
      {
        path: "daily-expenses",
        element: <DailyExpensesPage />,
      },
    ],
  },
]);

export default Router;
