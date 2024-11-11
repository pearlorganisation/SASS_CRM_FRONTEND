import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createCustomOption, getCustomOptions } from "../../../features/actions/globalData";

const CustomOptions = () => {
    const dispatch = useDispatch();
    const { customOptions } = useSelector((state) => state.globalData);
    console.log("cuost sdkfjks ksdfjdk", customOptions);

    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);

    // React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Toggle modal visibility
    const handleModalToggle = () => setShowModal(!showModal);

    // Handle form submission
    const onSubmit = (data) => {

        dispatch(createCustomOption(data)).then(() => {
            dispatch(getCustomOptions());
            reset(); // Reset form fields
            setShowModal(false); // Close modal
        });


    };

    useEffect(() => {
        dispatch(getCustomOptions());
    }, []);

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="flex justify-between py-6 items-center">
                <h1 className="text-2xl font-bold">Custom Options</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleModalToggle}
                >
                    Add Custom Option
                </button>
            </div>

            {/* Display Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="p-4 text-left">#</th>
                            <th className="p-4 text-left">Label</th>
                            <th className="p-4 text-left">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customOptions?.map((option, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4">{option.label}</td>
                                <td className="p-4">{option.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Custom Option Button */}


            {/* Modal for Adding Custom Option */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-semibold mb-4">Add Custom Option</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    {...register("label", { required: "Label is required" })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                                />
                                {errors.label && <p className="text-red-500 text-sm">{errors.label.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Value
                                </label>
                                <input
                                    type="text"
                                    {...register("value", { required: "Value is required" })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                                />
                                {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={handleModalToggle}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add Option
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomOptions;
