import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { RiUser4Fill } from "@remixicon/react";
import { useForm } from "react-hook-form";
import { validateSignInSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import { loginUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store";

export default function SignIn() {
  useMetaArgs({
    title: "Login - Clinicare",
    description: "Login Your Clinicare account",
    keywords: "Clinicare, User-account, login, account",
  });

  const [isVisible, setIsVisible] = useState(false);

  const [error, setError] = useState(null);

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const { setAccessToken, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validateSignInSchema) });

  // const queryClient = useQueryClient(); //initializing query client  from tanstack
  //mutation are for create, update or delete actions
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      // what yo want to do if api call is a success
      // console.log(response);
      toast.success(response?.data?.message || "Login successful");
      setAccessToken(response?.data?.data?.accessToken);
      if (!user?.isVerified) {
        navigate("/verify-account");
      }
    },
    //save accessToken
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Login failed");
    },
  });
  const onSubmit = async (data) => {
    mutation.mutate(data); //submitting our form to our mutatation function to help us make api call using our registerUser api
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-20 items-center">
      <div className="px-4 md:px-0">
        <form
          className="bg-white px-5 py-3 md:p flex flex-col justify-center rounded-xl shadow-lg max-w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <RiUser4Fill
            className="mx-auto my-2 border rounded-full p-2 border-blue-500 text-blue-500 shadow-lg"
            size={40}
          />
          <h1 className="font-bold text-2xl text-center py-2">Welcome Back</h1>
          <p className="text-center text-[16px] md:text-[15px] text-zinc-600">
            Glad to see you again. Log in to your account.
          </p>
          {error && <ErrorAlert error={error} />}
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input"
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
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Password</legend>
              <input
                type={isVisible ? "text" : "password"}
                className="input"
                placeholder="Password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute font-semibold cursor-pointer top-1 left-66 inset-0"
                onClick={togglePassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.password?.message && (
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            )}
          </div>
          <Link
            to="/account/forget-password"
            className="text-blue-500 text-[14px] font-bold"
          >
            Forgot Password?
          </Link>
          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 w-full py-2 text-white text-[14px] font-bold rounded-sm my-4"
            >
              {mutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <p className="text-center text-[13px] text-zinc-600 pt-2 md:pt-0">
            Don't have an account?{" "}
            <Link className="text-blue-500 font-bold" to="/account/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
