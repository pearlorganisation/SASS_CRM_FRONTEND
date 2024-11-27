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

  return `${month}/${day}/${year}`;
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
  });
};
