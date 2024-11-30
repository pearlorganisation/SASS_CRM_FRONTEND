import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { roles } from "../../utils/roles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { PiLetterCirclePBold } from "react-icons/pi";
import { MdArrowDropDownCircle } from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Box, Typography } from "@mui/material";

const ViewSettings = () => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  return (
    <Box className="mt-10 text-center">
      <Typography variant="h4" className="font-bold">
        SETTINGS
      </Typography>
      {/* Tailwind Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 my-10 md:mx-10">
        {/* For SUPER_ADMIN and ADMIN roles */}
        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN, roles.ADMIN]}>
          <Link
            to="/plans"
            className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-green-700 hover:text-white text-green-700 shadow-lg"
          >
            <RiMoneyRupeeCircleLine size={40} />
            <Typography>Plans</Typography>
          </Link>
          <Link
            to="/pabblyToken"
            className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-green-700 hover:text-white text-green-700 shadow-lg"
          >
            <PiLetterCirclePBold size={40} />
            <Typography>External API Token</Typography>
          </Link>
          <Link
            to="/settings/custom-status"
            className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-green-700 hover:text-white text-green-700 shadow-lg"
          >
            <MdArrowDropDownCircle size={40} />
            <Typography>Custom Status</Typography>
          </Link>
        </ComponentGuard>

        {/* For SUPER_ADMIN only */}
        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
          <Link
            to="/sidebarLinks"
            className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600 shadow-lg"
          >
            <PiLinkSimpleBold size={40} />
            <Typography>Sidebar Links</Typography>
          </Link>
          <Link
            to="/update-landing-page"
            className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600 shadow-lg"
          >
            <GiPerspectiveDiceSixFacesRandom size={40} />
            <Typography>Landing Page</Typography>
          </Link>
        </ComponentGuard>
      </div>
    </Box>
  );
};

export default ViewSettings;
