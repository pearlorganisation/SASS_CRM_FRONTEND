import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaAddressBook,
  FaPencilAlt,
  FaEllipsisV,
  FaToggleOn,
  FaClipboard,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { roles } from "../../../utils/roles";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";
import { Button } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { toast } from "sonner";

const PlanCard = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {
    plan,
    isMenuVisible = false,
    handlePlanSelection = () => {},
    selectedPlan = null,
  } = props;
  const {
    name,
    amount,
    planDuration,
    employeeCount,
    contactLimit,
    toggleLimit,
    employeeReminder,
    purchaseHistory,
    employeeStatus,
    employeeActivity,
  } = plan;

  // Copy Plan ID to Clipboard
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success("Plan ID copied!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="relative mx-auto border border-gray-200 p-6 overflow-hidden rounded-xl shadow-lg max-w-sm bg-white m-4 transition-all duration-300 hover:shadow-xl">
      <ComponentGuard
        allowedRoles={[roles.SUPER_ADMIN]}
        conditions={[isMenuVisible]}
      >
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 z-10">
              <Link to={`/plans/editPlan/${plan?._id}`} state={plan}>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaPencilAlt className="mr-2" />
                  Edit
                </button>
              </Link>
            </div>
          )}
        </div>
      </ComponentGuard>

      {/* Card Content */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-4xl font-extrabold text-blue-600">
          {"\u20B9"}
          {amount}
          <span className="text-base font-normal text-gray-500">/month</span>
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <Feature
          icon={<FaCalendarAlt />}
          label={`${planDuration} days expiry`}
        />
        <Feature icon={<FaUsers />} label={`${employeeCount} employees`} />
        <Feature
          icon={<FaAddressBook />}
          label={`${contactLimit} contact uploads`}
        />
        <Feature icon={<FaToggleOn />} label={`${toggleLimit} Toggle Limit`} />
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <Feature label="Employee Reminder" enabled={employeeReminder} />
        <Feature label="Purchase History" enabled={purchaseHistory} />
        <Feature label="Employee Status" enabled={employeeStatus} />
        <Feature label="Employee Activity" enabled={employeeActivity} />
      </div>

      {/* Copy Plan ID Button */}
      <div className="flex justify-center items-center mt-4">
        <Button
          onClick={() => copyToClipboard(plan?._id)}
          variant="outlined"
          endIcon={<ContentCopy />}
          style={{ textTransform: "none" }}
        >
          {plan?._id}
        </Button>
      </div>

      <button
        onClick={() => handlePlanSelection(plan?._id)}
        className={`${
          selectedPlan === plan?._id ? "bg-green-600" : "bg-blue-500"
        } w-full mt-6 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300`}
      >
        {selectedPlan === null
          ? "Choose Plan"
          : selectedPlan === plan?._id
          ? "Selected"
          : "Choose Plan"}
      </button>
    </div>
  );
};

const Feature = ({ label, enabled, icon }) => (
  <div className="flex items-center">
    {icon ? (
      <span className="text-blue-600 mr-2">{icon}</span>
    ) : (
      <span className={`mr-2 ${enabled ? "text-green-500" : "text-red-500"}`}>
        {enabled ? <FaCheck /> : <FaTimes />}
      </span>
    )}
    <span className={`${enabled ? "text-gray-800" : "text-gray-500"}`}>
      {label}
    </span>
  </div>
);

export default PlanCard;
