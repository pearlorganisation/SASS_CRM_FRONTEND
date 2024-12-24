import React from "react";
import { Box, Typography } from "@mui/material";

const StatusComponent = ({ statuses = [] }) => {
  if (!Array.isArray(statuses) || statuses.length === 0) return null;

  return (
    <div className="flex thin border w-fit max-w-2xl overflow-y-auto mx-auto border-neutral-400 p-4 rounded-md gap-4 mt-10">
      {statuses.map((status, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Label */}
          <Typography variant="caption" className="text-red-500 mb-1">
            {status.label}
          </Typography>
          {/* Count Box */}
          <Box
            className="w-20 h-20 flex justify-center items-center border-2 border-red-500 rounded-md"
          >
            <Typography variant="h5" className="text-red-500 font-bold">
              {status.count}
            </Typography>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default StatusComponent;
