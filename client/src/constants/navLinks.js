// src/constants/navLinks.js
import {
  RiDashboardLine,
  RiCalendarScheduleLine,
  RiHotelBedLine,
  RiWalletLine,
  RiStethoscopeLine,
  RiGroupLine,
  RiGroup3Line,
  RiUserLine,
  RiSettings3Line,
} from "@remixicon/react";

export const navLinks = [
  {
    id: 1,
    Icon: RiDashboardLine,
    path: "/dashboard",
    name: "Dashboard",
    section: "Menu",
  },
  {
    id: 2,
    Icon: RiCalendarScheduleLine,
    path: "dashboard/appointments",
    name: "Appointments",
    section: "Menu",
  },
  {
    id: 3,
    Icon: RiHotelBedLine,
    path: "/dashboard/rooms",
    name: "Rooms",
    section: "Menu",
  },
  {
    id: 4,
    Icon: RiWalletLine,
    path: "/dashboard/payments",
    name: "Payments",
    section: "Menu",
  },

  {
    id: 5,
    Icon: RiStethoscopeLine,
    path: "/dashboard/doctors",
    name: "Doctors",
    section: "Management",
  },
  {
    id: 6,
    Icon: RiGroupLine,
    path: "/dashboard/patients",
    name: "Patients",
    section: "Management",
  },
  {
    id: 7,
    Icon: RiGroup3Line,
    path: "/dashboard/inpatients",
    name: "Inpatients",
    section: "Management",
  },

  {
    id: 8,
    Icon: RiUserLine,
    path: "/dashboard/users",
    name: "Users",
    section: "Settings",
  },
  {
    id: 9,
    Icon: RiSettings3Line,
    path: "/dashboard/settings",
    name: "Settings",
    section: "Settings",
  },
];
