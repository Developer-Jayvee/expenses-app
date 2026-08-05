import { loginSchema, type PostLogin } from "@c/types/login-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getCookies, loginAPI, logoutAPI } from "@/hooks/api/auth/auth-api";
import AuthService from "@c/services/AuthService";

export default function useAuthHook() {
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
    try {
      await getCookies()
      .then(async () => {
        await loginAPI({ email, password })
        .then(() =>{
          window.location.reload();
        });
      })
    } catch (error) {
      console.warn("Error found in: ", error);
    }
  };
  const onLogout = async () => {
    try {
      await logoutAPI()
      .then(() => {
        window.location.reload();
        AuthService.logoutUser();
      })
    } catch (error) {
      console.warn('Error found in: ',error);
    } 
  }
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    onLogout
  };
}
