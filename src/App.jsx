import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

///// pages /////

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login/Login";
import MeetingDetails from "./pages/Meeting Details/MeetingDetails";
import Layout from "./components/Layout/Layout";
import ComingSoon from "./pages/NotFound/ComingSoon";
import NotFound from "./pages/NotFound/NotFound";
import Employees from "./pages/Employees/Employees";
import ViewParticularContact from "./pages/Contacts/ViewParticularContact";
import ViewContacts from "./pages/Contacts/ViewContacts";
import ViewProducts from "./pages/Products/ViewProducts";
import CreateProduct from "./pages/Products/CreateProduct";
import ViewAttendees from "./pages/Attendees/ViewAttendees";
import CreateEmployee from "./pages/Employees/CreateEmployee";
import ViewSettings from "./pages/Settings/ViewSettings";
import ViewPlans from "./pages/Settings/Plans/ViewPlans";
import SignUp from "./pages/Auth/SignUp/SignUp";
import AddPlan from "./pages/Settings/Plans/AddPlan";
import ViewSidebarLinks from "./pages/Settings/SidebarLinks/ViewSidebarLinks";
import CreateSidebarLink from "./pages/Settings/SidebarLinks/CreateSidebarLink";
import Assignments from "./pages/Assignments/Assignments";
import Clients from "./pages/Clients/Clients";
import EmployeeAssignments from "./pages/Employees/EmployeeAssignments";
import LandingPageForm from "./pages/Settings/LandingPage/LandingPageForm";
import EmployeeActivity from "./pages/Employees/EmployeeActivity";
import PabblyToken from "./pages/Settings/PabblyToken/PabblyToken";
import CustomOptions from "./pages/Settings/CustomOptions/CustomOptions";
import { getEmployeeStats } from "./features/actions/employee";
import { addUserActivity } from "./features/actions/userActivity";
import { isEmployeeId } from "./utils/roles";
import { setIsEmployee } from "./features/slices/userActivity";
import RouteGuard from "./components/RouteGuard";

const App = () => {
  const dispatch = useDispatch();

  const { isUserLoggedIn } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";
  console.log(
    "checking if user is logged in",
    isUserLoggedIn,
    isEmployeeId(role)
  );
  // if (isUserLoggedIn && isEmployeeId(role)) {
  //   dispatch(setIsEmployee(true));
  //   dispatch(
  //     addUserActivity({
  //       action: "login/refresh",
  //       details: "User logged in or refreshed successfully",
  //     })
  //   );
  // } else {
  //   dispatch(setIsEmployee(false));
  // }

  const router = createBrowserRouter([
    {
      path: "/signUp",
      element: !isUserLoggedIn ? <SignUp /> : <Dashboard />, // Redirect to dashboard if logged in
    },
    {
      path: "/",
      element: isUserLoggedIn ? <Layout /> : <Login />,

      children: [
        {
          path: "/",
          element: <Dashboard />,
        },

        {
          path: "/webinarDetails",
          element: <MeetingDetails />,
        },
        {
          path: "/contacts/:csvId",
          element: <ViewContacts />,
        },
        {
          path: "/particularContact",
          element: <ViewParticularContact />,
        },
        {
          path: "/*",
          element: <ComingSoon />,
        },
        {
          path: "/employees",
          element: <Employees />,
        },
        {
          path: "/employees/assignments/:id",
          element: <EmployeeAssignments />,
        },
        {
          path: "/employees/Activity/:id/:username/:role",
          element: <EmployeeActivity />,
        },
        {
          path: "/clients",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <Clients />
            </RouteGuard>
          ),
        },
        {
          path: "/products",
          element: <ViewProducts />,
        },
        {
          path: "/assignments",
          element: <Assignments />,
        },
        {
          path: "/products/addProduct",
          element: <CreateProduct />,
        },
        {
          path: "/attendees",
          element: <ViewAttendees />,
        },
        {
          path: "/createEmployee",
          element: <CreateEmployee />,
        },
        {
          path: "/settings",
          element: <ViewSettings />,
        },
        {
          path: "/settings/custom-status",
          element: <CustomOptions />,
        },
        {
          path: "/plans",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN", "ADMIN"]}>
              <ViewPlans />
            </RouteGuard>
          ),
        },
        {
          path: "/plans/editPlan/:id",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <AddPlan />
            </RouteGuard>
          ),
        },
        {
          path: "/plans/addPlan", // TODO: Remove Accessibility after Creating Static Plans
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <AddPlan />
            </RouteGuard>
          ),
        },

        {
          path: "/sidebarLinks",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <ViewSidebarLinks />
            </RouteGuard>
          ),
        },
        {
          path: "/sidebarLinks/addSidebarLink",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <CreateSidebarLink />
            </RouteGuard>
          ),
        },
        {
          path: "/update-landing-page",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <LandingPageForm />
            </RouteGuard>
          ),
        },
        {
          path: "/pabblyToken",
          element: <PabblyToken />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div className="">
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />;
    </div>
  );
};

export default App;
