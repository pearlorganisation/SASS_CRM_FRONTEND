import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { addUserActivity } from "../features/actions/userActivity";
import useRoles from "./useRoles";

const INACTIVITY_LIMIT = 10 * 1000; // 10 minutes in milliseconds
const useAddUserActivity = () => {
  const roles = useRoles();
  const dispatch = useDispatch();
  const inactivityTimer = useRef(null);

  const resetTimer = () => {
    console.log("resetting timers ----- > ", roles.isEmployeeId(""));
    if (!roles.isEmployeeId("")) return;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      console.warn("user is inactive");
    }, INACTIVITY_LIMIT);
  };

  const logUserActivity = ({
    action,
    details,
    navigateType,
    type ="",
    detailItem,
  }) => {
    let detailLog = "";

    if (action && details) {
      dispatch(addUserActivity({ action, details }));
      resetTimer();
      return;
    }

    switch (action) {
      case "navigate":
        detailLog = `User navigated to the ${navigateType}: ${detailItem}`;
        break;
      case "edit":
        detailLog = `User edited the ${type}: ${detailItem}`;
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
    resetTimer();
  };

  useEffect(() => {
    resetTimer(); // Start timer on initial load
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current); // Cleanup on unmount
      }
    };
  }, []);

  return logUserActivity;
};

export default useAddUserActivity;
