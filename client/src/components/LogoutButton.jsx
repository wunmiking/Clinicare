import { RiLogoutCircleRLine } from "@remixicon/react";
import React from "react";

// src/components/LogoutButton.jsx

export default function LogoutButton() {
  return (
    <>
      {/* Trigger modal logic here */}
      <button
        className="flex items-center gap-2 text-red-500 font-semibold"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        <RiLogoutCircleRLine /> Logout
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-6/12 max-w-1xl justify-center">
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="flex gap-4">
            <button className="btn">Cancel</button>
            <button className="btn">Logout</button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
