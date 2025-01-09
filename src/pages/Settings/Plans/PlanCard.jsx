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
import { copyToClipboard } from "../../../utils/extra";
import { useDispatch, useSelector } from "react-redux";
import { checkout } from "../../../features/actions/razorpay";

const PlanCard = (props) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {
    plan,
    isMenuVisible = false,
    handlePlanSelection = (id) => {
      dispatch(checkout({ plan: id })).then((res) => {
        if (res?.payload?.result) {
          const order = res?.payload?.result
          const plan = res?.payload?.planData
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: order.currency,
            order_id: order.id, // This is the order_id created in the backend
            callback_url: `${
              import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT ===
              "development"
                ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
                : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
            }/razorpay/payment-success?planId=${plan._id}&adminId=${userData?._id}`, // Your success URL
            theme: {
              color: "#F37254",
            },
          };

          const rzp = new Razorpay(options);
          rzp.open();
        }
      });
    },
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
          onClick={() => copyToClipboard(plan?._id, "Plan")}
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
