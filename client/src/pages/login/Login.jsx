import React, { useState } from "react";
import { Link } from "react-router";
import { RiUser4Fill } from "@remixicon/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { validateSignInSchema } from "@/utils/dataSchema";
import { loginUser } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/contextStore";
import { useMutation } from "@tanstack/react-query";
import useMetaArgs from "@/hooks/useMeta";
// import { success } from "zod";


export default function Login() {

    useMetaArgs({
    title: "Login - Clinicare Hospital",
    description: "Login to your Clinicare account to access your medical details",
    keywords: "Clinicare, login, sign in, account",
  });

    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState(null);
    const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignInSchema),
  });

  const {setAccessToken} = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      // what you want to do if the api call is successful
      // console.log(response); once done with the response below remove the console.log(response)
      toast.success(response?.data?.message || "Login Successful");
      //we save accessToken with the below function
      setAccessToken(response?.data?.data?.accessToken);
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Login failed");
      
    },
  });
  // Not sure why I added the below but commented it to work on the new function
  // const { setAccessToken } = useAuth();

  const onSubmit = async (data) => {
    mutation.mutate(data); //submitting our form to our mutation function to help us make the api call using our login api

  };


    return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-20 items-center">
        <div className="px-4 md:px-0">
           
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-5 py-3 flex flex-col justify-center rounded-xl shadow-lg w-[360px]">

                <RiUser4Fill className=" text-4xl mx-auto text-blue-500 border rounded-full w-10 h-10 p-2"/>

          <h1 className="font-bold text-2xl text-center py-2">Welcome Back</h1>
          <p className="text-center text-[16px] md:text-[15px] text-zinc-600">Glad to see you again. Log in to your account.</p>
          {error && <ErrorAlert error={error}/>}
          <fieldset className="fieldset">
            <input
              {...register("email")}
              type="email"
              className="input"
              placeholder="Email"
            />
            {errors?.email?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.email?.message}
              </p>
            )}

        </fieldset>
          <fieldset className="fieldset relative">
            <legend className="fieldset-legend">Password</legend>
            <input
                {...register("password")}
              type={isVisible ? "text" : "password"}
              className="input"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute top-4 right-2 font-semibold text-sm text-black-500"
              onClick={() => setIsVisible((prev) => !prev)}
            >
              {isVisible ? "Hide" : "Show"}
            </button>
            {errors?.password?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.password?.message}
              </p>
            )}
          </fieldset>
          <div className="text-left mt-2">
            <Link to="/account/forgot-password" className="text-blue-500 text-[14px] font-bold">Forgot Password?</Link>
          </div>
          
          <div>
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className={`bg-blue-500 w-full py-2 text-white text-[14px] rounded-sm my-6 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting || mutation.isPending ? "Signing In..." : "Sign In"}
          </button>

          </div>
          <p className="text-center text-[13px] text-zinc-600 pt-2 md:pt-0">Don't have an account? <Link className="text-blue-500 font-bold" to="/account/signup">Sign Up</Link></p>
          </form>
          </div>
        </div>
  );
}
