// import { useAuth } from "@/store";
import { formatDate, usersRoleColors } from "@/utils/constants";
import { RiPhoneLine } from "@remixicon/react";
import React, { useState } from "react";
import DeleteUserModal from "./DeleteUser";
import UpdateUser from "./UpdateUser";

export default function UsersCard({ item }) {
  // const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
  // const [userId, setUserId] = useState(null);
  // const { user } = useAuth();

  return (
    <div className="bg-white flex flex-col p-4 gap-3 shadow rounded-xl h-full justify-between">
      <div className="flex gap-3 items-start">
        <div className="avatar avatar-placeholder">
          <div className="w-10 rounded-full bg-gray-300 text-gray-600 border-2 border-gray-300 flex items-center justify-center">
            {item?.avatar ? (
              <img
                src={item?.avatar}
                alt={item?.fullname.split(" ")[0].charAt(0)}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : ( 
              <span className="text-sm">
                {item?.fullname
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-bold">{item?.fullname}</h2>
          <p className="text-sm text-gray-500">{item?.email}</p>
          <div
            className={`capitalize badge badge-sm font-semibold my-2 ${
              usersRoleColors[item.role]
            }`}
          >
            {item.role}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <RiPhoneLine size={17} /> {item?.phone}
          </p>
          <p className="text-sm text-gray-500">
            Joined: {formatDate(item?.createdAt)}
          </p>
        </div>
      </div>
     
        <div className="flex gap-2 mt-4 justify-end">
          <button
          className="btn btn-sm"
          onClick={() => setEditModalOpen(true)}
          disabled={item?.role === "patient"}
        >
            Edit
          </button>
         <button
          className="btn btn-sm bg-red-500 text-white"
          onClick={() => setDeleteModalOpen(true)}
        >
            Delete
          </button>
        </div>
        <UpdateUser
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={item}
      />  
        <DeleteUserModal
           isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        item={item}
        />
      
    </div>
  );
}