import useMetaArgs from "@/hooks/useMeta";
import React from "react";
import { Link } from "react-router";

export default function Home() {
  useMetaArgs({
    title: "Clinicare - Hospital Management System",
    description:
      "Clinicare is a comprehensive hospital management system designed to streamline healthcare operations, enhance patient care, and improve overall efficiency.",
    keywords:
      "hospital management, healthcare, patient care, clinic software, health",
  });
  return (
    <main className="">
      <div className="pt-58 md:pt-60 pb-20 mx-auto min-h-115 items-center max-w-[700px]">
        <h1 className="font-bold text-4xl md:text-5xl text-center">
          Welcome to <br />{" "}
          <span className="text-6xl md:text-7xl text-orange-400">Clinicare</span>
        </h1>
        <p className="py-8 text-zinc-800 text-center px-5 md:px-15 lg:px-20">
          Manage your hospital operations, patient records, and more with our
          powerful hospital management system.
        </p>
        <div className="flex gap-4 justify-center items-center">
          <Link className="btn bg-blue-600 text-white" to="/account/signup">
            New Patient
          </Link>
          <Link className="btn btn-outline" to="/account/login">
            Login to Clinicare
          </Link>
        </div>
      </div>
      <div className="mx-auto w-[82%] lg:w-[88%] pb-20">
        <img
          className="h-full w-full rounded-xl shadow-lg lg:h-110"
          src="hospitalHero.jpg"
          alt="hospital-hero-img"
        />
      </div>
      <div className="container mx-auto py-5 px-4">
        <h1 className="font-bold text-[25px] md:text-3xl text-center pb-6">
          Dedicated portals for Every User
        </h1>
        <div className="grid grid-cols-12 container gap-4 lg:gap-6 pb-20">
          <div className="col-span-12 md:col-span-6 border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-blue-100 rounded-full p-3"
              src="user-line.png"
              alt="usee-line-icon"
            />
            <h1 className="py-3 text-xl font-bold text-center">Admin Login</h1>
            <p className="text-center mb-4">
              Secure access for adminstrator to manage hospital resources.
            </p>
            <Link className="btn btn-outline" to="/account/login">
              Admin Login
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-green-100 rounded-full p-3  "
              src="group-line.png"
              alt="group-line-icon"
            />
            <h1 className="py-3 text-xl font-bold text-center">
              Doctor Portal
            </h1>
            <p className="text-center mb-4">
              Secure access for doctors to manage patients, appointments,
              diagnosis etc.
            </p>
            <Link className="btn btn-outline" to="/account/login">
              Doctors Login
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-yellow-100 rounded-full p-3"
              src="group-line (y).png"
              alt="group-line-9(y)-icon"
            />
            <h1 className="py-3 text-xl font-bold text-center">
              Nurses Portal
            </h1>
            <p className="text-center mb-4">
              Secure access for nurses to manage patient care, schedules, and
              vital signs.
            </p>
            <Link className="btn btn-outline" to="/account/login">
              Nurses Login
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6 border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-red-100 rounded-full p-3"
              src="heart-pulse-fill.png"
              alt="heart-pulse-icon"
            />
            <h1 className="py-3 text-xl font-bold text-center">
              Patient Login
            </h1>
            <p className="text-center mb-4">
              Easy access for patients to view appointments, medical records,
              and more.
            </p>
            <Link className="btn btn-outline" to="/account/login">
              Patient Login
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-3 px-4 mb-20">
        <h1 className="font-bold text-[24px] md:text-3xl text-center pb-7">
          Enterprise-Grade Features
        </h1>
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <div className="border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-blue-200 size-12 rounded-full p-3"
              src="taskbar.svg"
              alt="taskbar.svg"
            />
            <h1 className="pt-4 pb-3 text-xl font-bold text-center">
              Hospital Operations
            </h1>
            <p className="text-center px-5 md:px-0">
              Streamline daily operatiobs, resources allocation, and staff
              management.
            </p>
          </div>
          <div className="border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-blue-200 size-12 rounded-full p-3"
              src="blue-shield.svg"
              alt="blue-shield.svg"
            />
            <h1 className="pt-4 pb-3 text-xl font-bold text-center">
              Data Security
            </h1>
            <p className="text-center px-5 md:px-0">
              HIPAA-compliant security measures to protect sensitive patient
              data.
            </p>
          </div>
          <div className="border border-gray-500 rounded-lg shadow-lg py-5 px-6 flex flex-col justify-center items-center h-62">
            <img
              className="bg-blue-200 size-12 rounded-full p-3"
              src="vital-sign.svg"
              alt="vital-sign.svg"
            />
            <h1 className="pt-4 pb-3 text-xl font-bold text-center">
              Clinical Management
            </h1>
            <p className="text-center px-5 md:px-0">
              Comprehensive tools for patient care and clinical workflow
              optimization.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-[82%] lg:w-[88%] pb-20">
        <img
          className="h-full w-full rounded-xl shadow-lg lg:h-140 border border-gray-500"
          src="clinicare-dashboard.png"
          alt="clinicare-dashboard"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:h-60 gap-10 md:gap-45 bg-blue-500 text-white py-8 mx-auto">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold">100+</h1>
          <p>Hospitals</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold">1000+</h1>
          Healthcare Professionals
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold">1M+</h1>
          <p>Patients Served</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold">99.9%</h1>
          <p>System Uptime</p>
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center pt-25 pb-15">
        <h1 className="text-3xl font-bold px-5 text-center">
          Ready to Transform Your Hospital Experience?
        </h1>
        <p className="py-4 text-center px-4">
          Take advantage of our awesome services and enjoy rich healthcare
          experience at the comfort of your home
        </p>
        <button className="py-2 px-4 rounded-sm bg-blue-500 text-white hover:cursor-pointer">
          Get Started
        </button>
      </div>
    </main>
  );
}
