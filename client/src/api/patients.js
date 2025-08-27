import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const registerPatient = async ({ formData, accessToken }) => {
  return await axiosInstance.post(
    "/patients/register",
    formData,
    headers(accessToken)
  );
};
 
export const getPatient = async (accessToken) => {
  return await axiosInstance.get("/patients/me", headers(accessToken));
};

export const updatePatient = async ({ patientId, formData, accessToken }) => {
  return await axiosInstance.patch(
    `/patients/${patientId}/update`,
    formData,
    headers(accessToken)
  );
};

export const getAllPatients = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const query = searchParams.get("query") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (gender) params.append("gender", gender);
  if (bloodGroup) params.append ("bloodGroup", bloodGroup);
  if (query) params.append("query", query);
  params.append("role", "patient");
  return await axiosInstance.get(
    `/auth/all?${params.toString()}`,
    headers(accessToken)
  );
};