import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoLogOut, IoPeople, IoSettings } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { SiGooglemeet } from "react-icons/si";
import { AiFillProduct } from "react-icons/ai";
import { MdAssignment } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // for dropdown icon
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/slices/auth";
import { getAllSidebarLinks } from "../../../features/actions/sidebarLink";
import { addUserActivity } from "../../../features/actions/userActivity";
import { roles } from "../../../utils/roles";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarLinkData } = useSelector((state) => state.sidebarLink);
  const { userData } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.globalData);
  const { isEmployee } = useSelector((state) => state.userActivity);
  const [showImportantLinks, setShowImportantLinks] = useState(false); // toggle state for sub-links
  const role = userData?.role || "";

  const navItems = [
    {
      roles: [roles.SUPER_ADMIN],
      items: [
        {
          path: "/clients",
          label: "Clients",
          icon: <IoPeople size={30} />,
        },
      ],
    },
    {
      roles: [roles.ADMIN],
      items: [
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
        {
          path: "/products",
          label: "Products",
          icon: <AiFillProduct size={30} />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    if (isEmployee) {
      dispatch(
        addUserActivity({
          action: "logout",
          details: "User logged out successfully",
        })
      );
    }
  };

  const toggleImportantLinks = () => {
    setShowImportantLinks((prev) => !prev);
  };

  const handleNavigation = (link) => {
    navigate(link);
    addUserActivityLog(link, "page");
  };

  const addUserActivityLog = (link, type) => {
    if (isEmployee) {
      dispatch(
        addUserActivity({
          action: "navigate",
          details: `User navigated to the ${type}: ${link}`,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getAllSidebarLinks());
  }, [dispatch]);

  return (
    <div
      id="logo-sidebar"
      className={`fixed top-0 left-0 w-64 h-screen z-10 pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 ${isSidebarOpen ? 'translate-x-0' : 'sm:translate-x-0'}`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {/* Dashboard Link */}
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
            >
              <TbLayoutDashboardFilled size={30} />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>

          {/* Render navigation items based on roles */}
          {navItems.map((navGroup, index) =>
            navGroup.roles.includes(role) &&
            navGroup.items.map((item, idx) => (
              <li key={`${index}-${idx}`}>
                <Link
                  to={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
                >
                  {item.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">{item.label}</span>
                </Link>
              </li>
            ))
          )}

          {/* Important Links Section */}
          <li>
            <div
              onClick={toggleImportantLinks}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group cursor-pointer"
            >
              <AiFillProduct size={30} />
              <span className="flex-1 ms-3 whitespace-nowrap">Important Links</span>
              {showImportantLinks ? (
                <FiChevronUp size={20} />
              ) : (
                <FiChevronDown size={20} />
              )}
            </div>

            {showImportantLinks &&
              Array.isArray(sidebarLinkData) &&
              sidebarLinkData.map((item, idx) => (
                <ul key={idx} className="pl-10 space-y-1">
                  <li>
                    <a
                      href={item?.link}
                      onClick={() => addUserActivityLog(item.title, "important link")}
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
          <li>
            <Link
              to="/settings"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
            >
              <IoSettings size={30} />
              <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
          </li>

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-red-600 hover:text-[17px] hover:bg-gray-100 group"
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
