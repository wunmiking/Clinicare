import Logo from "@/components/Logo";
import Logout from "@/components/Logout";
import { RiCopyrightFill } from "@remixicon/react";
import { Outlet } from "react-router";



export default function OnboardingLayout() {
  return (
    <div className="top-0 left-0 z-50 bg-slate-100">
      <div className="container mx-auto py-5 px-4 flex justify-between items-center">
        <Logo />
        <Logout/> 
        {/* <button className="btn bg-red-500 hover:bg-red-600 text-white">Logout</button> */}
      </div>
       <Outlet />
      <div className="container mx-auto py-5 px-4">
        {/* HR line in css - Divider */}
        <div className="flex justify-center md:justify-start">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
