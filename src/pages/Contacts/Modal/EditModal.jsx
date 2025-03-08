import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getLocations } from "../../../features/actions/location";
import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { Select as MuiSelect } from "@mui/material";
import tagsService from "../../../services/tagsService";

const EditModal = ({ setModal, initialData, onConfirmEdit }) => {
  const dispatch = useDispatch();

  const { locationsData } = useSelector((state) => state.location);
  const [tagData, setTagData] = useState([]);

  useEffect(() => {
    dispatch(
      getLocations({
        page: 1,
        limit: 1000,
        filters: undefined,
      })
    );

    tagsService.getTags().then((res) => {
      console.log(res, "res");
      if (res.success) {
        setTagData(res.data);
      }
    });
  }, []);

  function removeBlankAttributes(obj) {
    const result = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key].length > 0) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  const { control, register, handleSubmit, errors } = useForm({
    defaultValues: {
      firstName: initialData?.firstName,
      lastName: initialData?.lastName,
      phone: initialData?.phone,
      location: initialData?.location,
      gender: initialData?.gender,
      tags: initialData?.tags || [],
    },
  });

  const onSubmit = (data) => {
    data["id"] = initialData?._id;
    let finalData = removeBlankAttributes(data);

    finalData["tags"] = data?.tags;
    onConfirmEdit(finalData);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">
          Attendee Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter First Name"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Phone</label>
              <input
                {...register("phone")}
                type="tel"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-row justify-between">
                <label className="block text-sm font-medium">Location</label>
                <button className="text-sm text-blue-500 hover:text-blue-700 transition duration-300">
                  Request Location
                </button>
              </div>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={locationsData.map((option) => ({
                      value: option?.name,
                      label: option?.name,
                    }))}
                    className="mt-1 text-sm shadow"
                    placeholder="Choose Location"
                    value={
                      field.value
                        ? { value: field.value, label: field.value }
                        : null
                    } // Correctly setting the selected option
                    onChange={(selected) => {
                      field.onChange(selected.value);
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "1px solid #CBD5E1", // Red border if there's an error
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
              {/* <input
                {...register("location")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Location"
              /> */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                {...register("gender")}
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Tags</label>

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <MuiSelect
                      multiple
                      {...field}
                      className="h-10"
                      label="Tags"
                      value={field.value || []}
                      onChange={(e) => field.onChange(e.target.value)}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {tagData.map((item) => {
                        return (<MenuItem  key={item._id} value={item.name}>
                          {item.name}
                        </MenuItem>)
                      })}
                      
                    </MuiSelect>
                  </FormControl>
                )}
              />
            </div>
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

export default EditModal;
