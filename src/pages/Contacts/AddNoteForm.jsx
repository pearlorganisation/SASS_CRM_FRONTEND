import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { addNote } from "../../features/actions/assign";


const AddNoteForm = (props) => {
    const dispatch = useDispatch();
  const { email, recordType } = props;
  const [selectedStatus, setSelectedStatus] = useState(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      recordType: recordType,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if(data?.image?.length > 0){
        data.image = data?.image[0];
    }
    dispatch(addNote(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5">
      <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-5">
        {/* Phone Number Input */}
        <div className="w-[60%]">
          <label className="font-medium text-sm">Phone Number</label>
          <input
            {...register("phone", { required: true })}
            type="text"
            className="w-full mt-1 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
          />
          {errors.phone && (
            <span className="text-red-500">Phone Number is required</span>
          )}
        </div>

        {/* Call Duration Input */}
        <div className="w-[40%]">
          <label className="font-medium text-sm">
            Call Duration{" "}
            <span className="font-normal text-xs">(hr : min : sec)</span>
          </label>
          <div className="mt-1 flex items-center">
            <input
              {...register("callDuration.hr")}
              type="text"
              defaultValue={"00"}
              className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
              maxLength={2}
            />
            <span className="font-light px-1">:</span>
            <input
              {...register("callDuration.min")}
              type="text"
              defaultValue={"00"}
              className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
              maxLength={2}
            />
            <span className="font-light px-1">:</span>
            <input
              {...register("callDuration.sec")}
              type="text"
              defaultValue={"00"}
              className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
              maxLength={2}
            />
          </div>
        </div>
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
      options={[
        { value: "Payment", label: "Payment" },
        { value: "Discussion", label: "Discussion" },
        { value: "Other", label: "Other" },
      ]}
      className="mt-1 text-sm shadow"
      placeholder="Choose Status"
      value={
        field.value
          ? { value: field.value, label: field.value }
          : null
      } // Correctly setting the selected option
      onChange={(selected) => {
        field.onChange(selected.value);
        setSelectedStatus(selected.value); // Update state based on selection
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          border: errors.status
            ? "1px solid #EF4444"
            : "1px solid #CBD5E1", // Red border if there's an error
          borderRadius: "7px",
        }),
        placeholder: (provided) => ({
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

      {/* Note Textarea */}
      <div className="pt-2">
        <label className="font-medium text-sm">Note</label>
        <textarea
          {...register("note", { required: true })}
          className="w-full mt-1 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
        {errors.note && <span className="text-red-500">Note is required</span>}
      </div>

      {/* Payment Screenshot Upload */}
      {selectedStatus === "Payment" && (
        <>
          <p className="font-semibold text-sm py-2">Payment Screenshot</p>
          <div className="pt-5 h-40 rounded-lg border-2 border-dashed flex items-center justify-center">
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
                or drag your Image here
              </p>
            </label>
            <input
              {...register("image")}
              id="file"
              type="file"
              className="hidden"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-indigo-700 w-full hover:bg-indigo-800 mt-2 text-white py-2 px-4 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default AddNoteForm;
