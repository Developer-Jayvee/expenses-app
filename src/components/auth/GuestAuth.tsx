import useAuthCheck from "@/hooks/auth/useAuthCheck";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

export default function GuestAuth() {
  const authCheck = useAuthCheck();
  useEffect(() => {
    authCheck.checkAuthentication();
  }, []);

  if (authCheck.isAuthenticated === null) {
    return null;
  }
  if (authCheck.isAuthenticated) {
    return <Navigate to="/expense" replace />;
  }

  return <Outlet />;
}
