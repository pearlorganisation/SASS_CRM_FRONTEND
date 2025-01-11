import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import useRoles from "../../../hooks/useRoles";
import WebinarDropdown from "../../../components/Webinar/WebinarDropdown";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";

const PabblyToken = () => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role;
  const roles = useRoles();

  const [title, setTitle] = useState("");
  const [pabblyTokenData, setPabblyTokenData] = useState(
    userData?.pabblyToken || "No Token"
  );
  const [jsonBody, setJsonBody] = useState("");

  const apiUrl = `${
    import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
      ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
      : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
  }`;

  const [endpoint, setEndpoint] = useState("");

  useEffect(() => {
    if (roles["SUPER_ADMIN"] === role) {
      setTitle("External API for Creating User (Role: ADMIN)");
      setPabblyTokenData(userData?.pabblyToken || "No Token");
      setJsonBody(
        `{
  "userName": "test4",
  "password": "test4@123",
  "email": "test4@test.com",
  "plan": "673eeed7069c45d78e917ef4"
  "companyName": "test company",
}`
      );
      setEndpoint(`${apiUrl}/auth/client`);
    } else if (roles["ADMIN"] === role) {
      setTitle("External API for Adding Pre-Webinar data:");
      setPabblyTokenData(userData?.pabblyToken || "No Token");
      setJsonBody(`
{
  "webinar": "676be1dc78d7791457a2ac60", // webinar id
  "attendee": 
  { 
    "email": "d@d.com", 
    "firstName": "d", 
    "lastName":"", 
    "phone": "7675849958", 
  } // attendee details, email is mandatory
}
      `);
      setEndpoint(`${apiUrl}/assignment/prewebinar`);
    } else {
      setPabblyTokenData("No Token");
    }
  }, [roles]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="md:px-10 pt-20 flex flex-col items-center text-gray-800 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full space-y-6">
        <Typography variant="h4" component="h1">
          {title}:
        </Typography>
        <ComponentGuard allowedRoles={[roles.ADMIN]}>
          <WebinarDropdown />
        </ComponentGuard>
        {/* Box for Endpoint */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Endpoint</h2>
            <button
              onClick={() => handleCopy(endpoint)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-700 text-sm">{endpoint}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box for JSON Body */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                JSON Body:
              </h2>
              <button
                onClick={() => handleCopy(jsonBody)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-auto">
              {jsonBody}
            </pre>
          </div>

          {/* Box for Pabbly Token */}
          <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Bearer Token:
              </h2>
              <button
                onClick={() =>
                  handleCopy(pabblyTokenData || "No token available")
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <p className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-auto break-words">
              {pabblyTokenData || "No token available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PabblyToken;
