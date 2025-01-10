import React, { useEffect, useState } from "react";
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
import { getUserNotifications, resetUnseenCount } from "../../features/actions/pabblyToken";

const NotificationBell = ({ userData }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, totalPages, unseenCount } = useSelector(
    (state) => state.pabblyToken
  );

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if(unseenCount  === 0) return 
    dispatch(resetUnseenCount());
  };

  const markAsRead = (id) => {};

  useEffect(() => {
    dispatch(getUserNotifications(userData?._id));
  }, []);

  return (
    <div className="sm:relative">
      {/* Bell Icon */}
      <IconButton onClick={handleBellClick}>
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

      {/* Notification Box */}
      {isOpen && (
        <Box
          className="absolute right-0 mt-2 w-96 p-4 bg-white shadow-lg rounded-lg border border-gray-200"
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <Typography variant="h6" className="font-bold mb-2">
            Notifications
          </Typography>
          <Divider />
          <List className=" h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={` border-b`}
              >
                <ListItemText primary={notif.title} secondary={notif.message} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};

export default NotificationBell;
