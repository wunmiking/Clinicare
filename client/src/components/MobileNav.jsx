import React from "react"
import Drawer from "./Drawer"
import Logo from "./Logo"

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 flex justify-between items-center">
      {/* Clinicare Logo */}
      <div className="mb-6">
        <Logo />
      </div>

      {/* Drawer Trigger */}
      <Drawer />
    </div>
  )
}