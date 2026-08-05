import { useState } from "react";
import { authCheck } from "../api/auth/auth-api";

export default function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const checkAuthentication = async () => {
    try {
      const response = await authCheck();
      if (response) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };
  return {
    isAuthenticated,
    checkAuthentication,
  };
}
