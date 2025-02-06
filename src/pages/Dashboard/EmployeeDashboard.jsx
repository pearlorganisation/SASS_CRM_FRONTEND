import React, { useEffect, useState } from "react";
import { Card, Typography,Button, Grid, Box, Divider } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../features/actions/globalData";
import { errorToast } from "../../utils/extra";
import { useParams } from "react-router-dom";

const EmployeeDashboard = () => {
  const employeeId = useParams()?.id;
  const dispatch = useDispatch();
  const { dashBoardCardsData } = useSelector((state) => state.globalData);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [statusData, setStatusData] = useState([]);
  const [webinarData, setWebinarData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getDashboardData({ startDate, endDate, employeeId }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7); // Subtract 7 days from today's date

    setStartDate(oneWeekAgo);
    setEndDate(today);

    fetchData(oneWeekAgo, today);

    dispatch(getDashboardData({ oneWeekAgo, today, employeeId }));
  }, []);

  const handleStartDateChange = (date) => {
    if (endDate && date > endDate) {
      errorToast("Start date cannot be later than end date.");
      return;
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      errorToast("End date cannot be earlier than start date.");
      return;
    }
    setEndDate(date);
  };

  useEffect(() => {
    if (Array.isArray(dashBoardCardsData?.metrics)) {
      setWebinarData(dashBoardCardsData?.metrics[0]?.webinarGroup);
    }
    if (Array.isArray(dashBoardCardsData?.metrics)) {
      setStatusData(dashBoardCardsData?.metrics[0]?.statusGroup);
    }
  }, [dashBoardCardsData]);

  const fetchData = () => {
    if (startDate && endDate) {
      dispatch(getDashboardData({ startDate: oneWeekAgo, endDate: today, employeeId }));
    }
  };

  return (
    <Box className="md:px-10 py-10">
      <Box className="flex justify-between">
        {/* Date Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Box display="flex" gap={2} alignItems="center">
            <Typography>Start Date:</Typography>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Select start date"
              dateFormat="dd-MM-yyyy"
            />
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <Typography>End Date:</Typography>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="Select end date"
              dateFormat="dd-MM-yyyy"
            />
          </Box>
          <Button
            className="h-fit"
            variant="outlined"
            color="secondary"
            onClick={fetchData}
          >
            Find
          </Button>
        </div>
        {/* Filter Button */}
        {/* <Button
          className="h-fit"
          variant="outlined"
          color="secondary"
          onClick={handleToggleModal}
        >
          Filter Cards
        </Button> */}
      </Box>
      {/* Metrics Cards */}
      <Grid container spacing={4} className="pt-3">
        <Grid item xs={12} md={12} lg={12}>
          {/* Parent Card */}
          <Card className="p-4 w-full">
            <Typography variant="h6" gutterBottom>
              Your activity on assignments
            </Typography>
            <Box className="mb-2 flex flex-wrap gap-2 justify-start">
              {Array.isArray(webinarData) &&
                webinarData?.length > 0 &&
                webinarData.map((nested, nestedIndex) => (
                  <Box
                    key={nestedIndex}
                    className="p-1 my-1"
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor:
                        nested.color === "primary" ? "#f1f5fc" : "#fff",
                    }}
                  >
                    <Typography variant="body1">{nested._id}</Typography>
                  </Box>
                ))}
            </Box>
            <Divider />
            {/* Nested Cards */}
            <Box className="flex gap-4 flex-wrap">
              {Array.isArray(statusData) && statusData?.length > 0 ? (
                statusData?.map((nested, nestedIndex) => (
                  <Box
                    key={nestedIndex}
                    className="p-2 my-2"
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor:
                        nested.color === "primary" ? "#f1f5fc" : "#fff",
                    }}
                  >
                    <Typography variant="body1">
                      {nested._id}: <strong>{nested.count}</strong>
                    </Typography>
                  </Box>
                ))
              ) : (
                <div>No Data Found</div>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Card Selection */}
      {/* <Modal open={modalOpen} onClose={handleToggleModal}>
        <Box className="bg-white rounded-lg shadow-lg p-6 w-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Typography variant="h6" gutterBottom>
            Select Cards to Display
          </Typography>
          <Divider />
          <div className="pt-3 grid grid-cols-2">
            {cardData.map((item, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={visibleCards.includes(item.label)}
                    onChange={() => handleCardSelection(item.label)}
                  />
                }
                label={item.label}
              />
            ))}
          </div>
          <Box className="flex justify-end gap-3 pt-4">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleToggleModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleToggleModal}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal> */}
    </Box>
  );
};

export default EmployeeDashboard;
