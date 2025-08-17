import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { validateResetPasswordSchema } from "@/utils/dataSchema";
import { resetPassword } from "@/api/auth";
import { RiLockPasswordFill } from "@remixicon/react";
import ErrorAlert from "@/components/ErrorAlert";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useMetaArgs from "@/hooks/useMeta";


export default function ResetPassword() {

  useMetaArgs({
    title: "Reset Password - Clinicare",
    description: "Reset Your Clinicare account password",
    keywords: "Clinicare, reset-password-account, acc-reset, account",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // look for values on our url bar
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateResetPasswordSchema),
  });



  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      navigate("/account/login");
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message);
    },
  });

   const onSubmit = async (data) => {
    const userData = { ...data, email, token };
    mutation.mutate(userData);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-20 items-center">
      <div className="px-4 md:px-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 flex flex-col justify-center rounded-xl shadow max-w-md"
      >
        <RiLockPasswordFill className="text-4xl mx-auto text-blue-500 border border-blue-500 rounded-full w-10 h-10 p-2" />
        
        <h2 className="text-2xl font-bold text-center mb-4">
          Confirm New Password
        </h2>
        <p className="text-center">
          Please enter a new password. Your password must be different from your previous password.
        </p>
        {error && <ErrorAlert error={error} />}
       
       <div>
         <fieldset className="fieldset relative">
        <label className="block font-medium mb-1">
          New Password
        </label>
        <input
          {...register("password")}
          type={isVisible ? "text" : "password"}
          id="password"
          className="input input-bordered w-full mb-2"
          placeholder="password"
        />

        <button
  type="button"
  onClick={() => setIsVisible((prev) => !prev)}
  className="absolute right-3 top-11 text-sm font-bold text-blue-500"
>
  {isVisible ? "Hide" : "Show"}
</button>

        </fieldset>
        {errors.password?.message && (
          <p className="text-red-500 text-sm mb-4">{errors.password?.message}</p>
        )}
        </div>
        <div>
<fieldset className="fieldset relative">
        <label className="block font-medium mb-1">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          className="input input-bordered w-full mb-2"
          placeholder="password"
        />

        {/* <button
  type="button"
  onClick={() => setIsVisible((prev) => !prev)}
  className="absolute right-3 top-11 text-sm font-bold text-blue-500"
>
  {isVisible ? "Hide" : "Show"}
</button> */}

        </fieldset>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-4">
            {errors.confirmPassword.message}
          </p>
        )}
</div>
<div>
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="btn bg-blue-500 hover:bg-blue-600 w-full py-2 text-white text-[14px] font-bold rounded-sm my-6"
        >
          {isSubmitting || mutation.isPending
            ? "Resetting..."
            : "Reset Password"}
        </button>
        </div>
      </form>
      </div>
    </div>
  );
}
