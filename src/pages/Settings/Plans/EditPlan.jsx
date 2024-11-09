

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addPricePlans, updatePricePlans } from '../../../features/actions/pricePlan'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function EditPlan() {
    const { planId } = useParams()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isLoading, planData, isSuccess, isPlanUpdated } = useSelector(state => state.pricePlans)
    const { state } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()


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

            employeeReminder: state?.employeeReminder,

            employeeStatus: state?.employeeStatus,

            purchaseHistory: state?.purchaseHistory,

            employeeActivity: state?.employeeActivity
        }
    })


    const onSubmit = async (data) => {
        // Here you would typically send the data to your API
        console.log(data)
        console.log(planId, "planId")
        dispatch(updatePricePlans({ ...data, _id: planId }))

    }

    useEffect(() => {
        console.log(state, "state")
    }, [])
    useEffect(() => {
        if (isPlanUpdated) {
            navigate('/plans')
        }
    }, [planData])


    return (
        <div className='grid place-items-center min-h-screen'>
            <div className="max-w-2xl mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Price Plan</h2>
                    <p className="mt-1 text-sm text-gray-600">Edit pricing plan for your service</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="planName" className="block text-sm font-medium text-gray-700">
                                    Plan Name
                                </label>
                                <input
                                    id="planName"
                                    type="text"
                                    {...register('planName', { required: 'Plan name is required' })}
                                    className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="e.g. Basic Plan"
                                />
                                {errors.planName && <p className="mt-1 text-sm text-red-600">{errors.planName.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    {...register('price', { required: 'Price is required', min: 0 })}
                                    className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="planExpiry" className="block text-sm font-medium text-gray-700">
                                    Plan Expiry (days)
                                </label>
                                <input
                                    id="planExpiry"
                                    type="number"
                                    {...register('planExpiry', { required: 'Plan expiry is required', min: 1 })}
                                    className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="30"
                                />
                                {errors.planExpiry && <p className="mt-1 text-sm text-red-600">{errors.planExpiry.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="employeesCount" className="block text-sm font-medium text-gray-700">
                                    Employees Count
                                </label>
                                <input
                                    id="employeesCount"
                                    type="number"
                                    {...register('employeesCount', { required: 'Employees count is required', min: 1 })}
                                    className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="1"
                                />
                                {errors.employeesCount && <p className="mt-1 text-sm text-red-600">{errors.employeesCount.message}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contactUploadLimit" className="block text-sm font-medium text-gray-700">
                                Contact Upload Limit
                            </label>
                            <input
                                id="contactUploadLimit"
                                type="number"
                                {...register('contactUploadLimit', { required: 'Contact upload limit is required', min: 1 })}
                                className="mt-1 px-3 py-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder="100"
                            />
                            {errors.contactUploadLimit && <p className="mt-1 text-sm text-red-600">{errors.contactUploadLimit.message}</p>}
                        </div>
                        <div>
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
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Plan...
                                </span>
                            ) : (
                                'Update Price Plan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

