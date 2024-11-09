import React from 'react';
import { FaCheck, FaTimes, FaUsers, FaCalendarAlt, FaAddressBook, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePricePlan } from '../../../features/actions/pricePlan';

const PlanCard = ({ plan }) => {
    const dispatch = useDispatch()
    const {
        planName,
        price,
        planExpiry,
        employeesCount,
        contactUploadLimit,
        employeeReminder,
        purchaseHistory,
        employeeStatus,
        employeeActivity,
    } = plan;

    return (
        <div className="relative mx-auto border border-gray-200 p-6 overflow-hidden rounded-xl shadow-lg max-w-sm bg-white m-4 transition-all duration-300 hover:shadow-xl">
            <div className='flex justify-between absolute top-0 w-full left-0 py-1 px-2'>
                <Link to={`/plans/editPlan/${plan?._id}`} state={plan}>
                    <button className=" text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <FaPencilAlt />
                    </button>
                </Link>
                <button onClick={() => {
                    dispatch(deletePricePlan({ _id: plan?._id }))
                }} className="  text-gray-400 hover:text-red-500 transition-colors duration-300">
                    <MdDelete />
                </button>
            </div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{planName}</h2>
                <p className="text-4xl font-extrabold text-blue-600">${price}<span className="text-base font-normal text-gray-500">/month</span></p>
            </div>

            <div className="space-y-4 mb-6">
                <Feature icon={<FaCalendarAlt />} label={`${planExpiry} days expiry`} />
                <Feature icon={<FaUsers />} label={`${employeesCount} employees`} />
                <Feature icon={<FaAddressBook />} label={`${contactUploadLimit} contact uploads`} />
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
            <span className={`mr-2 ${enabled ? 'text-green-500' : 'text-red-500'}`}>
                {enabled ? <FaCheck /> : <FaTimes />}
            </span>
        )}
        <span className={`${enabled ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
    </div>
);

export default PlanCard;