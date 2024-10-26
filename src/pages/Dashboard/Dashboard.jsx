import React, { useEffect } from "react";
// import { getAllEmployees } from '../../features/actions/employee'
import { useDispatch, useSelector } from "react-redux";
import LineChart from "./LineChart.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  // const {userData}= useSelector((state)=>state.auth)

  // useEffect(()=>{
  //   dispatch(getAllEmployees(userData?.id))
  // },[userData])
  return (
    <div className="mt-10 flex flex-col font-medium items-center gap-4">
      Last Site Updated on{" "}
      <span className="text-2xl font-bold font-mono">26 October 2024</span>

      <div className="w-full px-32 pt-32">

        <LineChart/>

      </div>
    </div>
  );
};

export default Dashboard;