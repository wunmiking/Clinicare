import { bookAppointment, fetchDoctorById } from "@/api/auth";
import { validateAppointmentSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";


// Utility to generate time slots between start and end in minutes
function generateTimeSlots(startHour = 9, endHour = 17, intervalMins = 60) {
  const slots = [];
  const pad = (n) => n.toString().padStart(2, "0");
  for (let hour = startHour; hour < endHour; hour++) {
    for (let m = 0; m < 60; m += intervalMins) {
      slots.push(`${pad(hour)}:${pad(m)}`);
    }
  }
  return slots;
}

export default function BookAppointment() {
  const { id: doctorId } = useParams();
  const queryClient = useQueryClient();

  // 1) useQuery with object API
  const {
    data: doctorResponse,
    // isLoading: isDoctorLoading,
    // isError: isDoctorError,
    // error: doctorError,
  } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => fetchDoctorById(doctorId),
  });

  // 2) React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateAppointmentSchema),
    defaultValues: { doctorId, date: "", time: "", reason: "" },
  });

  // 3) useMutation with object API
  const { mutateAsync: createAppointment } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      // 4) Invalidate using object API
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const onSubmit = async (formData) => {
    await createAppointment(formData);
    // show toast, navigate, etc.
  };

  // if (isDoctorLoading) return <p>Loading doctor info…</p>;
  // if (isDoctorError) return <p>Error: {doctorError.message}</p>;

  const doctorName = doctorResponse?.data?.name;
  const timeSlots = generateTimeSlots(9, 17, 30);

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6">
        Book Appointment with Dr. {doctorName}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("doctorId")} />

        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="input input-bordered w-full"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Time</label>
          <select
            {...register("time")}
            className="select select-bordered w-full"
          >
            <option value="">Select time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">
              {errors.time.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Reason (optional)
          </label>
          <textarea
            {...register("reason")}
            placeholder="Why are you booking?"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking…" : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}