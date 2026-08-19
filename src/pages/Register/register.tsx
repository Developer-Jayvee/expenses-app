import { Link } from "react-router";
import useRegisterHook from "@c/hooks/useRegisterHook";
import AuthInputField from "@c/components/AuthInputField";
import AuthSplitLayout from "@c/components/layouts/AuthSplitLayout";
import { DestructiveAlert } from "@c/components/alerts/DestructiveAlert";
import { Button } from "@c/lib/shadcn/components/ui/button";
import ConfirmModalProvider from "@c/context/providers/ConfirmModalProvider";

function RegisterForm() {
  const { register, handleSubmit, onSubmit, errors, errorList, isSubmitting } =
    useRegisterHook();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="default text-2xl font-bold">Create an account</h1>
          <p className="text-md small">
            Start tracking your bills and budgets in minutes.
          </p>
        </div>

        {errorList && (
          <DestructiveAlert
            title={errorList?.message}
            description={errorList?.data}
          />
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <AuthInputField
              label="First name"
              type="text"
              placeholder="Jane"
              error={errors.first_name?.message}
              props={{ ...register("first_name") }}
            />
            <AuthInputField
              label="Last name"
              type="text"
              placeholder="Doe"
              error={errors.last_name?.message}
              props={{ ...register("last_name") }}
            />
          </div>
          <AuthInputField
            label="Email"
            type="text"
            placeholder="you@example.com"
            error={errors.email?.message}
            props={{ ...register("email") }}
          />
          <AuthInputField
            label="Invitation Code"
            type="text"
            placeholder="e.g. ASD23"
            error={errors.invitation_code?.message}
            props={{ ...register("invitation_code") }}
          />
          <AuthInputField
            label="Password"
            type="password"
            placeholder="********"
            error={errors.password?.message}
            props={{ ...register("password") }}
          />
          <AuthInputField
            label="Confirm password"
            type="password"
            placeholder="********"
            error={errors.password_confirmation?.message}
            props={{ ...register("password_confirmation") }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-lg font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center">
            <small className="small">Already have an account? </small>
            <Link to="/login" className="text-blue-700! font-bold text-sm">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <ConfirmModalProvider>
        <RegisterForm />
      </ConfirmModalProvider>
    </AuthSplitLayout>
  );
}
