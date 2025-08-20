import useMetaArgs from "@/hooks/useMeta";
import { bloodGroup, formatDate } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { validatePatientSchema } from "../../utils/dataSchema";
import { useAuth } from "@/contextStore";
import { useEffect, useMemo, useState } from "react";
import { registerPatient } from "@/api/patients";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import ErrorAlert from "@/components/ErrorAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PatientOnboard() {
  useMetaArgs({
    title: "Patient onboard - Clinicare",
    description: "Set up your Clinicare account",
    keywords: "Clinicare, account set-up, data, information, account",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validatePatientSchema) });

  const { user, accessToken } = useAuth();
  const [currentStep, setCurrentstep] = useState(
    user?.iscompletedOnboard ? 3 : 2
  );
  const [field, setField] = useState(false);
  const [error, setError] = useState(null);

  const gender = ["male", "female", "other"];

  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
    
  }, [user, setValue]);

  const requiredFeilds1 = useMemo(
    () => ["fullname", "email", "phone", "dateOfBirth", "gender", "bloodGroup"],
    []
  );

  const requiredFeilds2 = useMemo(
    () => [
      "address",
      "emergencyContact",
      "emergencyContactPhone",
      "emergencyContactRelationship",
    ],
    []
  );
  const formValues = watch();

  useEffect(() => {
    const currentRequiredFields =
      currentStep === 1 ? requiredFeilds1 : requiredFeilds2;
    const hasEmptyFields = currentRequiredFields.some(
      (field) => !formValues[field] || formValues[field] === ""
    );

    const hasErrors = currentRequiredFields.some((field) => errors[field]);
    setField(hasEmptyFields || hasErrors);
  }, [formValues, errors, currentStep, requiredFeilds1, requiredFeilds2]);

  const handleStep = () => {
    if (currentStep === 1) {
      setCurrentstep(currentStep + 1);
    } else {
      setCurrentstep(currentStep - 1);
    }
  };
  const mutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success(response?.data?.message);
        //clear old user data
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      }
    },
    onError: (error) => {
      console.log(error);
      setError(
        error?.response?.data?.message || "Error resgistering your details"
      );
    },
  });

  const onSubmit = async (FormData) => {
    mutation.mutate({ FormData, accessToken });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] container mx-auto flex justify-center pt-20 items-center">
      <div className="px-4 md:px-0">
        <h1 className="font-bold text-xl text-center py-2">Patients Onboard</h1>
        <div className="max-w-[600px]">
          <form
            className="bg-white px-5 py-4 flex flex-col justify-center rounded-xl shadow-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="text-center text-[14px] md:text-[15px] pb-4 text-zinc-600 ">
              Hello <span className="font-bold">{user?.fullname}</span>,{" "}
              {user?.iscompletedOnboard
                ? "Onboarding completed"
                : " please complete your patient profile"}
            </p>
            {error && <ErrorAlert error={error} />}
            <ul className="steps">
              <li
                className={`step w-full ${
                  currentStep === 1 ? "step-primary" : ""
                } `}
              >
                Details
              </li>
              <li
                className={`step w-full ${
                  currentStep === 2 ? "step-primary" : ""
                } `}
              >
                Contact{" "}
              </li>
              <li
                className={`step w-full ${
                  currentStep === 3 ? "step-primary" : ""
                } `}
              >
                Save
              </li>
            </ul>
            {/* General Div for all */}
            <div className="grid grid-cols-12 gap-3">
              {currentStep === 1 && (
                <>
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
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Phone</legend>
                      <input
                        type="tel"
                        className="input"
                        placeholder="Phone"
                        {...register("phone")}
                      />
                    </fieldset>
                    {errors.phone?.message && (
                      <span className="text-xs text-red-500">
                        {errors.phone?.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Date of birth</legend>
                      <input
                        type="date"
                        className="input"
                        placeholder="dd/mm/yyyy"
                        {...register("dateOfBirth")}
                      />
                    </fieldset>
                    {errors.dateOfBirth?.message && (
                      <span className="text-xs text-red-500">
                        {errors.dateOfBirth?.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Gender</legend>
                      <select
                        name="gender"
                        id=""
                        defaultValue={""}
                        className="select capitalize w-full"
                        {...register("gender")}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Gender</option>
                        {gender?.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                    {errors.gender?.message && (
                      <span className="text-xs text-red-500">
                        {errors.gender?.message}
                      </span>
                    )}
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Blood group</legend>
                      <select
                        name="bloodGroup"
                        id=""
                        defaultValue={""}
                        {...register("bloodGroup")}
                        className="select capitalize w-full"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroupOptions?.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                    {errors.bloodGroup?.message && (
                      <span className="text-xs text-red-500">
                        {errors.bloodGroup?.message}
                      </span>
                    )}
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div className="col-span-12">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Address</legend>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Address"
                        {...register("address")}
                      />
                    </fieldset>
                    {errors.address?.message && (
                      <span className="text-xs text-red-500">
                        {errors.address?.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Emergency contact
                      </legend>
                      <input
                        type="text"
                        className="input text-xs"
                        placeholder="Emergency contact"
                        {...register("emergencyContact")}
                      />
                    </fieldset>
                    {errors.emergencyContact?.message && (
                      <span className="text-xs text-red-500">
                        {errors.emergencyContact?.message}
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
                        className="input text-xs"
                        placeholder="Emergency contact phone"
                        {...register("emergencyContactPhone")}
                      />
                    </fieldset>
                    {errors.emergencyContactPhone?.message && (
                      <span className="text-xs text-red-500">
                        {errors.emergencyContactPhone?.message}
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
                        className="input text-xs"
                        placeholder="Emergency contact relationship"
                        {...register("emergencyContactRelationship")}
                      />
                    </fieldset>
                    {errors.emergencyContactRelationship?.message && (
                      <span className="text-xs text-red-500">
                        {errors.emergencyContactRelationship?.message}
                      </span>
                    )}
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <div className="md:col-span-12 p-4 text-center">
                  <img
                    src="/Success.svg"
                    alt="success"
                    className="w-full h-[200px]"
                  />
                  <h1 className="text-2xl font-bold">Congratulations!</h1>
                  <p className="text-gray-600">
                    You've complete your onboarding successfully.
                  </p>
                  <button
                    className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    size="lg"
                    onClick={() => navigate("/dashboard", { replace: true })}
                  >
                    Continue to dashboard
                  </button>
                </div>
              )}
            </div>
            <div className="flex mt-1 md:justify-end pt-3">
              {currentStep === 1 && (
                <button
                  className="btn bg-zinc-800 font-bold text-white  w-full md:w-35 cursor-pointer rounded-lg"
                  onClick={handleStep}
                  disabled={field}
                >
                  Next
                </button>
              )}

              {currentStep === 2 && (
                <div className="flex justify-end gap-4 ">
                  <button
                    className="btn bg-zinc-800 font-bold text-white  w-full md:w-35 cursor-pointer rounded-lg"
                    onClick={handleStep}
                  >
                    {" "}
                    Previous
                  </button>
                  <button
                    className="btn bg-blue-500  hover:bg-blue-600 text-white font-bold w-full md:w-35 rounded-lg"
                    type="submit"
                    disabled={isSubmitting || mutation.isPending || field}
                  >
                    {isSubmitting || mutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
