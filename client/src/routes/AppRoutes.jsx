import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/components/LazyLoader";
import { PublicRoutes, PrivateRoutes, VerifiedRoutes } from "./ProtectedRoutes";
import { useAuth } from "@/store";

//render pages
const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const OnboardLayout = lazy(() => import("@/layouts/OnboardLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const Contact = lazy(() => import("@/pages/contact/Contact"));
const Signin = lazy(() => import("@/pages/account/signin/SignIn"));
const Signup = lazy(() => import("@/pages/account/signup/SignUp"));
const VerifyAccount = lazy(() => import("@/pages/verifyAccount/VerifyAccount"));
const PatientOnboard = lazy(() => import("@/pages/patientsOnboard/PatientsOnboard"));
const ForgotPassword = lazy(() => import("@/pages/account/forgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/account/resetPassword/ResetPassword"));
const Appointments = lazy (() => import("@/pages/dashboard/appointments/Appointments"));
const Doctors = lazy (() => import("@/pages/dashboard/doctors/Doctors"));
const Patients = lazy(() => import("@/pages/dashboard/patients/Patients"));
const Inpatients = lazy (() => import("@/pages/dashboard/inpatients/Inpatients"));
const Payments = lazy (() => import ("@/pages/dashboard/payments/Payments"));
const Rooms = lazy (() => import ("@/pages/dashboard/rooms/Rooms"));
const Users = lazy (() => import("@/pages/dashboard/users/Users"));
const Settings = lazy(() => import("@/pages/dashboard/settings/Settings"));
const Account = lazy(() => import("@/pages/dashboard/settings/account/Account"));
const Password = lazy (() => import("@/pages/dashboard/settings/password/Password"));
const Health = lazy (() => import("@/pages/dashboard/settings/health-record/HealthRecord"))
const Dashboard = lazy (() => import("@/pages/dashboard/Dashboard"));


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
          path: "contact",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "account",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "signin",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Signin />
            </Suspense>
          ),
        },
        {
          path: "signup",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Signup />
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
            <OnboardLayout />
          </VerifiedRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "verify-account",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <VerifyAccount />
            </Suspense>
          ),
        },
        {
          path: "patients-onboard",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientOnboard />
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
            <DashboardLayout />,
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
          path: "Appointments",
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
          path: "patients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Patients />
            </Suspense>
          ),
        },
        {
          path: "Inpatients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Inpatients />
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
          path: "users",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Users/>
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
          children: [
            {
              path: "account",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Account />
                </Suspense>
              ),
            },
            {
              path: "password",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Password />
                </Suspense>
              ),
            },
            {
              path: "health",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Health />
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
        
      ],
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
