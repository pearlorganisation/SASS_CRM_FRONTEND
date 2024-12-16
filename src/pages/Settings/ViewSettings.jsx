import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../../utils/roles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { PiLetterCirclePBold } from "react-icons/pi";
import { MdArrowDropDownCircle } from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { setTableMasked } from "../../features/slices/tableSlice";
import useAddUserActivity from "../../hooks/useAddUserActivity";

// Configuration for the links
const settingsLinks = [
  {
    to: "/plans",
    name: "Plans",
    icon: <RiMoneyRupeeCircleLine size={40} />,
    allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    color: "green-700",
    hoverColor: "green-700",
  },
  {
    to: "/pabblyToken",
    name: "External API Token",
    icon: <PiLetterCirclePBold size={40} />,
    allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    color: "green-700",
    hoverColor: "green-700",
  },
  {
    to: "/settings/custom-status",
    name: "Custom Status",
    icon: <MdArrowDropDownCircle size={40} />,
    allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    color: "green-700",
    hoverColor: "green-700",
  },
  {
    to: "/sidebarLinks",
    name: "Sidebar Links",
    icon: <PiLinkSimpleBold size={40} />,
    allowedRoles: [roles.SUPER_ADMIN],
    color: "blue-600",
    hoverColor: "blue-600",
  },
  {
    to: "/update-landing-page",
    name: "Landing Page",
    icon: <GiPerspectiveDiceSixFacesRandom size={40} />,
    allowedRoles: [roles.SUPER_ADMIN],
    color: "blue-600",
    hoverColor: "blue-600",
  },
];

const ViewSettings = () => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  const { isTablesMasked } = useSelector((state) => state.table);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

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
        {settingsLinks.map(({ to, name, icon, allowedRoles, color, hoverColor }, index) => (
          <ComponentGuard key={index} allowedRoles={allowedRoles}>
            <Link
              to={to}
              onClick={() => addUserActivityLog(to, "page")}
              className={`flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-${hoverColor} hover:text-white text-${color} shadow-lg`}
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
