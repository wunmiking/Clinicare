import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router";
import { validateForgotPasswordSchema } from "@/utils/dataSchema";
import { RiLockPasswordFill, RiUser4Fill } from "@remixicon/react";
import useMetaArgs from "@/hooks/useMeta";
import ErrorAlert from "@/components/ErrorAlert";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";


export default function ForgotPassword() {

  useMetaArgs({
    title: "Forgot password - Clinicare",
    description: "Forgot password to your Clinicare account",
    keywords: "Forgot password, hospital, health",
  });
  
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateForgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Password reset link sent");
     },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to send password link");
      
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data)
  }; 

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-20 items-center">
      <div className="px-4 md:px-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white px-5 py-3 flex flex-col justify-center rounded-xl shadow-lg max-w-[400px]"
        >
             <RiLockPasswordFill className=" text-4xl mx-auto text-blue-500 border rounded-full w-10 h-10 p-2"/>
          <h1 className="font-bold text-2xl text-center py-2">Forgot Password</h1>
          <p className="text-center text-[16px] text-zinc-600 mb-4">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        {error && <ErrorAlert error={error} />}
          <fieldset className="fieldset mt-4 max-w-[350px]">
            <legend className="fieldset-legend">Email</legend>
            <input
              {...register("email")}
              type="email"
              className="input w-full "
              placeholder="Email"
            />
            {errors?.email?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.email?.message}
              </p>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className={`bg-blue-500 max-w-[350px] py-2 text-white text-[14px] rounded-sm my-6 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting || mutation.isPending ? "Sending..." : "Send Reset Code"}
          </button>

          <p className="text-center text-[13px] text-zinc-600">
            Remembered your password?{" "}
            <Link to="/account/login" className="text-blue-500 font-bold">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}