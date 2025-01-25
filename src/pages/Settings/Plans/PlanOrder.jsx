import React, { useEffect, useState } from "react";
import {
  getPricePlans,
  updatePlansOrder,
} from "../../../features/actions/pricePlan";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const PlanOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planData, isSuccess, isLoading } = useSelector(
    (state) => state.pricePlans
  );
  console.log(planData, "planData");

  const [plans, setPlans] = useState([]);

  const handleOrderChange = (id, value) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === id ? { ...plan, sortOrder: parseInt(value, 10) || 0 } : plan
    );
    setPlans(updatedPlans);
  };

  const handleUpdateOrder = () => {
    dispatch(updatePlansOrder({ plans }));
  };

  const sortedPlans = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    if (Array.isArray(planData)) {
      setPlans(
        planData.map((plan) => ({
          id: plan._id,
          name: plan.name,
          sortOrder: plan.sortOrder || 0,
        }))
      );
    }
  }, [planData]);

  useEffect(() => {
    if (!Array.isArray(planData) || planData.length === 0) {
      dispatch(getPricePlans());
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate("/plans");
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen pt-14 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
      <div className="w-full bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 text-center">
            Plan Reordering Tool
          </h1>
          <button
            onClick={handleUpdateOrder}
            disabled={isLoading}
            className="w-40 h-10  bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
          >
            {isLoading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              "Update Order"
            )}
          </button>
        </div>
        <p className="text-center text-gray-600 mb-8">
          Reorder your plans by updating the numbers below. The list will
          automatically adjust based on your input.
        </p>

        <ul className="space-y-6">
          {sortedPlans.map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <span className="text-lg font-medium text-indigo-700">
                {plan.name}
              </span>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor={`order-${plan.id}`}
                  className="text-sm font-medium text-gray-600"
                >
                  Order:
                </label>
                <input
                  id={`order-${plan.id}`}
                  type="number"
                  min="0"
                  onClick={(e) => e.target.select()}
                  value={plan.sortOrder}
                  onChange={(e) => handleOrderChange(plan.id, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanOrder;
