import useAuthCheck from "@/hooks/auth/useAuthCheck";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function GuestAuth() {
  const authCheck = useAuthCheck();
  const navigate = useNavigate();
  useEffect(() => {
    authCheck.checkAuthentication();
  }, [location.pathname]);

  if (authCheck.isAuthenticated) {
    navigate("/expense");
  }

  return <Outlet />;
}
