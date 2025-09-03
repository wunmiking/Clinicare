import useMetaArgs from "@/hooks/useMeta";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { validatePatientSchema } from "@/utils/dataSchema";
import { useAuth } from "@/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { bloodGroup, formatDate } from "@/utils/constants";
import { LazyLoader } from "@/components/LazyLoader";
import { getPatient, updatePatient } from "@/api/patients";


export default function HealthRecord() {
  useMetaArgs({
    title: "Health Record Settings - Clinicare",
    description: "Manage your health record information in Clinicare.",
    keywords: "Clinicare, health record, settings",
  });
  const { err, setError } = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuth();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["patient", accessToken],
    queryFn: () => getPatient(accessToken),
  });

  const patientData = data?.data?.data;
  
  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
    if (patientData) {
      setValue("gender", patientData?.gender || "");
      setValue("bloodGroup", patientData?.bloodGroup || "");
      setValue("address", patientData?.address || "");
      setValue("emergencyContact", patientData?.emergencyContact || "");
      setValue(
        "emergencyContactPhone",
        patientData?.emergencyContactPhone || ""
      );
      setValue(
        "emergencyContactRelationship",
        patientData?.emergencyContactRelationship || ""
      );
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });

  const mutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data?.message);
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating your profile");
    },
  });

  const gender = ["male", "female", "other"];
const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
  name: key,
  id: value,
})); 

  const onSubmit = async (formData) => {
    mutation.mutate({ patientId: patientData._id, formData, accessToken });
  };

  if (isPending) {
    return <LazyLoader />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center  pt-0 items-center">
      <div className="px-4 md:px-0 w-full">
        <h1 className="font-bold text-2xl pb-2 border-b border-gray-300">
          Health Record
        </h1>
        <div className="max-w-[600px] mx-auto">
          <form
            className="bg-white px-5 py-3 md:flex flex-col justify-center rounded-xl shadow-sm items-center"
            onSubmit={handleSubmit(onSubmit)}
            id="/dashboard/settings/health"
          >
            {isError ||
              (err && (
                <ErrorAlert error={error?.response?.data?.message || err} />
              ))}

            {/* {error && <ErrorAlert error={error} />} */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Full name</legend>
                  <input
                    type="text"
                    id="fullname"
                    className="input w-full"
                    placeholder="Full name"
                    {...register("fullname")}
                  />
                </fieldset>
                {errors.fullname?.message && (
                  <span className="text-xs text-red-500">
                    {errors.fullname.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="email"
                    id="email"
                    className="input w-full"
                    placeholder="Email"
                    {...register("email")}
                  />
                </fieldset>
                {errors.email?.message && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone</legend>
                  <input
                    type="tel"
                    id="phone"
                    className="input w-full"
                    placeholder="Phone"
                    {...register("phone")}
                  />
                </fieldset>
                {errors.phone?.message && (
                  <span className="text-xs text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Date of birth</legend>
                  <input
                    type="date"
                    id="dateOfBirth"
                    className="input w-full"
                    placeholder="dd/mm/yyyy"
                    {...register("dateOfBirth")}
                  />
                </fieldset>
                {errors.dateOfBirth?.message && (
                  <span className="text-xs text-red-500">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender</legend>
                  <select
                  id="gender"
                    className="select capitalize cursor-pointer w-full"
                    {...register("gender")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Gender</option>
                    {gender.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.gender?.message && (
                  <span className="text-xs text-red-500">
                    {errors.gender.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Blood group</legend>
                  <select
                  id="bloodGroup"
                    {...register("bloodGroup")}
                    className="select capitalize w-full"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroupOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.bloodGroup?.message && (
                  <span className="text-xs text-red-500">
                    {errors.bloodGroup.message}
                  </span>
                )}
              </div>
              <div className="col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Address</legend>
                  <input
                    type="text"
                    id="address"
                    className="input w-full"
                    placeholder="Address"
                    {...register("address")}
                  />
                </fieldset>
                {errors.address?.message && (
                  <span className="text-xs text-red-500">
                    {errors.address.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Emergency contact</legend>
                  <input
                    type="text"
                    id="emergencyContact"
                    className="input text-xs w-full"
                    placeholder="Emergency contact"
                    {...register("emergencyContact")}
                  />
                </fieldset>
                {errors.emergencyContact?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContact.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Emergency contact phone
                  </legend>
                  <input
                    type="text"
                    id="emergencyContactPhone"
                    className="input text-xs w-full"
                    placeholder="Emergency contact phone"
                    {...register("emergencyContactPhone")}
                  />
                </fieldset>
                {errors.emergencyContactPhone?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContactPhone.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Emergency contact relationship
                  </legend>
                  <input
                    type="text"
                    className="input text-xs w-full"
                    placeholder="Emergency contact relationship"
                    {...register("emergencyContactRelationship")}
                  />
                </fieldset>
                {errors.emergencyContactRelationship?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContactRelationship.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-10 pt-6 justify-end md:hidden">
              <button
                type="button"
                className="btn btn-outline w-[140px] border border-gray-300"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
                disabled={isSubmitting || mutation.isPending}
              >
                {isSubmitting || mutation.isPending ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
