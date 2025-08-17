import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/components/LazyLoader";
import PublicRoutes, { PrivateRoutes } from "./ProtectedRoutes";
import { useAuth } from "@/contextStore";

//render pages
const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const Contact = lazy(() => import("@/pages/contact-us/ContactUs"));
const Login = lazy(() => import("@/pages/login/Login"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const SignUp = lazy(() => import("@/pages/signup/SignUp"));
const ForgotPassword = lazy(() =>
  import("@/pages/forgot-password/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("@/pages/reset-password/ResetPassword")
);
const PatientOnboard = lazy(() =>
  import("@/pages/patient-onboard/PatientOnboard")
);
const VerifyAccount = lazy(() =>
  import("@/pages/verify-account/VerifyAccount")
);
const OnboardingLayout = lazy(() => import("@/layouts/OnboardingLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Doctors = lazy(() => import("@/pages/doctors/Doctors"));
const Appointments = lazy(() => import("@/pages/appointments/Appointments"));
const Inpatients = lazy(() => import("@/pages/inpatients/Inpatients"));
const Patients = lazy(() => import("@/pages/users/Patients"));
const Payments = lazy(() => import("@/pages/payments/Payments"));
const Rooms = lazy(() => import("@/pages/Rooms/Rooms"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const Users = lazy(() => import("@/pages/dashboard/Users"));

export default function AppRoutes() {
  const { accessToken, user } = useAuth();

  const routes = [
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <RootLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/contact-us",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/account",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),

      children: [
        {
          path: "login",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "signup",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <SignUp />
            </Suspense>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: "reset-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ResetPassword />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <VerifiedRoutes accessToken={accessToken} user={user}>
            <OnboardingLayout />
          </VerifiedRoutes>
        </Suspense>
      ),

      children: [
        {
          path: "/patient-onboard",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientOnboard />
            </Suspense>
          ),
        },
        {
          path: "/verify-account",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <VerifyAccount />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <DashboardLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },

        {
          path: "appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Appointments />
            </Suspense>
          ),
        },
        {
          path: "doctors",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Doctors />
            </Suspense>
          ),
        },
        {
          path: "inpatients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Inpatients />
            </Suspense>
          ),
        },
        {
          path: "patients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Patients />
            </Suspense>
          ),
        },
        {
          path: "payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Payments />
            </Suspense>
          ),
        },
        {
          path: "rooms",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Rooms />
            </Suspense>
          ),
        },
        {
          path: "settings",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Users />
            </Suspense>
          ),
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
