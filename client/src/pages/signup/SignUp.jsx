import { validateSignUpSchema } from "@/utils/dataSchema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import { RiUser4Fill } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/auth";
import useMetaArgs from "@/hooks/useMeta";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/contextStore";


export default function SignUp() {

  useMetaArgs({
    title: "Register - Clinicare Hospital",
    description: "Create your Clinicare account to start managing your health easily",
    keywords: "Clinicare, register, account",
  });

  //   const [errorMsg, setErrorMsg] = useState(null);
  //   const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
  });
  
  const {setAccessToken} = useAuth();

  // mutations are for create, update or delete actions
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      //what you want to do if the api call is successful
       // console.log(response); once done with the response below remove the console.log(response)
      toast.success(response?.data?.message || "Registration successful");
      //we save accessToken with the below function 
      setAccessToken(response?.data?.data?.accessToken);

    },
    onError: (error) => {
      console.log(error);
      // toast.error(error?.response?.data?.message || "Registration failed"); 
      setError(error?.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data); //submitting our form to our mutation function to help us make the api call using our registerUser api
// our mutation func above takes care of our try and catch func below, so we can remove it totally
    // try {
    //   // Call your signup API here
    //   toast.success("Account created successfully!");
    // } catch (error) {
    //   const errorMessage = error?.message || "Signup not completed";
    //   toast.error(errorMessage);
    // }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-10 items-center">
      <div className="px-4 md:px-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white px-5 py-3 w-[360px] flex flex-col justify-center rounded-xl shadow-lg "
        >
          <img
            className="py-2 border rounded-full border-blue-500 h-10 w-10 mx-auto"
            src="../../user-4-fill.svg"
            alt="user-icon"
          />
          <h1 className="font-bold text-2xl text-center py-2">
            Create Account
          </h1>
          <p className="text-center text-[16px] md:text-[15px] text-zinc-600">
            Enter your details to sign up
          </p>

          {error && <ErrorAlert error={error} />} 
          {/* this above will display the error message if there's an error */}
          
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Full name</legend>
            <input
              {...register("fullname")}
              type="text"
              className="input"
              placeholder="Full Name"
            />
            {errors?.fullname?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.fullname?.message}
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
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
              className="absolute top-4 right-2 font-semibold"
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
          <div>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className={`bg-blue-500 w-full py-2 text-white text-[14px] rounded-sm my-6 ${
                isSubmitting || mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting || mutation.isPending ? "Registering account..." : "Register account"}
            </button>
          </div>
          <p className="text-center text-[13px] text-zinc-600 pt-2 md:pt-0">
            Already have an account?{" "}
            <Link className="text-blue-500 font-bold" to="/account/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
