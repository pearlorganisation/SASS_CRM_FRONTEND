import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import {
  getUserNotifications,
  resetUnseenCount,
} from "../../features/actions/notification";
import { useNavigate } from "react-router-dom";
import { NotifActionType } from "../../utils/extra";
import LinearProgressWithLabel from "../Export/LinearProgressWithLabel";

const NotificationBell = ({ userData, roles, important }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const { employeeModeData } = useSelector((state) => state.employee);
  const { notifications, unseenCount, _notifications, _unseenCount } =
    useSelector((state) => state.notification);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    if ((important ? unseenCount : _unseenCount) > 0 && !employeeModeData) {
      dispatch(resetUnseenCount(important));
    }
  };

  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      bellRef.current &&
      !bellRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (userData?._id) {
      dispatch(
        getUserNotifications({
          id: employeeModeData ? employeeModeData?._id : userData?._id,
          important,
        })
      );
    }
  }, [userData, employeeModeData]);

  function handleClick(notif) {
    // console.log(notif);
    setIsOpen(false);
    const role = userData?.role;
    const isEmployee = roles.isEmployeeId(role);

    if (isEmployee) {
      if (
        notif.actionType === NotifActionType.WEBINAR_ASSIGNMENT ||
        notif.actionType === NotifActionType.ASSIGNMENT ||
        notif.actionType === NotifActionType.REASSIGNMENT
      ) {
        if (notif.metadata?.webinarId) {
          navigate(`/assignments?webinarId=${notif.metadata.webinarId}`);
        }
      }

      return;
    }

    if (notif.actionType === NotifActionType.USER_ACTIVITY) {
      navigate(
        `/employee/view/${notif?.metadata?.userId}?page=1&tabValue=activityLogs`
      );
    }

    if (notif.actionType === NotifActionType.REASSIGNMENT) {
      if (!notif?.metadata?.webinarId) return;
      const tabValue = notif?.metadata?.recordType || "preWebinar";
      navigate(
        `/webinarDetails/${notif.metadata.webinarId}?tabValue=${tabValue}&page=1&subTabValue=reassignrequested`
      );
    }
  }

  return (
    <div className="sm:relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <div className="relative">
          {important ? (
            <>
              <MessageIcon className="text-gray-600" />
              {unseenCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unseenCount}
                </span>
              )}
            </>
          ) : (
            <>
              <NotificationsIcon className="text-gray-600" />
              {_unseenCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {_unseenCount}
                </span>
              )}
            </>
          )}
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Notifications</h3>
              <button
                onClick={() => {
                  navigate(
                    `/notifications/${userData?._id}?important=${important}`
                  );
                  setIsOpen(false);
                }}
                className="text-gray-500 hover:text-gray-900 hover:underline"
              >
                View All
              </button>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="divide-y">
              {(important ? notifications : _notifications).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{notif?.title}</div>
                  <p className="text-gray-600 text-sm">{notif?.message}</p>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {new Date(notif?.createdAt).toLocaleDateString()} •{" "}
                    {new Date(notif?.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}

              {(important ? notifications : _notifications).length === 0 && (
                <div className="p-4 text-center text-gray-700">
                  No notifications found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
