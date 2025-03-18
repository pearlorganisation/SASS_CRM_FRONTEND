import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getRoleNameByID } from "../../../utils/roles";
import { toggleSidebar } from "../../../features/slices/globalData";
import Profile from "./profile.svg";
import { setEmployeeModeId } from "../../../features/slices/employee";
import ComponentGuard from "../../AccessControl/ComponentGuard";
import useRoles from "../../../hooks/useRoles";
import NotificationBell from "../../Notification/NotificationBell";
import ImportExportNotifications from "../../Notification/ImportExportNotifications";
import { formatDateAsNumber } from "../../../utils/extra";
const Header = () => {
  const [expiryDays, setExpiryDays] = useState();
  const [showExpiryNotice, setShowExpiryNotice] = useState(true);
  const dispatch = useDispatch();
  const roles = useRoles();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const { userData, subscription } = useSelector((state) => state.auth);
  const { employeeModeData } = useSelector((state) => state.employee);

  useEffect(() => {
    if (subscription) {
      const expiryDate = new Date(subscription.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(expiryDate - currentDate);
      const diffDays = diffTime / (1000 * 3600 * 24);
      if (diffDays <= 15) {
        setExpiryDays(diffDays);
      }
    }
  }, [subscription]);

  const handleProfileClick = () => {
    // Navigate to the profile page
    navigate("/profile");
  };

  const onExit = () => {
    navigate("/");
    dispatch(setEmployeeModeId());
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full max-w-screen  bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                onClick={() => dispatch(toggleSidebar())}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="/" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                  SAAS APP
                </span>
              </Link>
            </div>

            <ComponentGuard
              allowedRoles={[roles.ADMIN]}
              conditions={[employeeModeData ? true : false]}
            >
              <div className="flex items-center gap-4 justify-between bg-gray-100 shadow-md py-1 px-3 rounded-md w-fit max-w-md">
                {/* Employee Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <p className="text-gray-600 font-medium">
                      {employeeModeData?.userName}
                    </p>
                    <p className="text-gray-500">{employeeModeData?.role}</p>
                  </div>
                </div>

                {/* Exit Button */}
                <button
                  onClick={onExit}
                  className="bg-red-500 text-white px-4 py-2 rounded font-medium text-sm"
                >
                  Exit
                </button>
              </div>
            </ComponentGuard>

            <ComponentGuard
              allowedRoles={[roles.ADMIN]}
              conditions={[
                expiryDays ? true : false,
                showExpiryNotice,
                userData?.isActive,
              ]}
            >
              <div className="bg-red-50 border hidden border-red-200 rounded-lg px-4 py-2 mx-4 lg:flex gap-2 justify-between items-center">
                <Link
                  to="/plans"
                  className="text-red-600 whitespace-nowrap hover:text-red-700"
                >
                  Plan expiring in {expiryDays && expiryDays} days on{" "}
                  {subscription &&
                    formatDateAsNumber(subscription?.expiryDate)}
                  , click to see plans.
                </Link>
                <button
                  onClick={() => setShowExpiryNotice(false)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close notification"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </ComponentGuard>

            <div className="flex items-center">
              <ComponentGuard allowedRoles={[roles.ADMIN, roles.SUPER_ADMIN]}>
                <ImportExportNotifications />
              </ComponentGuard>
              <NotificationBell
                important={true}
                userData={userData}
                roles={roles}
              />
              {/* {!roles.isSuperAdmin() && ( */}
              <NotificationBell
                important={false}
                userData={userData}
                roles={roles}
              />
              {/* )} */}

              <div
                className="flex items-center ms-3 cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-black">
                    <p className="font-medium">{userData?.userName}</p>
                    <p className="text-gray-400">
                      {getRoleNameByID(userData?.role)}
                    </p>
                  </div>
                  <div className="text-gray-500">
                    {/* Use img tag for SVG */}
                    <img
                      src={Profile}
                      alt="Profile"
                      className="min-w-10 w-10 min-h-10 h-10"
                      style={{ fill: "#525252" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ComponentGuard
        allowedRoles={[roles.ADMIN]}
        conditions={[
          expiryDays ? true : false,
          showExpiryNotice,
          userData?.isActive,
        ]}
      >
        <div className="bg-red-50 absolute top-20 left-1/2 -translate-x-1/2 z-50 border lg:hidden border-red-200 rounded-lg px-4 py-2 flex gap-2 justify-between items-center max-w-[90%]">
          <Link
            to="/plans"
            className="text-red-600 hover:text-red-700 flex flex-col"
          >
            <span className="font-medium whitespace-nowrap">
              Plan expiring in {expiryDays && expiryDays} days
            </span>
            <span className="text-sm whitespace-nowrap">
              on {subscription && formatDateAsNumber(subscription?.expiryDate)},
              click to see plans.
            </span>
          </Link>
          <button
            onClick={() => setShowExpiryNotice(false)}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </ComponentGuard>
    </>
  );
};

export default Header;
