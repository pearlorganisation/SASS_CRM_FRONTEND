import { useSelector } from "react-redux";
import { useMemo } from "react";

const useRoles = () => {
  const { roles, userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  // Ensure roles is an array and handle cases where it is undefined or not an array
  const rolesObject = useMemo(() => {
    if (!Array.isArray(roles)) {
      console.error(
        "Invalid roles data. Expected an array but received:",
        typeof roles
      );
      return {}; // Return empty object to prevent errors in the app
    }

    if (roles.length === 0) return {};

    // Safely transform roles array into an object with name as key and _id as value
    return roles.reduce((acc, role) => {
      if (role && role?.name && role?._id) {
        acc[role.name] = role._id;
      } else {
        console.error("Invalid role data encountered", role);
      }
      return acc;
    }, {});
  }, [roles]);

  // Safely map roleId to role name with fallback
  const getRoleNameByID = (roleId = "") => {
    if (typeof roleId !== "string" || roleId.trim() === "") {
      console.warn("Invalid roleId provided:", roleId);
      return "Unknown Role";
    }

    const roleEntries = Object.entries(rolesObject);
    const matchedRole = roleEntries.find(([roleName, id]) => id === roleId);

    return matchedRole ? matchedRole[0].replace("_", " ") : "Unknown Role";
  };

  // Check if roleName is either 'EMPLOYEE_SALES' or 'EMPLOYEE_REMINDER'
  const isEmployeeId = (roleId) => {
    let roleName = "";
    if (typeof roleId !== "string" || roleId.trim() === "") {
      roleName = getRoleNameByID(role);
    } else roleName = getRoleNameByID(roleId);
    const employeeRoles = ["EMPLOYEE SALES", "EMPLOYEE REMINDER"];
    return employeeRoles.includes(roleName);
  };

  // Wrap rolesObject with Proxy to handle method calls and undefined fields gracefully
  const rolesProxy = useMemo(() => {
    return new Proxy(rolesObject, {
      get(target, property) {
        // Handle method calls like 'getRoleNameById'
        if (property === "getRoleNameById") {
          return getRoleNameByID;
        }

        // Handle method calls like 'isEmployeeId'
        if (property === "isEmployeeId") {
          return isEmployeeId;
        }

        // Fallback for undefined properties in rolesObject
        if (!(property in target)) {
          console.warn(`Accessing an unknown role property: ${property}`);
        }

        return property in target ? target[property] : "defaultName";
      },
    });
  }, [rolesObject]);

  return rolesProxy;
};

export default useRoles;
