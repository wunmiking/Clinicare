import { RiBuilding2Fill } from "@remixicon/react";
import { NavLink } from "react-router";


export default function Nav() {


  return (
   <nav className="sticky top-0 z-50 bg-white shadow-md">
   <div className="container mx-auto p-4 flex justify-between items-center">
   <NavLink to="/" className="flex gap-2 items-center w-fit">
      <RiBuilding2Fill size={36} className="text-blue-600" />
      <h1 className="font-bold text-zinc-800 text-2xl">
        Clinicare
      </h1>
    </NavLink>

    
      {/* Contact Us Link */}
     <div className="hidden md:flex gap-6 text-sm font-medium">
        <NavLink
          to="/ContactUs"
          className={({ isActive }) =>
            isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"
          }
        >
          Contact Us
        </NavLink>
      </div>

      </div>

    </nav>
  );
}