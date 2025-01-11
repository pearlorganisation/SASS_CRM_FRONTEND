import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  addUserActivity,
  sendInactiveNotification,
} from "../features/actions/userActivity";
import useRoles from "./useRoles";
import store from "../features/store";

const userData = store.getState()?.auth?.userData;
const InactivityTimeInSeconds = userData?.inactivityTime || 600;
const INACTIVITY_LIMIT = InactivityTimeInSeconds * 1000;
console.log("INACTIVITY_LIMIT in ms ------ > ", INACTIVITY_LIMIT);

// Singleton state variables
let inactivityTimer = null;
let initialized = false;

// Singleton function to reset the timer
const resetInactivityTimer = (roles, dispatch) => {
  if (!roles.isEmployeeId("")) return;

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = setTimeout(() => {
    dispatch(
      sendInactiveNotification({
        userName: userData?.userName,
        email: userData?.email,
        userId: userData?._id,
      })
    );

    dispatch(
      addUserActivity({ action: "inactive", details: "User is inactive" })
    );
  }, INACTIVITY_LIMIT);
};

const useAddUserActivity = () => {
  const roles = useRoles();
  const dispatch = useDispatch();

  const logUserActivity = ({
    action,
    details,
    navigateType,
    type = "",
    detailItem,
  }) => {
    let detailLog = "";

    if (action && details) {
      dispatch(addUserActivity({ action, details }));
      resetInactivityTimer(roles, dispatch);
      return;
    }

    switch (action) {
      case "navigate":
        detailLog = `User navigated to the ${navigateType}: ${detailItem}`;
        break;
      case "edit":
        detailLog = `User edited the ${type}: ${detailItem}`;
        break;
      case "update":
        detailLog = `User updated the ${type}: ${detailItem}`;
        break;
      case "create":
        detailLog = `User created the ${type}: ${detailItem}`;
        break;
      case "delete":
        detailLog = `User deleted the ${type}: ${detailItem}`;
        break;
      case "import":
        detailLog = `User imported the ${type}: ${detailItem}`;
        break;
      case "switch":
        detailLog = `User switched to the ${type}: ${detailItem}`;
        break;
      case "filter":
        detailLog = `User applied filter ${type}: ${detailItem}`;
        break;
    }

    dispatch(addUserActivity({ action, details: detailLog }));
    resetInactivityTimer(roles, dispatch);
  };

  useEffect(() => {
    if (!initialized) {
      initialized = true;
      resetInactivityTimer(roles, dispatch);
    }

    return () => {
      if (initialized && inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
        initialized = false;
      }
    };
  }, [roles, dispatch]);

  return logUserActivity;
};

export default useAddUserActivity;
