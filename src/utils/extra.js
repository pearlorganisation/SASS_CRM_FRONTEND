import { toast } from "sonner";

/**
 * This function is used by multiple pages/components to format the date and time
 * in a readable format.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "-";
  }

  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export const formatDateAsNumber = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "-";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
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
  console.log(successMessage)

  toast.success(successMessage, {
    position: "top-center",
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export function filterTruthyValues(obj) {
  // Base case: if the input is not an object, return it as is.
  // console.log("obj", typeof obj, obj);
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // Create a new object to store filtered values.
  const filteredObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if value is a Date object and ensure it's a valid date.
      if (value instanceof Date) {
        if (!isNaN(value.getTime())) {
          filteredObj[key] = value; // Keep valid Date objects
        }
      } else if (typeof value === "object" && value !== null) {
        // Recursively process nested objects or arrays.
        const nestedFiltered = filterTruthyValues(value);
        if (Object.keys(nestedFiltered).length > 0 || Array.isArray(value)) {
          filteredObj[key] = nestedFiltered;
        }
      } else if (value) {
        // Include only truthy values and exclude empty strings.
        filteredObj[key] = value;
      }
    }
  }

  return filteredObj;
}