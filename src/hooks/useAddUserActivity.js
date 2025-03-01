import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  addUserActivity,
  sendInactiveNotification,
} from "../features/actions/userActivity";
import useRoles from "./useRoles";
import store from "../features/store";

// Shared state across all instances of the hook
const sharedState = {
  inactivityTimer: null,
  initialized: false,
};

const useAddUserActivity = () => {
  const roles = useRoles();
  const dispatch = useDispatch();

  const userData = store.getState()?.auth?.userData;
  const subscription = store.getState()?.auth?.subscription;
  const InactivityTimeInSeconds = userData?.inactivityTime || 10;
  const INACTIVITY_LIMIT = InactivityTimeInSeconds * 1000;

  const resetInactivityTimer = () => {

    const employeeInactivity = subscription?.plan?.employeeInactivity;

    if(!employeeInactivity) {
      console.log("employee inactivity is not allowed");
      return;
    }

    if (!roles.isEmployeeId("")) return;

    // Clear the existing timer
    if (sharedState.inactivityTimer) {
      clearTimeout(sharedState.inactivityTimer);
    }

    // Set a new timer
    sharedState.inactivityTimer = setTimeout(() => {
      console.log("User is inactive. Sending notification...");
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

  const logUserActivity = ({
    action,
    details,
    navigateType,
    type = "",
    detailItem,
    activityItem,
  }) => {
    let detailLog = "";

    if (action && details) {
      dispatch(addUserActivity({ action, details, item: activityItem }));
      resetInactivityTimer();
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
      case "note":
        detailLog = `User added a note to the ${type}: ${detailItem}`;
        break;
      case "setAlarm":
        detailLog = `User set an alarm for the ${type}: ${detailItem}`;
        break;
    }

    dispatch(addUserActivity({ action, details: detailLog, item: activityItem }));
    resetInactivityTimer();
  };

  useEffect(() => {
    if (!sharedState.initialized) {
      sharedState.initialized = true;
      resetInactivityTimer();
      console.log("Inactivity timer initialized.");
    }

    return () => {
      if (sharedState.inactivityTimer) {
        clearTimeout(sharedState.inactivityTimer);
        sharedState.inactivityTimer = null;
        sharedState.initialized = false;
      }
    };
  }, [roles, dispatch]);

  return logUserActivity;
};

export default useAddUserActivity;
