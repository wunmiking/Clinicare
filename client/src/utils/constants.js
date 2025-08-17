export const bloodGroup = {
  "A+": "A-positive",
  "A-": "A-negative",
  "B+": "B-positive",
  "B-": "B-negative",
  "AB+": "AB-positive",
  "AB-": "AB-negative",
  "O+": "O-positive",
  "O-": "O-negative",
};

export const genderOptions = {
    male: "Male",
    female: "Female",
    other: "Other",
}

export const appointmentStatus = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Complleted",
    cancelled: "Cancelled",
    rescheduled: "Rescheduled",
}

export const headers = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if(hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const formatDate = (item, format = "display") => {
  if (format === "input") {
    return dayjs(item).format("YYYY-MM-DD");
  }
  return dayjs(item).format("DD/MM/YYYY");
};