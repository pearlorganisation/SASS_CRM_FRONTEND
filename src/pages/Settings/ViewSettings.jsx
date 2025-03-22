import React, { useEffect } from "react";
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
  WhatsappIcon,
} from "./SVGs";
import { updateWhatsappToken } from "../../features/actions/auth";
import TailwindLoader from "../../components/TailwindLoader";
import { clearOTPGenerated } from "../../features/slices/auth";
// Configuration for the links

const ViewSettings = () => {
  const roles = useRoles();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  const { isTablesMasked } = useSelector((state) => state.table);
  const { userData, isLoading, isSuccess } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  const { subscription } = useSelector((state) => state.auth);
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};
  const isCustomStatusEnabled = tableConfig?.isCustomOptionsAllowed || false;

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isUpdateWhatsappTokenOpen, setIsUpdateWhatsappTokenOpen] = React.useState(false);
  const [tokenValue, setTokenValue] = React.useState("");

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

  useEffect(() => {
    if (isSuccess) {
      setIsUpdateWhatsappTokenOpen(false);
      dispatch(clearOTPGenerated());
      setTokenValue("");
    }
  }, [isSuccess]);

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

        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
          <button
            onClick={() => setIsUpdateWhatsappTokenOpen(true)}
            className={`flex items-center justify-center gap-3 font-bold text-xl rounded-lg bg-white h-20 w-full cursor-pointer hover:bg-green-100  text-green-600 shadow-lg`}
          >
            <img src={WhatsappIcon} alt="Delete" className="w-9 h-9" />
            <Typography>Update Whatsapp Token</Typography>
          </button>
        </ComponentGuard>
      </div>
      {isDeleteOpen && (
        <ConfirmWipeModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => dispatch(deleteAllData())}
        />
      )}
      {
        isUpdateWhatsappTokenOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Update WhatsApp Token</h2>
                {!isLoading && (
                  <button 
                    onClick={() => setIsUpdateWhatsappTokenOpen(false)} 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Token
                    </label>
                    <input
                      placeholder="Enter your new token"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={tokenValue}
                      onChange={(e) => setTokenValue(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    disabled={isLoading}
                    onClick={() => dispatch(updateWhatsappToken({
                      whatsappToken: tokenValue
                    }))}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    {
                      isLoading ? <TailwindLoader size={6} /> : "Update Token"
                    }
                  </button>
                </div>
            </div>
          </div>
        )
      }
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
