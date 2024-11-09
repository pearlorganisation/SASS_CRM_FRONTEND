import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoLogOut } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { IoPeople } from "react-icons/io5";
import { SiGooglemeet } from "react-icons/si";
import { AiFillProduct } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/slices/auth";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // for dropdown icon
import { getAllSidebarLinks } from "../../../features/actions/sidebarLink";
import { roles } from "../../../utils/roles";
import { MdAssignment } from "react-icons/md";
import { addUserActivity } from "../../../features/actions/userActivity";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarLinkData, isLoading } = useSelector(
    (state) => state.sidebarLink
  );
  const { role } = useSelector((state) => state.auth.userData);
  const { isEmployee } = useSelector((state) => state.userActivity);
  const [showImportantLinks, setShowImportantLinks] = useState(false); // toggle state for sub-links

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

  useEffect(() => {
    dispatch(getAllSidebarLinks());
  }, []);

  const handleNavigation = (link) => {
    navigate(link);
    addUserActivityLog(link, "page")
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

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
            >
              <TbLayoutDashboardFilled size={30} />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          {roles.SUPER_ADMIN === role && (
            <li>
              <Link
                to="/clients"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
              >
                <IoPeople size={30} />
                <span className="flex-1 ms-3 whitespace-nowrap">Clients</span>
              </Link>
            </li>
          )}
          {roles.ADMIN === role && (
            <>
              <li>
                <Link
                  to="/webinarDetails"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
                >
                  <SiGooglemeet size={30} />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Webinars
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/attendees"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
                >
                  <HiUserGroup size={30} />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Attendees
                  </span>
                </Link>
              </li>
            </>
          )}

          {(roles.EMPLOYEE_SALES === role ||
            roles.EMPLOYEE_REMINDER === role) && (
            <li>
              <div
                onClick={() => handleNavigation("/assignments")}
                className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
              >
                <MdAssignment size={30} />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Assignments
                </span>
              </div>
            </li>
          )}

          {roles.ADMIN === role && (
            <li>
              <Link
                to="/employees"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
              >
                <IoPeople size={30} />
                <span className="flex-1 ms-3 whitespace-nowrap">Employees</span>
              </Link>
            </li>
          )}
          {(roles.ADMIN === role ||
            roles.EMPLOYEE_SALES === role ||
            roles.EMPLOYEE_REMINDER === role) && (
            <li>
              <div
                onClick={() => handleNavigation("/products")}
                className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
              >
                <AiFillProduct size={30} />
                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
              </div>
            </li>
          )}

          {/* Important Links section with subtitles */}
          <li>
            <div
              onClick={toggleImportantLinks}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group cursor-pointer"
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
                <ul className="pl-10 space-y-1">
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

          <li>
            <Link
              to="/settings"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:text-[17px] hover:bg-gray-100 group"
            >
              <IoSettings size={30} />
              <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
          </li>

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
    </aside>
  );
};

export default Sidebar;
