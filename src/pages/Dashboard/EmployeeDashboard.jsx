import React, { useEffect, useState } from "react";
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
  const {userData} = useSelector((state) => state.auth);
  const dateFormat = userData?.dateFormat || DateFormat.DD_MM_YYYY;

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
      dispatch(getDashboardData({ startDate, endDate, employeeId }));
    }
  };

  return (
    <div className="md:px-10 px-4 py-14">
      <div className="flex justify-between">
        {/* Date Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-2 items-center">
            <span className="text-gray-700">Start Date:</span>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Select start date"
              dateFormat={dateFormat}
              showYearDropdown
              maxDate={new Date()}
              showMonthDropdown
              dropdownMode="select"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-gray-700">End Date:</span>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="Select end date"
              dateFormat={dateFormat}
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
          </div>
          <button
            className="h-fit px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={fetchData}
          >
            Find
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-12 gap-4 pt-3">
        <div className="col-span-12">
          <div className="p-4 w-full rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Your activity on assignments</h2>
            <div className="mb-2 flex flex-wrap gap-2 justify-start">
              {Array.isArray(webinarData) &&
                webinarData?.length > 0 &&
                webinarData.map((nested, nestedIndex) => (
                  <div
                    key={nestedIndex}
                    className="p-1 my-1 border border-gray-300 rounded-lg"
                    style={{
                      backgroundColor: nested.color === "primary" ? "#f1f5fc" : "#fff",
                    }}
                  >
                    <span className="text-gray-700">{nested._id}</span>
                  </div>
                ))}
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex gap-4 flex-wrap">
              {Array.isArray(statusData) && statusData?.length > 0 ? (
                statusData?.map((nested, nestedIndex) => (
                  <div
                    key={nestedIndex}
                    className="p-2 my-2 border border-gray-300 rounded-lg"
                    style={{
                      backgroundColor: nested.color === "primary" ? "#f1f5fc" : "#fff",
                    }}
                  >
                    <span className="text-gray-700">
                      {nested._id}: <strong>{nested.count}</strong>
                    </span>
                  </div>
                ))
              ) : (
                <div>No Data Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
