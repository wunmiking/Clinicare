import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import Room from "../models/room.js";
import responseHandler from "../utils/responseHandler.js";
import mailService from "./email.service.js";
const { errorResponse, notFoundResponse } = responseHandler;

const paymentService = {
createPayment: async (paymentData, next) => {
    if (paymentData.appointmentId) {
      const patientAppointment = await Appointment.findOne({
        _id: paymentData.appointmentId.toString(),
      });
      if (
        !patientAppointment ||
        patientAppointment.patientId.toString() !==
          paymentData.patientId.toString()
      ) {
        return next(notFoundResponse("No appointment found for this patient"));
      }
    }
    if (paymentData.roomId) {
      const room = await Room.findOne({ _id: paymentData.roomId });
      if (room.roomPrice !== paymentData.amount) {
        return next(
          errorResponse("Room price does not match amount to be paid")
        );
      }
    }
    const payment = await Payment.create({
      ...paymentData,
    });
    if (!payment) {
      return next(errorResponse("Payment not created"));
    }
    const patient = await Patient.findOne({
      userId: payment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    process.nextTick(() => {
      mailService
        .sendCreatePaymentEmail(patient.email, patient.fullname, payment)
        .catch(console.error);
    });
    return payment;
  },};

export default paymentService;