import { toast } from "sonner";



export const DateFormat = {
  DD_MM_YYYY: "dd-MM-yyyy",
  MM_DD_YYYY: "MM-dd-yyyy",
  YYYY_MM_DD: "yyyy-MM-dd",
};

let store;
export const injectStoreInDateFormat = (_store) => {
  store = _store;
};

/**
 * This function is used by multiple pages/components to format the date and time
 * in a readable format.
 */

export const formatDate = (dateStr) => {

  return formatDateAsNumberWithTime(dateStr);
}

export const formatDateAsNumber = (dateStr) => {

const dateFormat = store?.getState()?.auth?.userData?.dateFormat || DateFormat.MM_DD_YYYY;

  if (!dateStr) return "-";
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "-";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  if (dateFormat === DateFormat.DD_MM_YYYY) {
    return `${day}/${month}/${year}`;
  } else if (dateFormat === DateFormat.MM_DD_YYYY) {
    return `${month}/${day}/${year}`;
  } else if (dateFormat === DateFormat.YYYY_MM_DD) {
    return `${year}/${month}/${day}`;
  }
};

export const formatDateAsNumberWithTime = (
  dateStr
) => {


const dateFormat = store?.getState()?.auth?.userData?.dateFormat || DateFormat.MM_DD_YYYY;

  if (!dateStr) return "-";
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "-";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  let formattedDate = "";

  if (dateFormat === DateFormat.DD_MM_YYYY) {
    formattedDate = `${day}/${month}/${year}`;
  } else if (dateFormat === DateFormat.MM_DD_YYYY) {
    formattedDate = `${month}/${day}/${year}`;
  } else if (dateFormat === DateFormat.YYYY_MM_DD) {
    formattedDate = `${year}/${month}/${day}`;
  }

  return `${formattedDate} ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  if (phoneNumber.includes("E")) {
    return Number(phoneNumber).toFixed(0);
  }
  const cleanedPhoneNumber = phoneNumber.toString().replace(/[^0-9]/g, "");
  if (cleanedPhoneNumber.length === 12) return cleanedPhoneNumber.slice(2);
  return cleanedPhoneNumber;
};

export const errorToast = (message) => {
  let errorMessage = "";
  errorMessage = typeof message === "string" ? message : "Something went wrong";

  if (
    Array.isArray(message) &&
    message.length > 0 &&
    typeof message[0] === "string"
  ) {
    errorMessage = message[0];
  }
  toast.dismiss();
  toast.error(errorMessage, {
    position: "top-center",
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

export const successToast = (message) => {
  let successMessage = "";
  successMessage = typeof message === "string" ? message : "Successful";

  // if (
  //   Array.isArray(message) &&
  //   message.length > 0 &&
  //   typeof message[0] === "string"
  // ) {
  //   errorMessage = message[0];
  // }
  toast.dismiss();
  toast.success(successMessage, {
    position: "top-center",
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export function filterTruthyValues(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const filteredObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value instanceof Date) {
        if (!isNaN(value.getTime())) {
          filteredObj[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        const nestedFiltered = filterTruthyValues(value);
        if (Object.keys(nestedFiltered).length > 0 || Array.isArray(value)) {
          filteredObj[key] = nestedFiltered;
        }
      } else if (
        value !== undefined &&
        value !== null &&
        value !== false &&
        value !== ""
      ) {
        filteredObj[key] = value;
      }
    }
  }

  return filteredObj;
}

export const AssignmentStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  COMPLETED: "completed",
  REASSIGN_REQUESTED: "reassignrequested",
  REASSIGN_APPROVED: "reassignapproved",
};

export const NotifActionType = {
  REASSIGNMENT: "reassignment",
  ASSIGNMENT: "assignment",
  USER_ACTIVITY: "user_activity",
  WEBINAR_ASSIGNMENT: "webinar_assignment",
  ACCOUNT_DEACTIVATION: "account_deactivation",
  ATTENDEE_REGISTRATION: "attendee_registration",
};

export const Usecase = {
  EMPLOYEE_ASSIGNMENT: "employee_assignment",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILURE: "payment_failure",
  PRODUCT_TAGGING: "product",
};

export const copyToClipboard = (id, name) => {
  navigator.clipboard.writeText(id).then(
    () => {
      toast.dismiss();
      toast.success(`${name} ID copied!`);
    },
    (err) => {
      toast.dismiss();
      toast.error(`Failed to copy ${name} ID!`);
    }
  );
};
