import { loginSchema, type PostLogin } from "@c/types/login-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getCookies, loginAPI, logoutAPI } from "@/hooks/api/auth/auth-api";
import AuthService from "@c/services/AuthService";
import type { ErrorResponseI } from "@c/types/globalTypes";
import { extractRawHttpError } from "@c/utils/axios-error.util";

export default function useAuthHook() {
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<PostLogin> = async ({
    email,
    password,
  }: PostLogin) => {
    setIsSubmitting(true);
    setErrorList(null);
    try {
      await getCookies();
      await loginAPI({ email, password });
      setIsRedirecting(true);
      window.location.reload();
    } catch (error) {
      setErrorList(extractRawHttpError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  const onLogout = async () => {
    setIsRedirecting(true);
    try {
      await logoutAPI().then(() => {
        window.location.reload();
        AuthService.logoutUser();
      });
    } catch (error) {
      setIsRedirecting(false);
      console.warn("Error found in: ", error);
    }
  };
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    errorList,
    isSubmitting,
    isRedirecting,
    onLogout,
  };
}
