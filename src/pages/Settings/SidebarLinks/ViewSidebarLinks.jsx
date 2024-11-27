import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";
import { getAllSidebarLinks } from "../../../features/actions/sidebarLink";

const ViewSidebarLinks = () => {
  const navigate = useNavigate()
  const dispatch =useDispatch()
  const {sidebarLinkData,isLoading} = useSelector((state)=>state.sidebarLink)

  useEffect(() => {
    dispatch(getAllSidebarLinks())  
  },[])


  return (
    <div>
  


  

      <div className="p-10 ">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-8 bg-white ">
          
      
            <button onClick={()=>navigate("/sidebarLinks/addSidebarLink")} className="bg-blue-600 rounded-md text-white px-3 py-1 font-semibold ">Add Sidebar Link</button>
          </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
         
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
 
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                 Link
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
              ) : ( Array.isArray(sidebarLinkData) && sidebarLinkData.map((item,idx)=>
                (
                <tr key={idx} className="bg-white border-b   hover:bg-gray-50 ">

                <td className="px-6 py-4">{item?.title}</td>
                <td className="px-6 py-4">{item?.link}</td>

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

export default ViewSidebarLinks;
