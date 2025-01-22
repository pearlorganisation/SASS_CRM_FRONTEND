import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Badge,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserNotifications,
  resetUnseenCount,
} from "../../features/actions/notification";
import { useNavigate } from "react-router-dom";
import { NotifActionType } from "../../utils/extra";

const NotificationBell = ({ userData, roles }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const { employeeModeData } = useSelector((state) => state.employee);
  const { notifications, unseenCount } = useSelector(
    (state) => state.notification
  );

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    if (unseenCount > 0 && !employeeModeData) {
      dispatch(resetUnseenCount());
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
      dispatch(getUserNotifications({ id: employeeModeData ? employeeModeData?._id : userData?._id  }));
    }
  }, [userData, employeeModeData]);


  function handleClick(notif) {
    console.log(notif);
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
      const tabValue = notif?.metadata?.recordType || 'preWebinar';
      navigate(
        `/webinarDetails/${notif.metadata.webinarId}?tabValue=${tabValue}&page=1&subTabValue=reassignrequested`
      );
    }
  }

  return (
    <div className="sm:relative">
      <IconButton ref={bellRef} onClick={handleBellClick}>
        <Badge
          badgeContent={unseenCount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {isOpen && (
        <Box
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 p-4 bg-white shadow-lg rounded-lg border border-gray-200"
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <div className="flex justify-between">
            <Typography variant="h6" className="font-bold mb-2">
              Notifications
            </Typography>
            <div
              onClick={() => {
                navigate(`/notifications/${userData?._id}`)
                setIsOpen(false);
              }}
              className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
            >
              View All
            </div>
          </div>
          <Divider />
          <List>
            {notifications.map((notif) => (
              <ListItem key={notif._id} 
              onClick={() => handleClick(notif)}
              className="border-b cursor-pointer">
                <ListItemText
                  primary={notif?.title}
                  secondary={notif?.message}
                />
              </ListItem>
            ))}

            {notifications.length === 0 && (
              <div className="flex justify-center items-center">
                <p className="text-lg font-semibold text-gray-700">
                  No notifications found
                </p>
              </div>
            )}
          </List>
        </Box>
      )}
    </div>
  );
};

export default NotificationBell;
