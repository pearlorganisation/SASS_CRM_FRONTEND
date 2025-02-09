import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TbLayoutDashboardFilled, TbReceiptRupee } from "react-icons/tb";
import { IoLogOut, IoPeople, IoSettings } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { SiGooglemeet } from "react-icons/si";
import { AiFillProduct } from "react-icons/ai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // for dropdown icon
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/slices/auth";
import { getAllSidebarLinks } from "../../../features/actions/sidebarLink";
import { FaClipboard } from "react-icons/fa";
import { Badge, Chip } from "@mui/material";
import { getNoticeBoard } from "../../../features/actions/noticeBoard";
import useRoles from "../../../hooks/useRoles";
import { MdAssignment } from "react-icons/md";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import { FaCalendarAlt } from "react-icons/fa";
import ComponentGuard from "../../AccessControl/ComponentGuard";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();
  const [searchParams, setSearchParams] = useSearchParams();


  const { isUpdated } = useSelector((state) => state.noticeBoard);
  const { sidebarLinkData } = useSelector((state) => state.sidebarLink);
  const { userData, isUserLoggedIn } = useSelector((state) => state.auth);
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
          icon: <IoPeople size={30} />,
        },
        {
          path: "/revenue",
          label: "Revenue",
          icon: <TbReceiptRupee  size={30} />,
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
              icon: <TbLayoutDashboardFilled size={30} />,
            },
            {
              path: `/employee/assignments/${employeeModeData?._id}`,
              label: "Assignments",
              icon: <MdAssignment size={30} />,
            },
          ]
        : [
            {
              path: "/webinarDetails",
              label: "Webinars",
              icon: <SiGooglemeet size={30} />,
            },
            {
              path: "/attendees",
              label: "Attendees",
              icon: <HiUserGroup size={30} />,
            },
            {
              path: "/employees",
              label: "Employees",
              icon: <IoPeople size={30} />,
            },
          ],
    },
    {
      roles: [roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER],
      items: [
        {
          path: "/assignments",
          label: "Assignments",
          icon: <MdAssignment size={30} />,
        },
      ],
    },
    {
      roles: [roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER, roles.ADMIN],
      items: [
        {
          path: "/calendar",
          label: "Calendar",
          icon: <FaCalendarAlt size={30} />,
        },
        {
          path: "/products",
          label: "Products",
          icon: <AiFillProduct size={30} />,
        },
        {
          path: "/notice-board",
          label: "Notice Board",
          icon: <FaClipboard size={25} />,
        },
      ],
    },
  ];

  
  // useEffect(() => {
  //   const handlePopState = (event) => {
  //     const currentPath = window.location.pathname;
  //     const referrer = document.referrer;
  //     console.log(referrer);

  //     console.log(referrer.includes(window.location.host));
  //     // Check if coming from external page
  //     if (referrer.includes(window.location.host)) {
  //     navigate(-1);
  //       return;
  //     }

  //     // Check if previous state was same route
  //     if (event.state?.route === currentPath) {
  //       // Go back further in history
  //       window.history.go(-2);
  //     }
  //   };

  //   window.addEventListener('popstate', handlePopState);
    
  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [navigate]);

  const handleLogout = () => {
    dispatch(logout());
    logUserActivity({
      action: "logout",
      details: "User logged out successfully",
    });
  };

  // const handleParamUpdate = (newParams) => {
  //   const searchParams = new URLSearchParams(newParams);
  //   window.history.replaceState(
  //     { route: window.location.pathname }, 
  //     '', 
  //     `?${searchParams.toString()}`
  //   );
  //   setSearchParams(searchParams);
  // };

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
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group"
              >
                <TbLayoutDashboardFilled size={30} />
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
                    className={`flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group`}
                  >
                    {item.icon}
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {item.label}{" "}
                      {item.label === "Notice Board" && isUpdated && (
                        <Chip color="secondary" label="New" />
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
              <AiFillProduct size={30} />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Important Links
              </span>
              {showImportantLinks ? (
                <FiChevronUp size={20} />
              ) : (
                <FiChevronDown size={20} />
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
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group"
              >
                <IoSettings size={30} />
                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </Link>
            </li>
          </ComponentGuard>

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-red-600  hover:bg-gray-100 group"
            >
              <IoLogOut size={30} />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
