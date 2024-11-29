import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

///// pages /////
import {
  Dashboard,
  Login,
  MeetingDetails,
  Layout,
  ComingSoon,
  NotFound,
  Employees,
  ViewParticularContact,
  ViewContacts,
  ViewProducts,
  CreateProduct,
  ViewAttendees,
  CreateEmployee,
  ViewSettings,
  ViewPlans,
  SignUp,
  AddPlan,
  ViewSidebarLinks,
  CreateSidebarLink,
  Assignments,
  Clients,
  EmployeeAssignments,
  LandingPageForm,
  EmployeeActivity,
  PabblyToken,
  CustomOptions,
  CreateClient,
  ViewClient,
  Profile
} from "./pages";
import { getEmployeeStats } from "./features/actions/employee";
import { addUserActivity } from "./features/actions/userActivity";
import { isEmployeeId } from "./utils/roles";
import { setIsEmployee } from "./features/slices/userActivity";
import RouteGuard from "./components/AccessControl/RouteGuard";
import { clearLoadingAndData, logout } from "./features/slices/auth";

const App = () => {
  const dispatch = useDispatch();

  const { isUserLoggedIn } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";
  if(isUserLoggedIn && !role) {
    dispatch(logout());
  }

  // console.log(
  //   "checking if user is logged in",
  //   isUserLoggedIn,
  //   userData
  // );
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
              <Clients />
          ),
        },
        {
          path: "/add-client",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <CreateClient />
            </RouteGuard>
          ),
        },
        {
          path: "/view-client/:id",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <ViewClient />
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
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN", "ADMIN"]}>
              <CustomOptions />
            </RouteGuard>
          ),
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
        {
          path: "/profile",
          element: <Profile />,
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
