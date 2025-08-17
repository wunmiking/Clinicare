import { validateSignUpSchema } from "@/utils/dataSchema";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bloodGroup, formatDate } from "@/utils/constants";
import { RiUser4Fill } from "@remixicon/react";
import { useAuth } from "@/contextStore";
// import { object } from "zod"; - check later to know what this does


export default function PatientOnboard() {
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [field, setField] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
  });

  const {user} = useAuth();

//   code for gender to be used in this jsx file
  const genderOptions =['male', 'female', 'other'];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));

  useEffect(() => {
    if (user) {
      setValue[("fullname", user.fullname)];
      setValue[("email", user.email)];
      setValue[("phone", user.phone || "")];
      setValue[("dateOfBirth", formatDate(user.dateOfBirth || "", "input"))];
    }
    [user.setValue];
  });

  const requiredFields1 = useMemo(
    () => [
      "fullname",
      "email",
      "phone",
      "phone",
      "dateOfBirth",
      "gender",
      "bloodGroup",
    ],
    []
  );

  const requiredFields2 = useMemo(
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
      currentStep === 1 ? requiredFields1 : requiredFields2;
    const hasEmptyFields = currentRequiredFields.some(
      (field) => !formValues[field] || formValues[field] === ""
    );
    const hasErrors = currentRequiredFields.some((field) => errors[field]);
    setField(hasEmptyFields || hasErrors);
  }, [formValues, errors, currentStep, requiredFields1, requiredFields2]);

  const handleStep = () => {
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    
    try {
      // Call your signup API here
      toast.success("Profile completed successfully!");
    } catch (error) {
      const errorMsg = error?.message || "An error occured during onboarding";
      toast.error(errorMsg)
    } 
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] md:px-10 container mx-auto flex justify-center pt-10 items-center">
     
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-5 py-3 w-[360px] md:w-[600px] flex flex-col justify-center rounded-xl shadow-lg"
      >

          <RiUser4Fill className="text-4xl mx-auto text-blue-500 border rounded-full w-10 h-10 p-2 mt-2" />

          <h1 className="font-bold text-2xl text-center py-2">Patients Onboard</h1>
        <p className="text-center text-[16px] md:text-[15px] mb-5 text-zinc-600">
         `Hello, {" "} ${user?.fullname}`
        </p>

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
                Contact
              </li>
              <li
                className={`step w-full ${
                  currentStep === 3 ? "step-primary" : ""
                } `}
              >
                Save
              </li>
            </ul>

        <div className=" md:grid md:grid-cols-12 md:gap-4">
          {currentStep === 1 && (
                <>
          {/* full name fieldset */}
          <fieldset className="fieldset md:col-span-6">
            <legend className="fieldset-legend">Full name</legend>
            <input {...register("fullname")}
 type="text" className="input" placeholder="Full Name" />
          {errors?.fullname?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.fullname?.message}
              </p>
            )}
          </fieldset>

            {/* email details fieldset */}

          <fieldset className="fieldset md:col-span-6">
            <legend className="fieldset-legend">Email</legend>
            <input {...register("email")}
 type="email" className="input" placeholder="Email" />
  {errors?.email?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.email?.message}
              </p>
            )}

          </fieldset>

            {/* phone details fieldset */}

          <fieldset className="fieldset  md:col-span-6">
            <legend className="fieldset-legend">Phone</legend>
            <input {...register("phone")}
 type="email" className="input" placeholder="Phone Number" />
  {errors?.phone?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.phone?.message}
              </p>
            )}

          </fieldset>

        {/* Date of Birth */}
        <fieldset className="fieldset  md:col-span-6">
          <legend className="fieldset-legend">Date of Birth</legend>
          <input {...register("dob")} type="date" className="input" />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
        </fieldset>

        {/* Gender */}
        <fieldset className="fieldset  md:col-span-6">
          <legend className="fieldset-legend">Gender</legend>
          <select {...register("gender")} className="input">
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
        </fieldset>

        {/* Blood Group */}
        <fieldset className="fieldset md:col-span-6">
          <legend className="fieldset-legend">Blood Group</legend>
          <select {...register("bloodGroup")} className="input">
            <option value="">Select Blood Group</option>
            {bloodGroupOptions.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
        </fieldset>

            </>
              )}
              {currentStep === 2 && (
                <>

        {/* Address */}
        <fieldset className="fieldset md:col-span-12">
          <legend className="fieldset-legend">Address</legend>
          <textarea {...register("address")} className="input w-full" placeholder="Residential Address" />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </fieldset>

        {/* Emergency Contact Name */}
        <fieldset className="fieldset  md:col-span-6">
          <legend className="fieldset-legend">Emergency Contact Name</legend>
          <input
            {...register("emergencyContactName")}
            type="text"
            className="input"
            placeholder="Full Name"
          />
          {errors.emergencyContactName && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName.message}</p>
          )}
        </fieldset>

        {/* Emergency Contact Phone */}
        <fieldset className="fieldset md:col-span-6">
          <legend className="fieldset-legend">Emergency Contact Phone</legend>
          <input
            {...register("emergencyContactPhone")}
            type="tel"
            className="input"
            placeholder="Phone Number"
          />
          {errors.emergencyContactPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone.message}</p>
          )}
        </fieldset>
          {/* <div className="flex md:col-span-12"> */}
        {/* Emergency Contact Relationship */}
        <fieldset className="fieldset md:col-span-6">
          <legend className="fieldset-legend">Emergency contact relationship</legend>
          <input
            {...register("emergencyContactRelationship")}
            type="text"
            className="input"
            placeholder="e.g. Parent, Friend"
          />
          {errors.emergencyContactRelationship && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyContactRelationship.message}</p>
          )}
        </fieldset>
        </>
              )}
          </div>
        {/* Submit Button */}
        <div className="flex mt-1 justify-end pt-3">
              {currentStep === 1 && (
                <button
                  className="btn bg-zinc-800 font-bold text-white w-30 md:w-35 cursor-pointer rounded-lg"
                  onClick={handleStep}
                  disabled={field}
                 >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <div className="flex gap-20 lg:gap-4">
                  <button
                    className="btn bg-zinc-800 font-bold text-white w-30 md:w-35 cursor-pointer rounded-lg "
                    onClick={handleStep}
                  >
                    Previous
                  </button>
                  <button
                    className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold w-30 md:w-35 cursor-pointer rounded-lg"
                    type="submit"
                    disabled={isSubmitting || field}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            </form>
      </div>
      
  );
}
