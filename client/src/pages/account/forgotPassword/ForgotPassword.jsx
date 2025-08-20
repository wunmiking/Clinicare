import { forgotPassword } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import useMetaArgs from "@/hooks/useMeta";
import { forgotPasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLockFill } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword() {
  useMetaArgs({
    title: "forget password -clincare",
    description: "Recover your clincare account password",
    keyword: "clincare, password-reset, account",
  });

  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      //what you want to do if api call is a success.
      // console.log(response);
      toast.success(response?.data?.message || "Password reset link sent");
    },
    onError: (error) => {
      console.log(error);
      setError(
        error?.response?.data?.message || "Failed to send password link"
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-17 items-center ">
      <div className="px-4 md:px-0">
        <form
          className="bg-white px-5 py-3 md:px-6 flex flex-col justify-center rounded-xl shadow-lg max-w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <RiLockFill
            className="mx-auto my-2 border rounded-full p-2 border-blue-500 text-blue-500 shadow-lg"
            size={40}
          />
          <h1 className="font-bold text-2xl text-center py-2">
            Forgot Password
          </h1>
          <p className="text-center text-[16px] text-zinc-600">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
          {error && <ErrorAlert error={error} />}
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input w-[327px] md:w-[350px]"
                placeholder="Email"
                {...register("email")}
              />
            </fieldset>
            {errors.email?.message && (
              <span className="text-xs text-red-500">
                {errors.email?.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 w-full py-2 text-white text-[14px] font-bold rounded-sm my-2"
          >
            {isSubmitting || mutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
