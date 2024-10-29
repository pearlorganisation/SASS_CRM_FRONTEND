import React, { useState } from "react";
import { PiLinkSimpleBold } from "react-icons/pi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { roles } from "../../utils/roles";

const ViewSettings = () => {
  const { role } = useSelector((state) => state.auth.userData);
  console.log(role);

  return (
    <div className="mt-10 text-center">
      <span className="text-2xl font-bold ">SETTINGS</span>
      <div className="grid grid-cols-3 p-10 justify-items-center gap-10 mt-8 shadow-sm bg-gray-50 mx-10 rounded-lg ">
        {(roles.SUPER_ADMIN === role || roles.ADMIN === role) && (
          <Link
            to="/plans"
            className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-52 cursor-pointer  hover:bg-green-700 hover:text-white text-green-700"
          >
            <RiMoneyRupeeCircleLine size={40} /> Plans
          </Link>
        )}
        {roles.SUPER_ADMIN === role && (
          <>
            <Link
              to="/sidebarLinks"
              className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600"
            >
              <PiLinkSimpleBold size={40} /> Sidebar links
            </Link>

            <Link
              to="/update-landing-page"
              className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600"
            >
              <GiPerspectiveDiceSixFacesRandom size={40} /> Landing Page
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSettings;
