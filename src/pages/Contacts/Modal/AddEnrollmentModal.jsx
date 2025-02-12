import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../features/actions/product";
import { addEnrollment, getEnrollments } from "../../../features/actions/attendees";

const AddEnrollmentModal = ({ setModal, attendeeEmail, webinarData }) => {
  const { productData } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(webinarData)
    dispatch(getAllProducts({}));
  }, []);


  const { register, handleSubmit, formState: { errors },
} = useForm({
    defaultValues: {
      attendee: attendeeEmail || "",
      product: "",
      webinar: "",
    },
  });

  const onSubmit = (data) => {
    data["attendee"] = attendeeEmail;
    console.log(data)
    dispatch(addEnrollment(data)).then(res => {
      if(res.meta.requestStatus === "fulfilled"){
        dispatch(getProductLevelCounts(attendeeEmail));
        setModal(false)
      }
    })
  };

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">Add Enrollment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product</label>
            <select
              {...register("product",{ required: "Product is required" }) }
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Select Product</option>
              {productData &&
                productData.map((product) => (
                  <option value={product._id} key={product._id}>
                    {product?.name} | Level: {product?.level} | Price:{" "}
                    {product?.price}
                  </option>
                ))}
            </select>
            {errors.product && (
              <p className="text-red-500 text-sm mt-1">{errors.product.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Webinar</label>
            <select
              {...register("webinar",{ required: "Webinar is required" })}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-red-500 focus:outline-none"
            >
              <option value="">Select Webinar</option>
              {webinarData &&
                  webinarData.length > 0 &&
                  webinarData?.map((item, index) => (
                  <option value={item?.webinar[0]?._id} key={index}>
                    {item?.webinar[0]?.webinarName} | {new Date(item?.webinar[0]?.webinarDate).toDateString()}
                  </option>
                ))}
            </select>
            {errors.webinar && (
              <p className="text-red-500 text-sm mt-1">{errors.webinar.message}</p>
            )}
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
