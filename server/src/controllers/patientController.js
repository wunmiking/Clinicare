import tryCatchFunction from "../utils/tryCatchFunction.js";
import patientService from "../services/patient.service.js";
import responseHandler from "../utils/responseHandler.js";


const { successResponse } = responseHandler;

export const register = tryCatchFunction(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await patientService.register(userId, req.body, next);
  if (!responseData) return;
  return successResponse(res, responseData, "Onboarding completed", 201);
});