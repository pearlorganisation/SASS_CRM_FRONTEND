import React from "react";
import { Card, Typography } from "@mui/material";

const MetricCard = ({ label, value, color }) => {
  return (
    <Card className="p-3 shadow">
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h4" sx={{ color: color }}>
        {value}
      </Typography>
    </Card>
  );
};

export default MetricCard;