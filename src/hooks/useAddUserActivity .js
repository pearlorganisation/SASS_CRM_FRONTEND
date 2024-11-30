// utils/addUserActivity.js

import { useDispatch } from "react-redux";
import { addUserActivity } from "../features/actions/userActivity";

const useAddUserActivity = () => {
  const dispatch = useDispatch();

  const logUserActivity = ({ action, details, navigateType, detailItem }) => {
    let detailLog = "";

    if (details) {
      dispatch(addUserActivity({ action, details }));
      return;
    }

    switch (action) {
      case "navigate":
        detailLog = `User navigated to the ${navigateType}: ${detailItem}`;
        break;
    }

    dispatch(addUserActivity({ action, details: detailLog }));
  };

  return logUserActivity;
};

export default useAddUserActivity;
