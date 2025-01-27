import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../../features/actions/assign";
import { ClipLoader } from "react-spinners";
import {
  createAttendeeProduct,
  getAllProductsByAdminId,
} from "../../features/actions/product";
import { getCustomOptions } from "../../features/actions/globalData";
import { resetFormSuccess } from "../../features/slices/assign";

const AddNoteForm = (props) => {
  const { customOptions } = useSelector((state) => state.globalData);
  const dispatch = useDispatch();
  const { isFormLoading, isFormSuccess } = useSelector((state) => state.assign);
  const {
    email,
    attendeeId,
    uniquePhones,
    addUserActivityLog,
    employeeModeData,
    userData,
  } = props;
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNoteRequired, setNoteRequired] = useState(false);
  const { productDropdownData } = useSelector((state) => state.product);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attendee: attendeeId,
      email: email,
      phone: "",
      callDuration: { hr: "", min: "", sec: "" },
      status: "",
      note: "",
      image: null,
    },
  });

  useEffect(() => {
    dispatch(getAllProductsByAdminId());
    dispatch(getCustomOptions());
  }, []);

  useEffect(() => {
    if (isFormSuccess) {
      reset({
        attendee: attendeeId,
        email: email,
        phone: "",
        callDuration: { hr: "", min: "", sec: "" },
        status: "",
        note: "",
        image: null,
      });
      setSelectedStatus(null);
      setSelectedPhone(null);
      setSelectedFile(null);
      dispatch(resetFormSuccess());
    }
  }, [isFormSuccess]);

  const onSubmit = (data) => {
    if (selectedStatus !== "Payment") {
      data.image = null;
    }

    data.callDuration.hr = data.callDuration.hr ? data.callDuration.hr : "00";
    data.callDuration.min = data.callDuration.min
      ? data.callDuration.min
      : "00";
    data.callDuration.sec = data.callDuration.sec
      ? data.callDuration.sec
      : "00";

    data.isWorked = !isNoteRequired;
    // if (data?.product && data?.product !== "") {
    //   const payload = {
    //     email,
    //     productId: productDropdownData.find(
    //       (item) => item.name === data?.product
    //     )?._id,
    //   };

    // dispatch(addNote(payload));
    // }

    dispatch(addNote(data));
    // .then(() => {
    //   addUserActivityLog({
    //     action: "addNote",
    //     details: `User added a note for Attendee with Email: ${email} - Note: ${note}`,
    //   });
    // });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setValue("image", file);
  };

  const handleInput = (e, maxValue, numAllowed = 2) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");
    if (value.length > numAllowed) {
      value = value.slice(0, numAllowed);
    }

    const num = Number(value);

    if (num > maxValue) {
      value = maxValue.toString().padStart(2, "0");
    }

    e.target.value = value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5">
      {/* Phone Number Input */}

      {/* Call Duration Input */}

      <div className="w-full flex gap-5 items-center">
        <label className="font-medium text-sm">
          Call Duration <span className="font-normal text-xs">(min : sec)</span>
        </label>
        <div className="mt-1 flex items-center">
          {/* <input
            {...register("callDuration.hr")}
            type="text"
            placeholder={"00"}
            className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
            maxLength={2}
            onInput={(e) => handleInput(e, 23)} // Hours range: 00-12
            onClick={(e) => e.target.select()}
          />
          <span className="font-light px-1">:</span> */}
          <input
            {...register("callDuration.min")}
            type="text"
            placeholder={"00"}
            className="w-12 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
            maxLength={3}
            onInput={(e) => handleInput(e, 150, 3)} // Minutes range: 00-59
            onClick={(e) => e.target.select()}
          />
          <span className="font-light px-1">:</span>
          <input
            {...register("callDuration.sec")}
            type="text"
            placeholder={"00"}
            className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
            maxLength={2}
            onInput={(e) => handleInput(e, 59)} // Seconds range: 00-59
            onClick={(e) => e.target.select()}
          />
        </div>
      </div>

      <div className="w-full">
        <label className="font-medium text-sm">Phone Number</label>
        <Controller
          name="phone"
          control={control}
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={uniquePhones.map((phone) => ({
                value: phone,
                label: phone,
              }))}
              className="mt-1 text-sm shadow"
              placeholder="Choose Phone Number"
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              onChange={(selected) => {
                field.onChange(selected.value);
                setSelectedPhone(selected.value);
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: errors.phone
                    ? "1px solid #EF4444"
                    : "1px solid #CBD5E1",
                  borderRadius: "7px",
                }),
                placeHolder: (provided) => ({
                  ...provided,
                  color: "#9CA3AF",
                }),
              }}
            />
          )}
        />
        {errors.phone && (
          <span className="text-red-500">Phone Number is required</span>
        )}
      </div>

      {/* Status Select */}
      <div className="pt-2">
        <div className="font-medium">Status</div>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={customOptions.map((option) => ({
                value: option?.label,
                label: option?.label,
                isWorked: option?.isWorked,
              }))}
              className="mt-1 text-sm shadow"
              placeholder="Choose Status"
              value={
                field.value ? { value: field.value, label: field.value } : null
              } // Correctly setting the selected option
              onChange={(selected) => {
                field.onChange(selected.value);
                setSelectedStatus(selected.value); 
                setNoteRequired(!selected.isWorked);
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: errors.status
                    ? "1px solid #EF4444"
                    : "1px solid #CBD5E1", // Red border if there's an error
                  borderRadius: "7px",
                }),
                placeHolder: (provided) => ({
                  ...provided,
                  color: "#9CA3AF",
                }),
              }}
            />
          )}
        />

        {errors.status && (
          <span className="text-red-500 text-sm mt-1">
            {errors.status.message}
          </span>
        )}
      </div>

      {selectedStatus === "Product" && (
        <div className="pt-4">
          <div className="font-medium">Product</div>
          <Controller
            name="product"
            control={control}
            rules={{ required: "Product is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={productDropdownData.map((product) => ({
                  label: product?.name,
                  value: product?.name,
                  ...product,
                }))}
                className="mt-1 text-sm shadow"
                placeholder="Choose Product"
                value={
                  field.value
                    ? { value: field.value, label: field.value }
                    : null
                }
                onChange={(selected) => field.onChange(selected.value)}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: errors.product
                      ? "1px solid #EF4444"
                      : "1px solid #CBD5E1", // Red border if there's an error
                    borderRadius: "7px",
                  }),
                  placeHolder: (provided) => ({
                    ...provided,
                    color: "#9CA3AF",
                  }),
                }}
              />
            )}
          />

          {errors.product && (
            <span className="text-red-500 text-sm mt-1">
              {errors.product.message}
            </span>
          )}
        </div>
      )}

      {/* Note Textarea */}
      <div className="pt-2">
        <label className="font-medium text-sm">Note</label>
        <textarea
          {...register("note", { required: isNoteRequired })}
          className="w-full mt-1 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
        {errors.note && <span className="text-red-500">Note is required</span>}
      </div>

      {/* Payment Screenshot Upload */}
      {selectedStatus === "Payment" && (
        <>
          <p className="font-semibold text-sm py-2">Payment Screenshot</p>
          <div className="pt-5 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center">
            <label htmlFor="file" className="cursor-pointer text-center">
              <svg
                className="w-10 h-10 mx-auto"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-gray-700 max-w-xs mx-auto">
                Click to{" "}
                <span className="font-medium text-indigo-600">
                  Upload Image
                </span>{" "}
                or drag your image here
              </p>
            </label>
            <input
              {...register("image")}
              id="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file:{" "}
                <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isFormLoading || employeeModeData ? true : false || !userData?.isActive}
        className="bg-indigo-700 w-full hover:bg-indigo-800 mt-2 text-white py-2 px-4 rounded-md"
      >
        {isFormLoading ? <ClipLoader size={17} color="#c4c2c2" /> : "Add Note"}
      </button>
    </form>
  );
};

export default AddNoteForm;
