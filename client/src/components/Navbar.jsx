// src/components/Navbar.jsx
import { getTimeBasedGreeting } from "@/utils/constants";
import { RiSearchLine } from "@remixicon/react";
// import { Avatar } from 'react-daisyui'

export default function Navbar({ user }) {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="hidden lg:block sticky top-2 right-0 left-[200px]  mx-4 z-40 bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-zinc-200 rounded-full">
      <div className="container mx-auto px-4 py-[14px]">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-[60px]">
          <h2 className="text-lg font-semibold text-zinc-800">
            {greeting}, {user?.fullname}! 👋{" "}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="input border pl-10 p-3 w-64"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size={20}">
                <RiSearchLine />
              </span>
            </div>
            <div className="avatar avatar-placeholder">
              <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.fullname.split(" ")[0].charAt(0)}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    priority="high"
                  />
                ) : (
                  <span className="text-sm">
                    {user?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
