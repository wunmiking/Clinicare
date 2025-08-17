import Logo from "@/components/Logo";
import { RiCopyrightFill } from "@remixicon/react";
import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="relative min-h-screen bg-[#F1F5F9]">
      <div className="fixed  top-0 left-0 right-0 z-50 py-4 px-4 flex justify-between items-center">
        <Logo />
      </div>
      <Outlet />
      <div className=" py-5 px-4">
        <div className="flex justify-center gap-1 md:justify-start">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </div>

    )
}