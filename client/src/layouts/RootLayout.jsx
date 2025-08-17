import React from 'react'
import { Outlet, Link } from 'react-router'
import Logo from '@/components/Logo'

const publicNav = [
  { name: 'Home', path: '/' },
  { name: 'Contact Us', path: '/contact-us' },
  { name: 'Login', path: '/account/login' },
  { name: 'Sign Up', path: '/account/signup' },
]

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <Logo className="h-8" />
          </Link>
          <nav className="space-x-6">
            {publicNav.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-zinc-700 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* footer */}
      <footer className="bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Clinicare. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
