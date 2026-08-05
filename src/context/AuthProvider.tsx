import AuthService from "@c/services/AuthService";
import type { UserInterface } from "@c/types/login-types";
import { createContext } from "react";

interface AuthContextI {
  user: UserInterface | null;
}

export const AuthContext = createContext<AuthContextI>({
  user: null,
});
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const userInfo = AuthService.getUserData();

  return (
    <AuthContext.Provider
      value={{
        user: userInfo,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
}
