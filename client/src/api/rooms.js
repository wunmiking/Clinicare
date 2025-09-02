import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const createRoom = async ({ formData, accessToken }) => {
  return await axiosInstance.post(
    "/rooms/create",
    formData,
    headers(accessToken)
  );
};

export const getRoomMeta = async (accessToken) => {
  return await axiosInstance.get("/rooms/meta", headers(accessToken));
};

export const getAllRooms = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const query = searchParams.get("query") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (roomType)   params.append("type", roomType);
  if (roomStatus) params.append("status", roomStatus);
  if (query)  params.append("query", query);

  return await axiosInstance.get(
    `/rooms/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateRoom = async ({ roomId, formData, accessToken }) => {
  return await axiosInstance.patch(
    `/rooms/${roomId}/update`,
    formData,
    headers(accessToken)
  );
};

