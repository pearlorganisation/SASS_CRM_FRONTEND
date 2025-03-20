import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import useRoles from "../../../hooks/useRoles";
import WebinarDropdown from "../../../components/Webinar/WebinarDropdown";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";

const webinarFieldDescriptions = {
  webinar: {
    description:
      "The unique ID of the webinar in MongoDB format (24-character hexadecimal)",
    required: true,
  },
  attendee: {
    description: "The attendee object containing the following fields:",
    required: true,
  },
  email: {
    description: "Valid email address for the attendee (max 100 characters)",
    required: true,
  },
  firstName: {
    description: "Attendee's first name (max 100 characters)",
    required: false,
  },
  lastName: {
    description: "Attendee's last name (max 100 characters)",
    required: false,
  },
  phone: {
    description: "Phone number in any format",
    required: false,
  },
  gender: {
    description: "Must be one of: 'male', 'female', or 'other'",
    required: false,
  },
  location: {
    description: "Geographic location information (max 100 characters)",
    required: false,
  },
  tags: {
    description:
      "Array of text labels for Product enrollment and Employee Temporary Assignment",
    required: false,
  },
  source: {
    description:
      "Lead source tracking (e.g., 'social-media', 'email-campaign')",
    required: false,
  },
};

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
  "webinar": "507f1f77bcf86cd799439011", 
  "attendee": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "gender": "male",
    "location": "New York",
    "tags": ["vip", "new-lead"],
    "source": "website-registration"
  }
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

  const handleDownload = () => {
    // Create blob with JSON data
    const blob = new Blob([jsonBody], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webinar-assignment.json';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="md:px-10 py-20 flex flex-col items-center text-gray-800 bg-gray-50 min-h-screen">
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

        {/* Box for JSON Body */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">JSON Body:</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => handleCopy(jsonBody)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-auto">
            {jsonBody}
          </pre>
        </div>

        {roles["ADMIN"] === role && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Field Descriptions:
            </h2>
            <div className="space-y-3">
              {Object.entries(webinarFieldDescriptions).map(
                ([key, description]) => (
                  <div className="text-sm" key={key}>
                    <span
                      className={`font-mono text-blue-600 ${
                        key === "webinar" || key === "attendee"
                          ? "text-red-600"
                          : " ps-10"
                      }`}
                    >{`${key}:`}</span>
                    <span className="text-gray-600 ml-2">{`${description.description}`}</span>
                    <span className="text-neutral-900 ml-2">{`${description.required ? " (Required)" : " (Optional)"}`}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PabblyToken;
