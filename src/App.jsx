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
  LandingPageForm,
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
import ViewEmployee from "./pages/Employees/ViewEmployee";
import LeadTypes from "./pages/Settings/LeadType/ManageLeadTypes";

const App = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { userData, isUserLoggedIn } = useSelector((state) => state.auth);

  if (isUserLoggedIn && !userData?.role) {
    dispatch(logout());
  }

  useEffect(() => {
    function initFunctions() {
      if (isUserLoggedIn && userData?.role) {
        // && !roles.isEmployeeId(role) removed this from the condition
        dispatch(getUserSubscription());
        dispatch(getAllRoles());
      }
    }
    initFunctions();

    if (isUserLoggedIn && userData?.role) {
      logUserActivity({
        action: "login/refresh",
        details: "User logged in or refreshed successfully",
      });
    }
  }, [userData, isUserLoggedIn]);

  useEffect(() => {
    dispatch(getCurrentUser());
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
          path: "/lead-type",
          element: <LeadTypes />,
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
          path: "/employee/view/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <ViewEmployee />
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
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
