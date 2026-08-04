import { loginSchema, type PostLogin } from "@c/types/login-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getCookies, loginAPI } from "@/hooks/api/auth/login-api";
import { useNavigate } from "react-router";

export default function useLoginHook() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<PostLogin> = async ({
    email,
    password,
  }: PostLogin) => {
    try {
      await getCookies();
      await loginAPI({ email, password }).then(() => navigate("/expense"));
    } catch (error) {
      console.warn("Error found in: ", error);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
}
