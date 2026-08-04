import LoginService from "@c/services/loginService";
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
  const auth = LoginService({ user: null });

  const userInfo = auth.getUserDetails();

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
