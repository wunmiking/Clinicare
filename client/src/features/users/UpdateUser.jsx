import { updateUserRole } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { validateUpdateUserRoleSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateUser({ isOpen, onClose, item }) {
  const [error, setError] = useState(null);
  const [success, showSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateUpdateUserRoleSchema) });

  const role = ["admin", "staff", "doctor", "nurse", "patient"];

  useEffect(() => {
    if (item) {
      setValue("role", item.role);
    }
  }, [item, setValue]);

  const mutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (response) => {
      if (response.success) {
        setMsg(response?.message);
        showSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  const onSubmit = async (role) => {
    mutation.mutate({ userId: item._id, role, accessToken });
  };

  const handleClose = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    onClose(false);
    showSuccess(false);
  };

  return (
    <Modal
      id="updateUserModal"
      isOpen={isOpen}
      onClose={onClose}
      title="Update user data"
      classname="bg-white p-6 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      showClose={true}
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
            onClick={handleClose}
          >
            Continue to Users
          </button>
        </div>
      </> ) 
            : (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4 mt-4"
      >
        {/* <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            className="input w-full bg-gray-100"
            {...register("fullname")}
            defaultValue={item.fullname}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="input w-full bg-gray-100"
            {...register("email")}
            defaultValue={item.email}
          />
        </div> */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-1 font-semibold">Role</label>
          <select
          id=""
          name="role"
            className="select capitalize w-full"
            {...register("role")}
            defaultValue={""}
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            {role.map((option, index) => (
              <option key={index} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.role?.message && (
            <span className="text-xs text-red-500">{errors.role?.message}</span>
          )}
        </div>
        <div className="col-span-12 flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
            )}
    </Modal>
  );
}
