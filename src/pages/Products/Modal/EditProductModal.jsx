import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  updateProduct,
} from "../../../features/actions/product";
import tagsService from "../../../services/tagsService";
import { Usecase } from "../../../utils/extra";

const EditProductModal = ({
  setModal,
  product,
  page,
  LIMIT,
  productLevelData,
}) => {
  const dispatch = useDispatch();
  const productLevel = productLevelData.find(
    (item) => item.label === product?.level
  )?.level;
  console.log(product.tag);

  const [tagData, setTagData] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({

    defaultValues: {
      name: product?.name || "",
      price: product?.price || "",
      description: product?.description || "",
      level: productLevel ?? "",
      tag: product?.tag || "",
    },
  });

  const onSubmit = (data) => {
    data["id"] = product._id;
    data["level"] = Number(data.level);
    console.log(data);
    dispatch(updateProduct(data)).then((res) => {
      setModal(null);
    });
  };

  useEffect(() => {
    tagsService.getTags({ usecase: Usecase.PRODUCT_TAGGING }).then((res) => {
      if (res.success) {
        setTagData(res.data);
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">Add Enrollment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>

            <input
              {...register("name", { required: "Product name is required" })}
              type="text"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              placeholder="Enter Product Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>

            <input
              {...register("price", { required: "Price is required" })}
              type="number"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>

            <textarea
              {...register("description", {
                required: "description is required",
              })}
              type="number"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 py-1 focus:border-teal-500 focus:outline-none min-h-[50px] max-h-[100px]"
              placeholder="Description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Level</label>
            <select
              {...register("level", { required: "Level is required" })}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="" disabled>
                Select Level
              </option>
              {productLevelData.map((item) => (
                <option key={item.level} value={item.level}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.product && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Tag</label>
            <select
              {...register("tag")}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="">None</option>
              {tagData.map((item) => (
                <option 
                  key={item._id} 
                  value={item.name}
                  selected={product?.tag === item.name}
                >
                  {item.name}
                </option>
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

export default EditProductModal;
