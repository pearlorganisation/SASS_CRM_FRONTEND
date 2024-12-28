import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../features/actions/product";

const AddEnrollmentModal = ({ setModal, initialData, onConfirmEdit }) => {
  const { productData } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProducts({}));
  }, []);

  useEffect(() => {
    console.log(productData);
  }, [productData]);

  function removeBlankAttributes(obj) {
    const result = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key].length > 0) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      product: initialData?.product || "",
      Webinar: initialData?.webinar || "",
    },
  });

  const onSubmit = (data) => {
    data["attendee"] = initialData?.attendee;
    let finalData = removeBlankAttributes(data);
    onConfirmEdit(finalData);
  };

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">Add Enrollment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product</label>
            <select
              {...register("product")}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Select Product</option>
              {productData && productData.map((product) => (
                  <option value={product._id}>{product?.name} | Level: {product?.level} | Price: {product?.price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Webinar</label>
            <select
              {...register("webinar")}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Select Webinar</option>
              {productData && productData.map((product) => (
                  <option value={product._id}>{product?.name} | Level: {product?.level} | Price: {product?.price}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-150"
          >
            Submit
          </button>
        </form>

        <button
          onClick={() => setModal(null)}
          className="inline-flex h-10 items-center justify-center w-full mt-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddEnrollmentModal;
