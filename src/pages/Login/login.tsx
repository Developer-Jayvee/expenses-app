import useAuthHook from "@c/hooks/useAuthHook";
import InputField from "./components/InputField";
import type { PostLogin } from "@c/types/login-types";

interface FormParamsInterface {
  register: any;
  handleSubmit: any;
  onSubmit: (data: PostLogin) => void;
}

const LoginHeader = () => {
  return (
    <div className="mt-20">
      <h2 className="default font-bold text-2xl ">Welcome back</h2>
      <p className="text-md small">Log in to manage your bills</p>
    </div>
  );
};
const LoginFooter = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center text-sm ">
        <input type="checkbox" />
        <label className="">Remember me</label>
      </div>
      <div>
        <button className="login w-full rounded-lg text-white font-bold">
          Log in
        </button>
      </div>
      <div className="text-center">
        <small className="small">Don't have an account? </small>
        <small className="text-blue-700! font-bold">Sign up</small>
      </div>
    </div>
  );
};
const LoginBody = ({ register }: Pick<FormParamsInterface, "register">) => {
  return (
    <>
      <div>
        <InputField
          label={{
            title: "Email",
          }}
          input={{
            placeholder: "you@example.com",
            type: "text",
          }}
          props={{ ...register("email") }}
        />
      </div>
      <div>
        <InputField
          label={{
            title: "Password",
          }}
          input={{
            placeholder: "*******",
            type: "password",
          }}
          props={{ ...register("password") }}
        />
      </div>
    </>
  );
};
const LoginForm = ({
  register,
  handleSubmit,
  onSubmit,
}: FormParamsInterface) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <LoginHeader />
        <LoginBody register={register} />
        <LoginFooter />
      </div>
    </form>
  );
};
export default function LoginPage() {
  const { register, handleSubmit, onSubmit } = useAuthHook();
  return (
    <div className="w-full h-screen  flex justify-center items-center">
      <div className="bg-white w-120 max-w-200 h-auto rounded-2xl p-4 px-10 font-inter shadow-md">
        <LoginForm {...{ register, handleSubmit, onSubmit }} />
      </div>
    </div>
  );
}
