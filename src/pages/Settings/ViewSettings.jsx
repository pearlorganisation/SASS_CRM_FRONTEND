import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../../utils/roles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { PiLetterCirclePBold } from "react-icons/pi";
import { MdArrowDropDownCircle, MdLeaderboard } from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { setTableMasked } from "../../features/slices/tableSlice";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import useRoles from "../../hooks/useRoles";

// Configuration for the links

const ViewSettings = () => {
  const roles = useRoles();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  const { isTablesMasked } = useSelector((state) => state.table);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  const { subscription } = useSelector((state) => state.auth);
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};
  const isCustomStatusEnabled = tableConfig?.isCustomOptionsAllowed  || false;

  const settingsLinks = [
    {
      to: "/plans",
      name: "Plans",
      icon: <RiMoneyRupeeCircleLine size={40} />,
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/pabblyToken",
      name: "External API Token",
      icon: <PiLetterCirclePBold size={40} />,  
      allowedRoles: [roles.ADMIN],
    },
    {
      to: "/settings/custom-status",
      name: `${roles.isSuperAdmin() ? "Default" : "Custom"} Options`,
      icon: <MdArrowDropDownCircle size={40} />,
      conditions:[isCustomStatusEnabled || roles.isSuperAdmin()],
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/lead-type",
      name: "Lead Types",
      icon: <MdLeaderboard size={40} />,
      allowedRoles: [ roles.ADMIN],
    },
    {
      to: "/sidebarLinks",
      name: "Sidebar Links",
      icon: <PiLinkSimpleBold size={40} />,
      allowedRoles: [roles.SUPER_ADMIN],
    },
    {
      to: "/update-landing-page",
      name: "Landing Page",
      icon: <GiPerspectiveDiceSixFacesRandom size={40} />,
      allowedRoles: [roles.SUPER_ADMIN],
    },
  ];

  const handleMaskedTablesChange = (event) => {
    dispatch(setTableMasked(event.target.checked));
  };

  const addUserActivityLog = (link, type) => {
    logUserActivity({
      action: "navigate",
      detailItem: link,
      navigateType: type,
    });
  };

  return (
    <Box className="mt-10 text-center">
      <Typography variant="h4" className="font-bold">
        SETTINGS
      </Typography>
      {/* Tailwind Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 my-10 md:mx-10">
        {/* Render links dynamically */}
        {settingsLinks.map(({ to, name, icon, allowedRoles, conditions=[] }, index) => (
          <ComponentGuard key={index} allowedRoles={allowedRoles} conditions={conditions}>
            <Link
              to={to}
              onClick={() => addUserActivityLog(to, "page")}
              className={`flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-green-600 hover:text-white text-green-600 shadow-lg`}
            >
              {icon}
              <Typography>{name}</Typography>
            </Link>
          </ComponentGuard>
        ))}

        {/* Masked Tables Option */}
        <div className="flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer text-green-700 shadow-lg">
          <FormControlLabel
            control={
              <Checkbox
                checked={isTablesMasked}
                onChange={handleMaskedTablesChange}
                color="primary"
              />
            }
            label={<Typography>Masked Tables</Typography>}
          />
        </div>
      </div>
    </Box>
  );
};

export default ViewSettings;
