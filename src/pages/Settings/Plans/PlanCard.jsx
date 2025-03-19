import React, { lazy, Suspense, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUsers,
  FaAddressBook,
  FaEllipsisV,
  FaToggleOn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";
import { Button } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { copyToClipboard } from "../../../utils/extra";
import { useDispatch, useSelector } from "react-redux";
import { checkout } from "../../../features/actions/razorpay";
import useRoles from "../../../hooks/useRoles";
import ModalFallback from "../../../components/Fallback/ModalFallback";
import { createPortal } from "react-dom";
import { MdEdit, MdLogout, MdInfo } from "react-icons/md";
const PlanSelectorModal = lazy(() => import("./PlanSelectorModal"));

const PlanCard = (props) => {
  const roles = useRoles();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [durationModalOpen, setDurationModalOpen] = useState(false);
  const {
    plan,
    isMenuVisible = false,
    isSelectVisible = false,
    handlePlanSelection = (id, billingData) => {
      dispatch(
        checkout({ plan: id, durationType: billingData.durationType })
      ).then((res) => {
        if (res?.payload?.result) {
          const order = res?.payload?.result;
          const plan = res?.payload?.planData;
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
            }/razorpay/payment-success?planId=${plan._id}&adminId=${
              userData?._id
            }&durationType=${billingData?.durationType} `,
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
    currentPlan = null,
    setModalData = () => {},
    planType = "active",
  } = props;

  const {
    name,
    internalName,
    amount,
    isActive,
    employeeCount,
    contactLimit,
    toggleLimit,
    subscriptionCount,
    attendeeTableConfig,
    employeeInactivity,
    setAlarm,
    whatsappNotificationOnAlarms,
    calendarFeatures,
    productRevenueMetrics,
    renewalNotAllowed,
    customRibbon,
    customRibbonColor,
    assignmentMetrics,
  } = plan;


  const { isCustomOptionsAllowed = false } = attendeeTableConfig || {};

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
            <div className="absolute right-0 mt-2 space-y-1 p-1 whitespace-nowrap bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <Link to={`/plans/editPlan/${plan?._id}`} state={plan}>
                <button className="flex items-center gap-2 rounded-md shadow-sm w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 ">
                  <MdEdit
                    size={24}
                    className="text-blue-500 group-hover:text-blue-600"
                  />
                  Edit Plan
                </button>
              </Link>

              <button
                onClick={() => setModalData(plan)}
                className="flex gap-2 items-center rounded-md shadow-sm w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 "
              >
                <MdLogout size={24} className="text-red-500" />
                {planType === "active" ? "Deactivate" : "Activate"} Plan
              </button>
            </div>
          )}
        </div>
      </ComponentGuard>

      <div className="absolute top-2 left-0 flex flex-col gap-2">
        {customRibbon && (
          <div
            className={` flex gap-2 ${
              customRibbonColor ? `bg-[${customRibbonColor.trim()}]` : "bg-indigo-500"
            }  text-white text-xs px-3 py-1 rounded-r-md  items-center`}
          >
            {customRibbon}
          </div>
        )}

        {!isActive && (
          <div
            title="Inactive Plan, renewal not allowed. Please contact Administrator."
            className=" flex gap-2 bg-red-500 text-white text-xs px-3 py-1 rounded-r-md  items-center"
          >
            Inactive Plan <MdInfo />
          </div>
        )}
      </div>

      {currentPlan === plan?._id && (
        <div
          title="Current Plan"
          className="absolute top-2 right-0 flex gap-2 bg-green-500 text-white text-xs px-3 py-1 rounded-l-md  items-center"
        >
          Current Plan
        </div>
      )}

      {plan.planType === "custom" && (
        <div
          title="Current Plan"
          className="absolute top-10 right-0 bg-indigo-500 text-white text-xs px-3 py-1 rounded-l-md  items-center"
        >
          Custom Plan
        </div>
      )}

      {/* Card Content */}
      <div className="text-center mt-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>

        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {internalName || name}
          </h2>
          <div className="flex items-center gap-2 px-3 justify-center">
            <span className="text-sm font-medium text-gray-500">
              Subscribers
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {subscriptionCount}
            </span>
          </div>
        </ComponentGuard>

        <p className="text-4xl font-extrabold text-blue-600">
          {"\u20B9"}
          {amount}
          <span className="text-base font-normal text-gray-500">/month</span>
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <Feature icon={<FaUsers />} label={`${employeeCount} employees`} />
        <Feature
          icon={<FaAddressBook />}
          label={`${contactLimit} contact uploads`}
        />
        <Feature icon={<FaToggleOn />} label={`${toggleLimit} Toggle Limit`} />
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <Feature label="Custom Options" enabled={isCustomOptionsAllowed} />
        <Feature
          label="Employee Inactivity Tracking"
          enabled={employeeInactivity}
        />
        <Feature label="Set Alarm" enabled={setAlarm} />
        <Feature
          label="Whatsapp Notifications"
          enabled={whatsappNotificationOnAlarms}
        />
        <Feature label="Calendar & Alarm History" enabled={calendarFeatures} />
        <Feature
          label="Product Revenue Metrics"
          enabled={productRevenueMetrics}
        />
        <Feature
          label="Employee Assignment Metrics"
          enabled={assignmentMetrics}
        />
      </div>

      {(roles.isSuperAdmin(userData?.role) || !renewalNotAllowed) && (
        <>
          {/* Copy Plan ID Button */}
          {isActive && (
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
          )}

          <ComponentGuard allowedRoles={isSelectVisible ? [] : [roles.ADMIN]}>
            {isActive && (
              <button
                onClick={() => setDurationModalOpen(true)}
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
            )}
          </ComponentGuard>
        </>
      )}

      {durationModalOpen &&
        selectedPlan !== plan?._id &&
        createPortal(
          <Suspense fallback={<ModalFallback />}>
            {" "}
            <PlanSelectorModal
              onClose={() => setDurationModalOpen(false)}
              planData={plan}
              onSuccess={(billingData) =>
                handlePlanSelection(plan?._id, billingData)
              }
              setModal={setDurationModalOpen}
            />
          </Suspense>,
          document.body
        )}
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
