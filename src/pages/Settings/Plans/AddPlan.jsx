import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addPricePlans,
  getPricePlan,
  updatePricePlans,
} from "../../../features/actions/pricePlan";
import { useNavigate, useParams } from "react-router-dom";

export default function AddPlan() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(id ? true : false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, planData, isSuccess, singlePlanData } = useSelector(
    (state) => state.pricePlans
  );

  console.log("single ------> ", singlePlanData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Here you would typically send the data to your API
    if(isEditMode) {
      data["_id"] = id;
    }
    console.log(data);
    dispatch(isEditMode ? updatePricePlans(data) : addPricePlans(data));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/plans");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getPricePlan(id));
    }
  }, []);

  useEffect(() => {
    if (isEditMode && singlePlanData) {
      // Populate form with `singlePlanData` when available
      setValue("name", singlePlanData.name || "");
      setValue("amount", singlePlanData.amount || 0);
      setValue("planDuration", singlePlanData.planDuration || 0);
      setValue("employeeCount", singlePlanData.employeeCount || 0);
      setValue("contactLimit", singlePlanData.contactLimit || 0);
    }
  }, [singlePlanData, isEditMode]);

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="max-w-2xl mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit Price Plan" : "Add Price Plan"}
          </h2>
          {/* <p className="mt-1 text-sm text-gray-600">
            Create a new pricing plan for your service
          </p> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="planName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Plan Name
                </label>
                <input
                  id="planName"
                  type="text"
                  {...register("name", { required: "Plan name is required" })}
                  className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="e.g. Basic Plan"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  {...register("amount", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be at least 0" },
                    valueAsNumber: true,
                  })}
                  className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="planExpiry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Plan Expiry (days)
                </label>
                <input
                  id="planExpiry"
                  type="number"
                  {...register("planDuration", {
                    required: "Plan expiry is required",
                    min: {
                      value: 1,
                      message: "Plan duration must be at least 1 day",
                    },
                    valueAsNumber: true,
                  })}
                  className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="30"
                />
                {errors.planDuration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.planDuration.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="employeesCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employees Count
                </label>
                <input
                  id="employeesCount"
                  type="number"
                  {...register("employeeCount", {
                    required: "Employee count is required",
                    min: {
                      value: 1,
                      message: "Employee count must be at least 1",
                    },
                    valueAsNumber: true,
                  })}
                  className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="1"
                />
                {errors.employeeCount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.employeeCount.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="contactUploadLimit"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Limit
              </label>
              <input
                id="contactUploadLimit"
                type="number"
                {...register("contactLimit", {
                  required: "Contact limit is required",
                  min: {
                    value: 1,
                    message: "Contact limit must be at least 1",
                  },
                  valueAsNumber: true,
                })}
                className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="100"
              />
              {errors.contactLimit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactLimit.message}
                </p>
              )}
            </div>
            {/* <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('employeeReminder')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee Reminder</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('purchaseHistory')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Purchase History</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('employeeStatus')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee Status</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('employeeActivity')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee Activity</span>
                </label>
              </div>
            </div> */}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Plan...
                </span>
              ) : isEditMode ? (
                "Update Plan"
              ) : (
                "Add Plan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
