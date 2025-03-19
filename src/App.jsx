import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { toast, Toaster } from "sonner";
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
  ViewProducts,
  CreateProduct,
  ViewAttendees,
  CreateEmployee,
  ViewSettings,
  ViewPlans,
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
  NotesPage,
  AttendeeHistory,
  CalendarPage,
  AddOnsPage,
  ViewEmployee,
  LeadTypes,
  EmployeeDashboard,
  UpdateNoticeBoard,
  NoticeBoard,
  MyAddOns,
  Notifications,
  BillingHistory,
  PlanOrder,
  UpdateClientPlan,
  Revenue,
  ProductLevel,
  ManageTags,
  Locations,
  ProductRevenue,
  ProductEnrollments,
  UserDownloads,
  EmployeeAssignMetrics,
} from "./pages";
import RouteGuard from "./components/AccessControl/RouteGuard";

import {
  getAllRoles,
  getCurrentUser,
  getUserSubscription,
} from "./features/actions/auth";
// import { getNoticeBoard } from "./features/actions/noticeBoard";
import useRoles from "./hooks/useRoles";
import useAddUserActivity from "./hooks/useAddUserActivity";

import { socket } from "./socket";
const AlarmBanner = lazy(() => import("./components/AlarmBanner"));

import alarm from "/alarm.wav";
import { setEmployeeModeId } from "./features/slices/employee";

import { resetAlarmData } from "./features/slices/alarm";
import { newNotification } from "./features/slices/notification";
import { NotifActionType } from "./utils/extra";
import { logout } from "./features/slices/auth";
import LayoutFallback from "./components/Fallback/LayoutFallback";

const App = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();
  const { userData, isUserLoggedIn, subscription } = useSelector(
    (state) => state.auth
  );
  const calendarFeatures = subscription?.plan?.calendarFeatures;
  const productRevenueMetrics = subscription?.plan?.productRevenueMetrics;
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};
  const isCustomStatusEnabled = tableConfig?.isCustomOptionsAllowed || false;
  const assignmentMetrics = subscription?.plan?.assignmentMetrics || false;

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const audioRef = useRef(new Audio(alarm));


  const closeBanner = () => {
    audioRef.current.pause();
    audioRef.current.loop = false;
    audioRef.current.currentTime = 0;
    setBannerOpen(false);
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAlarmPlay(data) {
      const audio = audioRef.current;
      audio.loop = true; // Enable looping
      audio.play().catch((err) => console.error("Audio play error:", err)); // Handle potential play errors
      setBannerOpen(true);
      setBannerData(data);
      dispatch(resetAlarmData());
    }

    function onNotification(data) {
      dispatch(newNotification(data));
      toast.info(data.title || "New Notification");
      if (data.actionType === NotifActionType.ACCOUNT_DEACTIVATION) {
        dispatch(logout());
      }
    }

    function onReminderPlay(data) {}

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("playAlarm", onAlarmPlay);
    socket.on("notification", onNotification);
    socket.on("playReminder", onReminderPlay);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("playAlarm", onAlarmPlay);
      socket.off("notification", onNotification);
      socket.off("playReminder", onReminderPlay);
    };
  }, []);

  useEffect(() => {
    if (isConnected && userData) {
      socket.emit("join", { user: userData._id });
    }

    if (!userData & isConnected) {
      socket.disconnect();
    }
  }, [userData, isConnected]);

  if (isUserLoggedIn && !userData?.role) {
    dispatch(logout());
  }

  useEffect(() => {
    dispatch(setEmployeeModeId());

    if (isUserLoggedIn) {
      socket.connect();
    }

    function initFunctions() {
      if (isUserLoggedIn && userData?.role) {
        console.log("fetching subscription")
        // && !roles.isEmployeeId(role) removed this from the condition
        dispatch(getUserSubscription());
        dispatch(getAllRoles());
      }
    }
    initFunctions();


  }, [userData, isUserLoggedIn]);


  useEffect(() => {
    if (isUserLoggedIn && userData?.role && subscription?.plan) {
      logUserActivity({
        action: "login/refresh",
        details: "User logged in or refreshed successfully",
      });
    }
  }, [userData, isUserLoggedIn, subscription]);


  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isUserLoggedIn ? (
        <Suspense fallback={<LayoutFallback />}>
          <Layout />
        </Suspense>
      ) : (
        <Navigate to="/login" replace />
      ),
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
          path: "/particularContact/notes",
          element: <NotesPage />,
        },

        {
          path: "/particularContact/attendee-history",
          element: <AttendeeHistory />,
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
          path: "/revenue",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <Revenue />
            </RouteGuard>
          ),
        },
        {
          path: "/assignment-metrics",
          element: (
            <RouteGuard
              conditions={[assignmentMetrics]}
              roleNames={["EMPLOYEE_SALES", "EMPLOYEE_REMINDER", "ADMIN"]}
            >
              <EmployeeAssignMetrics />
            </RouteGuard>
          ),
        },
        {
          path: "/product-revenue",
          element: (
            <RouteGuard
              conditions={[productRevenueMetrics]}
              roleNames={["ADMIN"]}
            >
              <ProductRevenue />
            </RouteGuard>
          ),
        },
        {
          path: "/product-enrollments",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <ProductEnrollments />
            </RouteGuard>
          ),
        },

        {
          path: "/*",
          element: <ComingSoon />,
        },

        {
          path: "/product-level",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <ProductLevel />
            </RouteGuard>
          ),
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
          path: "/client/plan/:id",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <UpdateClientPlan />
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
          path: "/notifications/:userId",
          element: <Notifications />,
        },
        {
          path: "/user-downloads",
          element: (
            <RouteGuard roleNames={["ADMIN", "SUPER_ADMIN"]}>
              <UserDownloads />
            </RouteGuard>
          ),
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
          path: "/calendar",
          element: (
            <RouteGuard
              conditions={[calendarFeatures]}
              roleNames={["EMPLOYEE_SALES", "EMPLOYEE_REMINDER", "ADMIN"]}
            >
              <CalendarPage />
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
            <RouteGuard
              conditions={[isCustomStatusEnabled || roles.isSuperAdmin()]}
              roleNames={["SUPER_ADMIN", "ADMIN"]}
            >
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
          path: "/addons",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN", "ADMIN"]}>
              <AddOnsPage />
            </RouteGuard>
          ),
        },
        {
          path: "/addons/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <MyAddOns />
            </RouteGuard>
          ),
        },
        {
          path: "/billing-history",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <BillingHistory />
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
          path: "/plans/order",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN"]}>
              <PlanOrder />
            </RouteGuard>
          ),
        },
        {
          path: "/plans/addPlan",
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
          path: "employee/dashboard/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <EmployeeDashboard />
            </RouteGuard>
          ),
        },
        {
          path: "employee/assignments/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <Assignments />
            </RouteGuard>
          ),
        },
        {
          path: "employee/products/:id",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <UpdateNoticeBoard />
            </RouteGuard>
          ),
        },
        {
          path: "/notice-board",
          element: <NoticeBoard />,
        },

        {
          path: "/locations",
          element: <Locations />,
        },

        {
          path: "/locations/requests",
          element: (
            <RouteGuard roleNames={["SUPER_ADMIN", "ADMIN"]}>
              <Locations />
            </RouteGuard>
          ),
        },
        {
          path: "/tags",
          element: (
            <RouteGuard roleNames={["ADMIN"]}>
              <ManageTags />
            </RouteGuard>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: !isUserLoggedIn ? (
        <Suspense fallback={<></>}>
          {" "}
          <Login />
        </Suspense>
      ) : (
        <Navigate to="/" replace />
      ),
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
      {bannerOpen && (
        <Suspense fallback={<></>}>
          <AlarmBanner bannerData={bannerData} closeBanner={closeBanner} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
