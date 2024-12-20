import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUserActivity, sendInactiveUserEmail } from "../features/actions/userActivity";
import useRoles from "./useRoles";

const INACTIVITY_LIMIT = 10 * 1000; 

// Singleton state variables
let inactivityTimer = null;
let initialized = false;

// Singleton function to reset the timer
const resetInactivityTimer = (roles, dispatch) => {
  if (!roles.isEmployeeId("")) return;

  console.log('timer --->', inactivityTimer);
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  console.log("Resetting inactivity timer");

  inactivityTimer = setTimeout(() => {
    console.warn("User is inactive");
    dispatch(sendInactiveUserEmail());

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
      console.log("Initializing singleton inactivity tracker");
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
