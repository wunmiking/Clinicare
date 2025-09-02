// src/features/rooms/AddRoom.jsx

import React, { useState } from "react";
import { useAuth } from "@/store";
import { createRoom } from "@/api/rooms";
import { validateRoomSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import ErrorAlert from "@/components/ErrorAlert";

export default function AddRoom() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateRoomSchema),
  });

  // Mutation to create a new room
  const mutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (err) => {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add room");
    },
  });

  const roomType = ["Regular", "VIP", "ICU", "Deluxe", "Suite"];
  const roomStatus = ["available", "occupied", "maintenance"];

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllRooms"] });
    setIsOpen(false);
    setShowSuccess(false);
    setError(null);
    reset();
  };

  const onSubmit = (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Add Room
      </button>

      <Modal
        id="addRoomModal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="bg-white p-4 rounded-xl shadow-md max-w-[400px] mx-auto"
      >
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        </div>
        {error && <ErrorAlert error={error} />}
        {showSuccess ? (
          <>
            <div className="p-4 text-center">
              <img
                src="/Success.svg"
                alt="Success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={resetModal}
              >
                Continue to Rooms
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Number</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Choose from Room 101-120"
                    {...register("roomNumber")}
                  />
                </fieldset>
                {errors.roomNumber?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomNumber?.message}
                  </span>
                )}
              </div>

              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Type</legend>
                  <select
                    name="roomType"
                    id=""
                    defaultValue={""}
                    className="select capitalize"
                    {...register("roomType")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Room Type</option>
                    {roomType.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.roomType?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomType?.message}
                  </span>
                )}
              </div>

              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Price</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Input Room Price"
                    {...register("roomPrice")}
                  />{" "}
                </fieldset>
                {errors.roomPrice?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomPrice?.message}
                  </span>
                )}
              </div>

<div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Status</legend>
                  <select
                    name="roomStatus"
                    defaultValue={""}
                    className="select capitalize"
                    {...register("roomStatus")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Room Status</option>
                    {roomStatus?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.roomStatus?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomStatus?.message}
                  </span>
                )}
              </div>

              <div className="col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Description</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Room Description"
                    {...register("roomDescription")}
                  />{" "}
                </fieldset>
                {errors.roomDescription?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomDescription?.message}
                  </span>
                )}
              </div>

              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Capacity</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Room Capacity [1-5]"
                    {...register("roomCapacity")}
                  />{" "}
                </fieldset>
                {errors.roomCapacity?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomCapacity?.message}
                  </span>
                )}
              </div>
 
            </div>
            <div className="mt-4 mb-2 flex md:justify-end gap-3">
            <button
              type="button"
              className="btn btn-outline w-[150px] border-gray-500 border-[0.5px]"
              onClick={() => setIsOpen(false)}
            > Cancel
                </button>
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 text-white w-[150px]" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? "Adding Room..." : "Add Room"}
            </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
