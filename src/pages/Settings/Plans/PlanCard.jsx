import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaAddressBook,
  FaPencilAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deletePricePlan } from "../../../features/actions/pricePlan";

const PlanCard = ({ plan }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    name,
    amount,
    planDuration,
    employeeCount,
    contactLimit,
    employeeReminder,
    purchaseHistory,
    employeeStatus,
    employeeActivity,
  } = plan;

  return (
    <div className="relative mx-auto border border-gray-200 p-6 overflow-hidden rounded-xl shadow-lg max-w-sm bg-white m-4 transition-all duration-300 hover:shadow-xl">
      {/* Menu Button */}
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
            {/* <button
              onClick={() => {
                dispatch(deletePricePlan({ _id: plan?._id }));
                setMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <MdDelete className="mr-2" />
              Delete
            </button> */}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-4xl font-extrabold text-blue-600">
          ${amount}
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
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <Feature label="Employee Reminder" enabled={employeeReminder} />
        <Feature label="Purchase History" enabled={purchaseHistory} />
        <Feature label="Employee Status" enabled={employeeStatus} />
        <Feature label="Employee Activity" enabled={employeeActivity} />
      </div>

      <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
        Choose Plan
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
