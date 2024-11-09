import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../features/actions/product";
import { useNavigate } from "react-router-dom";
import { getAllWebinars } from "../../features/actions/webinarContact";

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const navigate = useNavigate();
  const { productData } = useSelector((state) => state.product);
  const { userData } = useSelector((state) => state.auth);
  const { webinarData } = useSelector((state) => state.webinarContact);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const newData = { ...data, adminId: userData.id };
    console.log(newData);
    dispatch(addProduct(newData));
  };

  useEffect(() => {
    if (productData.status) {
      navigate("/products");
    }
  }, [productData]);

  useEffect(() => {
    dispatch(getAllWebinars(1));
  }, []);
  console.log(webinarData);

  return (
    <div className="">
      <div className="mt-10 ">
        <div className=" flex justify-center"></div>
        <div className="bg-white rounded-lg shadow-lg  sm:rounded-lg sm:max-w-5xl mt-8 mx-auto">
          <h3 className="text-gray-700 text-base text-center bg-gray-100 font-medium sm:text-xl p-2 rounded-t-lg uppercase">
            {" "}
            Add Product{" "}
          </h3>
          <form
            className="space-y-6 mx-8 sm:mx-2  p-4 py-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
              <div className="w-full">
                <label className="font-medium">Product Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {errors.name && (
                  <span className="text-red-500">Product Name is required</span>
                )}
              </div>
              <div className="w-full">
                <label className="font-medium">Price</label>
                <input
                  {...register("price", { required: true })}
                  type="number"
                  className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {errors.price && (
                  <span className="text-red-500">Price is required</span>
                )}
              </div>
            </div>

            <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
              <div className="w-full">
                <label className="font-medium">Description</label>
                <input
                  {...register("description", { required: true })}
                  type="text"
                  className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {errors.description && (
                  <span className="text-red-500">Description is required</span>
                )}
              </div>
              <div className="w-full">
                <label className="font-medium">Webinar</label>
                <select
                  {...register("webinarName", { required: true })}
                  className="w-full mt-2 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                >
                  <option value="" selected disabled>
                    Select a webinar
                  </option>

                  {webinarData &&
                    webinarData?.map((item, index) => (
                      <option key={index} value={item.csvName}>
                        {item.csvName}
                      </option>
                    ))}
                </select>
                {errors.webinarName && (
                  <span className="text-red-500">Please select a webinar</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "4rem" }}>
              <button className="w-full btn-grad:hover btn-grad">
                {/* {isLoading ? (
            <ClipLoader color="#c4c2c2" />
          ) : (<>Create</>)} */}
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
