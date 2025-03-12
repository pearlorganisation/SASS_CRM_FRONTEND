import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { setTableMasked } from "../../features/slices/tableSlice";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import useRoles from "../../hooks/useRoles";
import { deleteAllData } from "../../features/actions/globalData";
import {
  Addon,
  API,
  Billing,
  DeleteIcon,
  Dropdown,
  LandingPageIcon,
  LeadTypeIcon,
  Plan,
  ProductLevelIcon,
  SidebarLinksIcon,
  Tags,
} from "./SVGs";
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
  const isCustomStatusEnabled = tableConfig?.isCustomOptionsAllowed || false;

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const settingsLinks = [
    {
      to: "/plans",
      name: "Plans",
      icon: <img src={Plan} alt="Plan" className="w-10 h-10" />,
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/addons",
      name: "Addons",
      icon: <img src={Addon} alt="Addon" className="w-10 h-10" />,
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/tags",
      name: "Tags",
      icon: <img src={Tags} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.ADMIN],
    },
    {
      to: "/billing-history",
      name: "Billing History",
      icon: <img src={Billing} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.ADMIN],
    },
    {
      to: "/pabblyToken",
      name: "External API Token",
      icon: <img src={API} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/settings/custom-status",
      name: `${roles.isSuperAdmin() ? "Default" : "Custom"} Options`,
      icon: <img src={Dropdown} alt="Tags" className="w-10 h-10" />,
      conditions: [isCustomStatusEnabled || roles.isSuperAdmin()],
      allowedRoles: [roles.SUPER_ADMIN, roles.ADMIN],
    },
    {
      to: "/lead-type",
      name: "Lead Types",
      icon: <img src={LeadTypeIcon} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.ADMIN],
    },
    {
      to: "/product-level",
      name: "Product Level",
      icon: <img src={ProductLevelIcon} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.ADMIN],
    },
    {
      to: "/sidebarLinks",
      name: "Sidebar Links",
      icon: <img src={SidebarLinksIcon} alt="Tags" className="w-10 h-10" />,
      allowedRoles: [roles.SUPER_ADMIN],
    },
    {
      to: "/update-landing-page",
      name: "Landing Page",
      icon: <img src={LandingPageIcon} alt="Tags" className="w-10 h-10" />,
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
        {settingsLinks.map(
          ({ to, name, icon, allowedRoles, conditions = [] }, index) => (
            <ComponentGuard
              key={index}
              allowedRoles={allowedRoles}
              conditions={conditions}
            >
              <Link
                to={to}
                onClick={() => addUserActivityLog(to, "page")}
                className={`flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-neutral-200 text-green-600 shadow-lg`}
              >
                {icon}
                <Typography>{name}</Typography>
              </Link>
            </ComponentGuard>
          )
        )}

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

        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className={`flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-red-100  text-red-600 shadow-lg`}
          >
            <img src={DeleteIcon} alt="Delete" className="w-10 h-10" />
            <Typography>Delete All</Typography>
          </button>
        </ComponentGuard>
      </div>
      {isDeleteOpen && (
        <ConfirmWipeModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => dispatch(deleteAllData())}
        />
      )}
    </Box>
  );
};

export default ViewSettings;

const ConfirmWipeModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[28rem]">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Action</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to wipe out all the database entries? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
