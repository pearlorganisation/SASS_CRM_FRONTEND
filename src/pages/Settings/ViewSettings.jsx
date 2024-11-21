import React, { useState } from "react";
import { PiLinkSimpleBold } from "react-icons/pi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { roles } from "../../utils/roles";
import { PiLetterCirclePBold } from "react-icons/pi";
import { MdArrowDropDownCircle } from "react-icons/md";

const ViewSettings = () => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  return (
    <div className="mt-10 text-center">
      <span className="text-2xl font-bold ">SETTINGS</span>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 xl:p-10 px-4 py-10 justify-items-center gap-10 mt-8 shadow-sm bg-gray-50 mx-10 rounded-lg ">
        {(roles.SUPER_ADMIN === role || roles.ADMIN === role) && (
          <>
            {" "}
            <Link
              to="/plans"
              className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-52 cursor-pointer  hover:bg-green-700 hover:text-white text-green-700"
            >
              <RiMoneyRupeeCircleLine size={40} /> Plans
            </Link>
            <Link
              to="/pabblyToken"
              className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-52 cursor-pointer  hover:bg-green-700 hover:text-white text-green-700"
            >
              <PiLetterCirclePBold size={40} /> Pabbly Token
            </Link>
          </>
        )}

        {roles.SUPER_ADMIN === role && (
          <>
            <Link
              to="/sidebarLinks"
              className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600"
            >
              <PiLinkSimpleBold size={40} /> Sidebar links
            </Link>

            <Link
              to="/update-landing-page"
              className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600"
            >
              <GiPerspectiveDiceSixFacesRandom size={40} /> Landing Page
            </Link>
          </>
        )}

        {roles.ADMIN === role && (
          <>
            <Link
              to="/settings/custom-status"
              className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-green-700 hover:text-white text-green-700"
            >
              <MdArrowDropDownCircle size={40} /> Custom Status
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSettings;
