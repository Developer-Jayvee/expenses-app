import { registerSchema, type PostRegister } from "@c/types/register-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { getCookies, registerAPI } from "@/hooks/api/auth/auth-api";
import { ModalContextService } from "@c/context/ModalContext";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import type { ErrorResponseI } from "@c/types/globalTypes";

export default function useRegisterHook() {
  const navigate = useNavigate();
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const [pendingData, setPendingData] = useState<PostRegister | null>(null);
  const [errorList, setErrorList] = useState<ErrorResponseI>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostRegister>({
    resolver: zodResolver(registerSchema),
  });

  const doRegister = async (data: PostRegister) => {
    setIsSubmitting(true);
    setErrorList(null);
    try {
      await getCookies();
      await registerAPI(data);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (error) {
      setErrorList(extractRawHttpError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<PostRegister> = (data) => {
    setPendingData(data);
    onOpen();
    confirmModalConfig({
      title: "Create your account?",
      description: `We'll create an account for ${data.email}.`,
    });
  };

  useEffect(() => {
    if (pendingData) handleConfirm(() => doRegister(pendingData));
  }, [pendingData]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    errorList,
    isSubmitting,
  };
}
