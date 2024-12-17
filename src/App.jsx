import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

///// pages /////
import {
  Dashboard,
  Login,
  Webinar,
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
  Profile,
  WebinarAttendees,
} from "./pages";
import RouteGuard from "./components/AccessControl/RouteGuard";
import {
  getAllRoles,
  getCurrentUser,
  getUserSubscription,
} from "./features/actions/auth";
import UpdateNoticeBoard from "./pages/NoticeBoard/UpdateNoticeBoard";
import NoticeBoard from "./pages/NoticeBoard/NoticeBoard";
import { getNoticeBoard } from "./features/actions/noticeBoard";
import useRoles from "./hooks/useRoles";
import useAddUserActivity from "./hooks/useAddUserActivity";

const App = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { userData, isUserLoggedIn } = useSelector((state) => state.auth);
  const role = userData?.role || "";
  if (isUserLoggedIn && !role) {
    dispatch(logout());
  }

  useEffect(() => {
    function initFunctions() {
      dispatch(getCurrentUser());
      console.log(" isEmployee --->> ", roles.isEmployeeId(role));
      if (isUserLoggedIn && role && !roles.isEmployeeId(role)) {
        dispatch(getUserSubscription());
        dispatch(getAllRoles());
      }
    }
    initFunctions();

    if (isUserLoggedIn && role) {
      logUserActivity({
        action: "login/refresh",
        details: "User logged in or refreshed successfully",
      });
    }
  }, []);

  // dispatch(clearLoadingAndData())

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
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <Webinar />
            </RouteGuard>
          ),
        },
        {
          path: "/webinarDetails/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <WebinarAttendees />
            </RouteGuard>
          ),
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
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <Employees />
            </RouteGuard>
          ),
        },
        {
          path: "/employee/edit/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <CreateEmployee />
            </RouteGuard>
          ),
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
          element: (
            <RouteGuard roleNames={["EMPLOYEE_SALES", "EMPLOYEE_REMINDER"]}>
              <Assignments />
            </RouteGuard>
          ),
        },
        {
          path: "/products/addProduct",
          element: <CreateProduct />,
        },
        {
          path: "/attendees",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <ViewAttendees />
            </RouteGuard>
          ),
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
        {
          path: "/notice-board/update",
          element: (
            <RouteGuard roleNames={["ADMIN", "SUPER_ADMIN"]}>
              <UpdateNoticeBoard />
            </RouteGuard>
          ),
        },
        {
          path: "/notice-board",
          element: <NoticeBoard />,
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
