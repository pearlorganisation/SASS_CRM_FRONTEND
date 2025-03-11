import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  DashboardIcon,
  WebinarIcon,
  AttendeesIcon,
  EmployeeIcon,
  CalendarIcon,
  ProductsIcon,
  NoticeBoardIcon,
  LinksIcon,
  SettingsIcon,
  LogoutIcon,
  RupeeIcon,
  AssignmentIcon,
} from "./SVGs";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/slices/auth";
import { getAllSidebarLinks } from "../../../features/actions/sidebarLink";
import { getNoticeBoard } from "../../../features/actions/noticeBoard";
import useRoles from "../../../hooks/useRoles";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import ComponentGuard from "../../AccessControl/ComponentGuard";
const Sidebar = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();
  const location = useLocation();

  const { isUpdated } = useSelector((state) => state.noticeBoard);
  const { sidebarLinkData } = useSelector((state) => state.sidebarLink);
  const { userData, isUserLoggedIn, subscription } = useSelector(
    (state) => state.auth
  );
  const calendarFeatures = subscription?.plan?.calendarFeatures;
  const { isSidebarOpen } = useSelector((state) => state.globalData);
  const [showImportantLinks, setShowImportantLinks] = useState(false); // toggle state for sub-links
  const role = userData?.role || "";
  const { employeeModeData } = useSelector((state) => state.employee);

  const navItems = [
    {
      roles: [roles.SUPER_ADMIN],
      items: [
        {
          path: "/clients",
          label: "Clients",
          icon: <img src={EmployeeIcon} width={30} height={30} alt="Clients" />,
          children: ["view-client", "add-client", "client/plan/"],
        },
        {
          path: "/revenue",
          label: "Revenue",
          icon: <img src={RupeeIcon} width={30} height={30} alt="Revenue" />,
        },
      ],
    },
    {
      roles: [roles.ADMIN],
      items: employeeModeData
        ? [
            {
              path: `/employee/dashboard/${employeeModeData?._id}`,
              label: "Dashboard",
              icon: <img src={DashboardIcon} width={30} height={30} alt="Dashboard" />,
            },
            {
              path: `/employee/assignments/${employeeModeData?._id}`,
              label: "Assignments",
              icon: <img src={AssignmentIcon} width={30} height={30} alt="Assignment" />,
            },
          ]
        : [
            {
              path: "/webinarDetails",
              label: "Webinars",
              icon: (
                <img src={WebinarIcon} width={30} height={30} alt="Webinar" />
              ),
              children: ["webinarDetails", "assignment-metrics"],
            },
            {
              path: "/attendees",
              label: "Attendees",
              icon: (
                <img
                  src={AttendeesIcon}
                  width={30}
                  height={30}
                  alt="Attendees"
                />
              ),
              children: ["particularContact"],
            },
            {
              path: "/employees",
              label: "Employees",
              icon: (
                <img src={EmployeeIcon} width={30} height={30} alt="Employee" />
              ),
              children: ["employees", "employee", "createEmployee"],
            },
          ],
    },
    {
      roles: [roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER],
      items: [
        {
          path: "/assignments",
          label: "Assignments",
          icon: <img src={AssignmentIcon} width={30} height={30} alt="Assignment" />,
          children: ["assignments", "assignment-metrics"],
        },
      ],
    },
    {
      roles: [roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER, roles.ADMIN],
      items: [
        ...(calendarFeatures
          ? [
              {
                path: "/calendar",
                label: "Calendar",
                icon: (
                  <img
                    src={CalendarIcon}
                    width={30}
                    height={30}
                    alt="Calendar"
                  />
                ),
              },
            ]
          : []),
        {
          path: "/products",
          label: "Products",
          icon: (
            <img src={ProductsIcon} width={30} height={30} alt="Products" />
          ),
          children: ["products"],
        },

        {
          path: "/notice-board",
          label: "Notice Board",
          icon: (
            <img
              src={NoticeBoardIcon}
              width={30}
              height={30}
              alt="Notice Board"
            />
          ),
          children: ["notice-board"],
        },
      ],
    },
  ];


  const handleLogout = () => {
    dispatch(logout());
    logUserActivity({
      action: "logout",
      details: "User logged out successfully",
    });
  };


  const toggleImportantLinks = () => {
    setShowImportantLinks((prev) => !prev);
  };

  const handleNavigation = (link) => {
    addUserActivityLog(link, "page");
  };

  const addUserActivityLog = (link, type) => {
    logUserActivity({
      action: "navigate",
      detailItem: link,
      navigateType: type,
    });
  };

  useEffect(() => {
    if (userData) dispatch(getAllSidebarLinks());
  }, []);

  useEffect(() => {
    let interval;
    if (role && isUserLoggedIn && roles.isEmployeeId(role)) {
      interval = setInterval(() => {
        dispatch(getNoticeBoard());
      }, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [roles, role]);

  const isActiveRoute = (item) => {
    if (location.pathname === item.path) return true;

    // Check if the current path starts with any children paths
    if (Array.isArray(item.children)) {
      return item.children.some((child) =>
        location.pathname.startsWith(`/${child}`)
      );
    }

    return false;
  };

  return (
    <div
      id="logo-sidebar"
      className={`fixed top-0 left-0 w-64 h-screen z-20 pt-20 transition-transform ease-in-out duration-700  -translate-x-full bg-white border-r border-gray-200 ${
        isSidebarOpen ? "translate-x-0" : ""
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {/* Dashboard Link */}
          {!employeeModeData && (
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                  location.pathname === "/" ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={DashboardIcon}
                  width={30}
                  height={30}
                  alt="Dashboard"
                />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
          )}

          {/* Render navigation items based on roles */}
          {navItems.map(
            (navGroup, index) =>
              navGroup.roles.includes(role) &&
              navGroup.items.map((item, idx) => (
                <li key={`${index}-${idx}`}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      isActiveRoute(item) ? "bg-gray-100" : ""
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {item.label}{" "}
                      {item.label === "Notice Board" && isUpdated && (
                        <div className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800">
                          New
                        </div>
                      )}
                    </span>
                  </Link>
                </li>
              ))
          )}

          {/* Important Links Section */}
          <li>
            <div
              onClick={toggleImportantLinks}
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group cursor-pointer"
            >
              <img src={LinksIcon} width={25} height={25} alt="Links" />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Important Links
              </span>
              {showImportantLinks ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              )}
            </div>

            {showImportantLinks &&
              Array.isArray(sidebarLinkData) &&
              sidebarLinkData.map((item, idx) => (
                <ul key={idx} className="pl-10 space-y-1 ">
                  <li>
                    <a
                      href={item?.link}
                      onClick={() =>
                        addUserActivityLog(item.title, "important link")
                      }
                      target="_blank" // Opens the link in a new tab
                      rel="noopener noreferrer" // Security measure to prevent tab nabbing
                      className="flex items-center p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      {item.title}
                    </a>
                  </li>
                </ul>
              ))}
          </li>

          {/* Settings Link */}
          <ComponentGuard conditions={[employeeModeData ? false : true]}>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                  isActiveRoute({
                    path: "settings",
                    children: [
                      "plans",
                      "addons",
                      "pabblyToken",
                      "settings",
                      "sidebarLinks",
                      "update-landing-page",
                      "product-level",
                      "lead-type",
                      "billing-history",
                      "tags",
                    ],
                  })
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <img src={SettingsIcon} width={30} height={30} alt="Settings" />
                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </Link>
            </li>
          </ComponentGuard>

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-900 rounded-lg text-start hover:text-red-600 w-full  hover:bg-gray-100 group"
            >
              <img src={LogoutIcon} width={30} height={30} alt="Logout" />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
