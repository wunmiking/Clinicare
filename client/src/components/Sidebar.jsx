// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router";
import { navLinks } from "../constants/navLinks";
import Logout from './Logout'
import Logo from "@/components/Logo";

export default function Sidebar() {
  // possible sections in the order we want them
  const sections = ["Menu", "Management", "Settings"];

  return (
    <div className="hidden lg:flex lg:flex-col fixed z-50 w-[200px] h-full bg-white border-r border-zinc-200 p-5">
      {/* Logo */}
      <div className="mb-6">
        <Logo />
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {sections.map((section) => {
          const links = navLinks.filter((link) => link.section === section);
          if (links.length === 0) return null;

          return (
            <div key={section}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {section}
              </h3>
              <ul className="space-y-2 ">
                {links.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-full hover:text-blue-500 transition-colors  
                         ${
                           isActive
                             ? "bg-slate-200 text-blue-600 font-semibold"
                             : "text-gray-700 "
                         }`
                      }
                      viewTransition
                      end
                    >
                      <item.Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Logout button pinned to bottom */}
      <div className="mt-auto pb-4">
        <Logout />
      </div>
    </div>
  );
}
