import AuthProvider from "@c/context/AuthProvider";
import ConfirmModalProvider from "@c/context/ConfirmModalProvider";
import { ModalProvider } from "@c/context/ModalProvider";
import { ReferenceContextProvider } from "@c/context/ReferenceProvider";
import useAuthCheck from "@c/hooks/auth/useAuthCheck";
import AuthLayout from "@c/pages/auth/layout";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

export default function Authenticated() {
  const authCheck = useAuthCheck();
  const location = useLocation();

  useEffect(() => {
    authCheck.checkAuthentication();
  }, [location.pathname]);

  if (authCheck.isAuthenticated === null) {
    return null;
  }
  if (!authCheck.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ConfirmModalProvider>
      <AuthLayout>
        <AuthProvider>
          <ModalProvider>
            <ReferenceContextProvider>
              <Outlet />
            </ReferenceContextProvider>
          </ModalProvider>
        </AuthProvider>
      </AuthLayout>
    </ConfirmModalProvider>
  );
}
