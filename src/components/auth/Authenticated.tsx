import AuthProvider from "@c/context/providers/AuthProvider";
import BillsProvider from "@c/context/providers/BillsProvider";
import ConfirmModalProvider from "@c/context/providers/ConfirmModalProvider";
import { ModalProvider } from "@c/context/providers/ModalProvider";
import { ReferenceContextProvider } from "@c/context/providers/ReferenceProvider";
import ToastProvider from "@c/context/providers/ToastProvider";
import useAuthCheck from "@c/hooks/auth/useAuthCheck";
import AuthLayout from "@c/pages/auth/layout";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

export default function Authenticated() {
  const authCheck = useAuthCheck();

  useEffect(() => {
    authCheck.checkAuthentication();
  }, []);

  if (authCheck.isAuthenticated === null) {
    return null;
  }
  if (!authCheck.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <ConfirmModalProvider>
        <AuthLayout>
          <AuthProvider>
            <BillsProvider>
              <ModalProvider>
                <ReferenceContextProvider>
                  <Outlet />
                </ReferenceContextProvider>
              </ModalProvider>
            </BillsProvider>
          </AuthProvider>
        </AuthLayout>
      </ConfirmModalProvider>
    </ToastProvider>
  );
}
