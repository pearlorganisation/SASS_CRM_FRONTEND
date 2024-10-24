import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllEmployees } from "../../features/actions/employee";
import { Skeleton, Stack } from "@mui/material";

const Employees = () => {
  const [showFilters, setShowFilters] = useState(false);
const navigate = useNavigate()
const dispatch= useDispatch()
const {employeeData,isLoading}= useSelector((state)=>state.employee)
const {userData}= useSelector((state)=>state.auth)

  const navigateToAdd = () =>{
    navigate("/createEmployee")
  }

  useEffect(()=>{
dispatch(getAllEmployees(userData?.id))
  },[userData])

  return (
    <div>
      <div
        className={`${showFilters ? "" : "hidden"} fixed w-screen h-screen z-2`}
        onClick={() => setShowFilters(false)}
      ></div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

  

      <div class="p-10 ">
        
          <div className="flex justify-end items-center gap-4 pb-4">

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2 py-1 font-medium" onClick={navigateToAdd}>Add Employee</button>
            </div>
      
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
         
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>

                <th scope="col" className="px-6 py-3">
                  Username / Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center px-6 py-8">
                    <Stack spacing={4}>
                      <Skeleton variant="rounded" height={30} />
                      <Skeleton variant="rounded" height={25} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                    </Stack>
                  </td>
                </tr>
              ) : ( Array.isArray(employeeData) && employeeData.map((item,idx)=>
                (
                <tr key={idx} className="bg-white border-b   hover:bg-gray-50 ">
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                >
    
                  <div className="">
                    <div className="text-base font-semibold">{item?.userName}</div>
                    <div className="font-normal text-gray-500">
                      {item?.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{item?.phone}</td>
                <td className="px-6 py-4">{item?.role?.name}</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600  hover:underline"
                  >
                    View Details
                  </a>
                </td>
              </tr>)
              )) }

               
        
        
      
      
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
