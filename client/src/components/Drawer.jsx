
import React, { useState } from "react"
import { NavLink } from "react-router"
import { navLinks } from "../constants/navLinks"
import Logout from "./Logout"
import Logo from "@/components/Logo"
import { RiMenuLine, RiCloseLine } from "@remixicon/react"

export default function Drawer() {
  const [open, setOpen] = useState(false)
  const sections = ["Menu", "Management", "Settings"]

  const toggleDrawer = () => setOpen((prev) => !prev)

  return (
    <div className="lg:hidden">
      {/* Menu Icon */}
      <button onClick={toggleDrawer} className="p-2 text-zinc-700">
        <RiMenuLine size={24} />
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-white bg-opacity-40 flex justify-end transition-transform duration-300"
          onClick={toggleDrawer}
        >
          {/* Drawer Panel */}
          <div
            className="w-[80%] max-w-xs h-full bg-white p-5 shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-zinc-700"
              onClick={toggleDrawer}
            >
              <RiCloseLine size={24} />
            </button>

            {/* Logo */}
            <div className="mb-6">
              <Logo />
            </div>

            {/* Navigation Sections */}
            <nav className="space-y-6">
              {sections.map((section) => {
                const links = navLinks.filter((link) => link.section === section)
                if (links.length === 0) return null

                return (
                  <div key={section}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {section}
                    </h3>
                    <ul className="space-y-2">
                      {links.map((item) => (
                        <li key={item.id}>
                          <NavLink
                            to={item.path}
                            onClick={toggleDrawer}
                            className={({ isActive }) =>
                              `flex items-center gap-3 p-2 rounded-md transition-colors ${
                                isActive
                                  ? "bg-slate-200 text-blue-600 font-semibold"
                                  : "text-gray-700 hover:bg-slate-100"
                              }`
                            }
                          >
                            <item.Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </nav>

            {/* Logout Button */}
            {/* <div className="mt-10">
              <LogoutButton />
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}