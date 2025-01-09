import React, { useState } from "react";
import { IconButton, Badge, Box, Typography, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const notificationsData = [
  {
    id: 1,
    title: "New Task Assigned",
    message: "You have been assigned a new task by your admin.",
    isRead: false,
    type: "assignment"
  },
  {
    id: 2,
    title: "Task Reassigned",
    message: "Your task has been reassigned to a different employee.",
    isRead: true,
    type: "reassignment"
  },
  {
    id: 3,
    title: "User Inactivity",
    message: "You have been inactive for a while. Please take action.",
    isRead: false,
    type: "inactivity"
  }
];

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  return (
    <div className="sm:relative">
      {/* Bell Icon */}
      <IconButton onClick={handleBellClick}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Box */}
      {isOpen && (
        <Box
          className="absolute right-0 mt-2 w-80 p-4 bg-white shadow-lg rounded-lg border border-gray-200"
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <Typography variant="h6" className="font-bold mb-2">
            Notifications
          </Typography>
          <Divider className="mb-2" />
          <List>
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`cursor-pointer ${notif.isRead ? "bg-gray-100" : "bg-blue-50"}`}
              >
                <ListItemAvatar>
                  <Avatar className={`bg-${notif.type === 'assignment' ? 'green' : notif.type === 'reassignment' ? 'orange' : 'red'}-500`}>
                    {notif.title[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notif.title}
                  secondary={notif.message}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};

export default NotificationBell;
