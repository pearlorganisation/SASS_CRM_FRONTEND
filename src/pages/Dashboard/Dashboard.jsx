import React, { useEffect, useState } from "react";
// import { getAllEmployees } from '../../features/actions/employee'
import { useDispatch, useSelector } from "react-redux";
import LineChart from "./LineChart.jsx";
import PieChart from "./PieChart.jsx";
import { getEmployeeStats } from "../../features/actions/employee.js";
import { getRoleNameByID, isEmployeeId } from "../../utils/roles.js";
import { getAllWebinars } from "../../features/actions/webinarContact.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth.userData);
  const { Stats } = useSelector((state) => state.employee);
  const { webinarData } = useSelector((state) => state.webinarContact);

  console.log(webinarData, "stats");
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    if (getRoleNameByID(role) === "ADMIN") {
      if (Stats?.data && Stats?.data.length > 0) {
        setPieData(Stats?.data.map((item) => item?.employeeCount));
      }
    }
  }, [Stats]);

  useEffect(() => {
    dispatch(getEmployeeStats());

    if (getRoleNameByID(role) === "ADMIN") {
      dispatch(getAllWebinars(1));
    }
  }, []);
  return (
    <div className="mt-10 flex flex-col font-medium items-center gap-4">
      Last Site Updated on{" "}
      <span className="text-2xl font-bold font-mono">26 October 2024</span>
      <div className="w-full flex justify-center gap-20 pt-32">
        {getRoleNameByID(role) === "ADMIN" && (
          <>
            <LineChart webinarData={webinarData} />
            <PieChart pieData={pieData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
