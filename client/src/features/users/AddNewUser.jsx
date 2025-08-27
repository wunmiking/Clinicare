import { createUserAdmins } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddNewUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateSignUpSchema) });

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
const [success, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();
  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: createUserAdmins,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  const role = ["admin", "staff", "doctor", "nurse", "patient"];

 const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    setIsOpen(false);
    setShowSuccess(false);
  };

  const onSubmit = (data) => {
    mutation.mutate({ userData: data, accessToken });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white w-35 rounded-md cursor-pointer border border-gray-300"
        onClick={() => setIsOpen(true)}
      >
        Add User
      </button>
      <Modal
        id="addUserModal"
        isOpen={isOpen}
        className="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
              {error && <ErrorAlert error={error} />}
   { success ? ( 
      <> 
      {" "}
        <div className="p-4 text-center"> 
          <img src="/Success.svg" alt="success" className="w-full h-[200px]" />
          <h1 className="text-2xl font-bold">Congratulations!</h1>
          <p className="text-gray-600">{msg}</p>
          <button
            className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            size="lg"
            onClick={resetModal}
          >
            Add User
          </button>
        </div>
      </> ) 
            : (
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-2xl font-bold">Create User</h1>
          <p className=""></p>
          <form
            className="grid grid-cols-12 gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-12 md:col-span-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Full name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Full name"
                  {...register("fullname")}
                />
              </fieldset>
              {errors.fullname?.message && (
                <span className="text-xs text-red-500">
                  {errors.fullname?.message}
                </span>
              )}
            </div>

            <div className="col-span-12 md:col-span-6">
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
            <div className="col-span-12 md:col-span-6">
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
                  className="absolute font-semibold cursor-pointer top-1 left-66 md:left-43 inset-0"
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
            <div className="col-span-12 md:col-span-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Role</legend>
                <select
                  name="role"
                  id=""
                  defaultValue={"staff"}
                  className="select capitalize"
                  {...register("role")}
                  disabled={isSubmitting}
                >
                  <option value="">Select Role</option>
                  {role?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </fieldset>
              {errors.role?.message && (
                <span className="text-xs text-red-500">
                  {errors.role?.message}
                </span>
              )}
            </div>
            <div className="mt-4 mb-2 flex md:ml-38 md:justify-right gap-3">
              <button
                type="button"
                className="btn btn-outline w-[150px] border-[0.2px] border-gray-500"
                onClick={() => {setIsOpen(false); setError(null);}}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[150px]"
                disabled={isSubmitting}
                // onClick={onDelete}
              >
                {isSubmitting ? "Creating User..." : "Create User"}
                {/* {mutation.isPending ? "Creating User..." : "Create User"} */}
                {/* Add User */}
              </button>
            </div>
          </form>
        </div>
            )}
      </Modal>
    </>
  );
}