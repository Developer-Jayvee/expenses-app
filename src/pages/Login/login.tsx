import { Link, useLocation } from "react-router";
import useAuthHook from "@c/hooks/useAuthHook";
import AuthInputField from "@c/components/AuthInputField";
import AuthSplitLayout from "@c/components/layouts/AuthSplitLayout";
import LoadingScreen from "@c/components/LoadingScreen";
import { DestructiveAlert } from "@c/components/alerts/DestructiveAlert";
import { Alert, AlertDescription } from "@c/lib/shadcn/components/ui/alert";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import type { PostLogin } from "@c/types/login-types";
import type { ErrorResponseI } from "@c/types/globalTypes";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

interface FormParamsInterface {
  register: UseFormRegister<PostLogin>;
  handleSubmit: UseFormHandleSubmit<PostLogin>;
  onSubmit: (data: PostLogin) => void;
  errors: FieldErrors<PostLogin>;
  errorList: ErrorResponseI;
  isSubmitting: boolean;
}

const LoginHeader = () => {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="default text-2xl font-bold">Log in</h1>
      <p className="text-md small">Log in to manage your bills</p>
    </div>
  );
};

const LoginFooter = ({
  isSubmitting,
}: Pick<FormParamsInterface, "isSubmitting">) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="submit"
        variant="primary"
        className="w-full rounded-lg font-bold"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>
      <div className="text-center">
        <small className="small">Don't have an account? </small>
        <Link to="/register" className="text-blue-700! font-bold text-sm">
          Sign up
        </Link>
      </div>
    </div>
  );
};
const LoginBody = ({
  register,
  errors,
}: Pick<FormParamsInterface, "register" | "errors">) => {
  return (
    <div className="flex flex-col gap-4">
      <AuthInputField
        label="Email"
        type="text"
        placeholder="you@example.com"
        error={errors.email?.message}
        props={{ ...register("email") }}
      />
      <AuthInputField
        label="Password"
        type="password"
        placeholder="********"
        error={errors.password?.message}
        props={{ ...register("password") }}
      />
    </div>
  );
};
const LoginForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  errorList,
  isSubmitting,
}: FormParamsInterface) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <LoginHeader />
        {errorList && (
          <DestructiveAlert
            title={errorList?.message}
            description={errorList?.data}
          />
        )}
        <LoginBody register={register} errors={errors} />
        <LoginFooter isSubmitting={isSubmitting} />
      </div>
    </form>
  );
};
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    errorList,
    isSubmitting,
    isRedirecting,
  } = useAuthHook();
  const location = useLocation();
  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  );

  if (isRedirecting) {
    return <LoadingScreen message="Signing you in..." />;
  }

  return (
    <AuthSplitLayout>
      <div className="flex flex-col gap-6">
        {justRegistered && (
          <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50">
            <CheckCircle2Icon />
            <AlertDescription>
              Account created. You can now log in.
            </AlertDescription>
          </Alert>
        )}
        <LoginForm
          {...{
            register,
            handleSubmit,
            onSubmit,
            errors,
            errorList,
            isSubmitting,
          }}
        />
      </div>
    </AuthSplitLayout>
  );
}
