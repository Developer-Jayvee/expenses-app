import AuthProvider from "@c/context/providers/AuthProvider";
import BillsProvider from "@c/context/providers/BillsProvider";
import ChecklistProvider from "@c/context/providers/ChecklistProvider";
import ConfirmModalProvider from "@c/context/providers/ConfirmModalProvider";
import { ModalProvider } from "@c/context/providers/ModalProvider";
import { ReferenceContextProvider } from "@c/context/providers/ReferenceProvider";
import ToastProvider from "@c/context/providers/ToastProvider";
import LoadingScreen from "@c/components/LoadingScreen";
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
    return <LoadingScreen />;
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
              <ChecklistProvider>
                <ModalProvider>
                  <ReferenceContextProvider>
                    <Outlet />
                  </ReferenceContextProvider>
                </ModalProvider>
              </ChecklistProvider>
            </BillsProvider>
          </AuthProvider>
        </AuthLayout>
      </ConfirmModalProvider>
    </ToastProvider>
  );
}
