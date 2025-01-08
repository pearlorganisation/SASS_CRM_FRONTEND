import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Divider } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../features/actions/globalData";
import { errorToast } from "../../utils/extra";
import { resetDashboardData } from "../../features/slices/globalData";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { dashBoardCardsData } = useSelector((state) => state.globalData);
  const [rows, setRows] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (Array.isArray(dashBoardCardsData) && dashBoardCardsData.length > 0) {
      const rows = dashBoardCardsData.map((item) => {
        let row = {
          label: item?.email,
          value: item?.metrics[0]?.statusGroup?.map((e) => {
            return {
              label: e._id,
              value: e.count,
              color: "primary",
            };
          }),
          webinars: item?.metrics[0]?.webinarGroup?.map((e) => {
            return {
              label: e._id
            }
          }),
        };



        if(row?.value){

          row?.value?.unshift({
            label: "Total pending",
            value: item?.totalAssignments - item?.totalWorked,
            color: "primary",
          });
          
          row.value.unshift({
            label: "Total Worked upon",
            value: item?.totalWorked,
            color: "primary",
          });

          row.value.unshift({
            label: "Total Assignments",
            value: item?.totalAssignments,
            color: "primary",
          });
        }



        return row
      });

      setRows(rows);
    }


  }, [dashBoardCardsData]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getDashboardData({ startDate, endDate }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7); // Subtract 7 days from today's date

    setStartDate(oneWeekAgo);
    setEndDate(today);

    return () => {
      dispatch(resetDashboardData());
      console.log('returign')
    }
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
        {rows &&
          rows.length > 0 &&
          rows.map((row, rowIndex) => (
            <Grid item xs={12} md={12} lg={12} key={rowIndex}>
              {/* Parent Card */}
              <Card className="p-4 w-full">
                
                <Typography variant="h6" gutterBottom>
                  {row.label}
                </Typography>
                <Box className="mb-2 flex flex-wrap gap-2 justify-start">
                  {Array.isArray(row.webinars) && row?.webinars?.length > 0 && (
                    row.webinars.map((nested, nestedIndex) => (
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
                        <Typography variant="body1">
                          {nested.label}
                        </Typography>
                      </Box>
                    ))
                  )}
                  
                 </Box>
                <Divider />
                <Box className="mt-4 flex gap-2 justify-start">
                  {/* Nested Cards */}
                  {Array.isArray(row.value) && row?.value?.length > 0 ? (
                    row.value.map((nested, nestedIndex) => (
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
                          {nested.label}: <strong>{nested.value}</strong>
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <div>No Data Found</div>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
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

export default ClientDashboard;
