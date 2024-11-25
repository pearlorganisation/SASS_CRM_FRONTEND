import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPabblyToken } from "../../../features/actions/pabblyToken";
import { Typography } from "@mui/material";

const PabblyToken = () => {
  const { userData } = useSelector((state) => state.auth);
  const pabblyTokenData = userData?.pabblyToken || "No Token";
  const jsonBody = `{
    "userName": "test4",
    "password": "test4@123",
    "email": "test4@test.com",
    "plan": "673eeed7069c45d78e917ef4"
    }`;
  const endpoint = "https://saas-backend-762v.onrender.com/api/v1/auth/client";
  console.log(userData);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPabblyToken());
  }, [dispatch]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="md:px-10 pt-20 flex flex-col items-center text-gray-800 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full space-y-6">
        <Typography variant="h4" component="h1">
          External API Details
        </Typography>
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
              <h2 className="text-lg font-semibold text-gray-800">JSON Body</h2>
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
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                External API Token
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
            <p className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-auto">
              {pabblyTokenData || "No token available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PabblyToken;
