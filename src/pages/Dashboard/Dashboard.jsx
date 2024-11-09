import React, { useEffect, useState } from "react";
// import { getAllEmployees } from '../../features/actions/employee'
import { useDispatch, useSelector } from "react-redux";
import LineChart from "./LineChart.jsx";
import PieChart from "./PieChart.jsx";
import { getEmployeeStats } from "../../features/actions/employee.js";
import { isEmployeeId } from "../../utils/roles.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth.userData);
  const {Stats} = useSelector(state => state.employee);
  console.log(Stats,'stats')
  const [pieData, setPieData] = useState(null);


  useEffect(() => {
    
      if(Stats?.data && Stats?.data.length > 0){
        console.log('inint')
        setPieData(Stats?.data.map(item => (item?.employeeCount)))
      }
  },[Stats])

  useEffect(() =>{

    dispatch(getEmployeeStats())
  },[])
  return (
    <div className="mt-10 flex flex-col font-medium items-center gap-4">
      Last Site Updated on{" "}
      <span className="text-2xl font-bold font-mono">26 October 2024</span>

      <div className="w-full flex justify-center pt-32">

        {/* <LineChart/> */}

        <PieChart
        pieData={pieData}
        />

      </div>


    </div>
  );
};

export default Dashboard;