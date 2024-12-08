
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updatePricePlans } from '../../../features/actions/pricePlan';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import FormInput from './FormInput';  // Assuming FormInput component is in the same directory

export default function EditPlan() {
  const { planId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, planData, isSuccess, isPlanUpdated } = useSelector(state => state.pricePlans);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      planName: state?.planName,
      price: state?.price,
      planExpiry: state?.planExpiry,
      employeesCount: state?.employeesCount,
      contactUploadLimit: state?.contactUploadLimit,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    dispatch(updatePricePlans({ ...data, _id: planId }));
  };

  useEffect(() => {
    if (isPlanUpdated) {
      navigate('/plans');
    }
  }, [planData]);

  return (
    <div className="grid place-items-center min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Price Plan</h2>
          <p className="mt-1 text-sm text-gray-600">Edit pricing plan for your service</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormInput
                name="planName"
                label="Plan Name"
                control={register}
                required={true}
                errorMessage="Plan name is required"
              />
              <FormInput
                name="price"
                label="Price"
                control={register}
                type="number"
                required={true}
                errorMessage="Price is required"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormInput
                name="planExpiry"
                label="Plan Expiry (days)"
                control={register}
                type="number"
                required={true}
                errorMessage="Plan expiry is required"
              />
              <FormInput
                name="employeesCount"
                label="Employees Count"
                control={register}
                type="number"
                required={true}
                errorMessage="Employees count is required"
              />
            </div>
            <FormInput
              name="contactUploadLimit"
              label="Contact Upload Limit"
              control={register}
              type="number"
              required={true}
              errorMessage="Contact upload limit is required"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <ClipLoader color="#fff" className="mx-5" size={20} />
              ) : (
                'Update Price Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}








                       
{/* <div>

    
            employeeReminder: state?.employeeReminder,

            employeeStatus: state?.employeeStatus,

            purchaseHistory: state?.purchaseHistory,

            employeeActivity: state?.employeeActivity

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