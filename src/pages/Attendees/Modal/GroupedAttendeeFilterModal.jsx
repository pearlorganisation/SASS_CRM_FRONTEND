import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { closeModal } from "../../../features/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { filterTruthyValues } from "../../../utils/extra";
import Select from "react-select";
import { setAllAttendeesFilters } from "../../../features/slices/filters.slice";
import { allAttendeesSortByOptions } from "../../../utils/columnData";

const GroupedAttendeeFilterModal = ({ modalName, setPage }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm();

  const { leadTypeData } = useSelector((state) => state.assign);
  const { subscription } = useSelector((state) => state.auth);
  const { allAttendeesFilters, allAttendeesSortBy } = useSelector(
    (state) => state.filters
  );
  const [sortBy, setSortBy] = useState(
    allAttendeesSortBy || {
      sortBy: allAttendeesSortByOptions[0].value,
      sortOrder: "asc",
    }
  );
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);

  const onSubmit = (data) => {
    if (data?.leadType?.value) data.leadType = data.leadType.value;
    const filterData = filterTruthyValues(data);
    dispatch(
      setAllAttendeesFilters({
        filters: filterData,
        sortBy: sortBy,
      })
    );
    setPage(1);
    onClose();
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  const resetForm = () => {
    reset({
      email: "",
      "timeInSession.$gte": "",
      "timeInSession.$lte": "",
      "attendedWebinarCount.$gte": "",
      "attendedWebinarCount.$lte": "",
      leadType: "",
    });
  };

  useEffect(() => {
    // Block scroll when modal is open
    document.body.style.overflow = "hidden";

    reset({
      email: "",
      "timeInSession.$gte": "",
      "timeInSession.$lte": "",
      "attendedWebinarCount.$gte": "",
      "attendedWebinarCount.$lte": "",
      ...allAttendeesFilters,
      leadType: allAttendeesFilters.leadType
        ? leadTypeData.find((item) => item._id === allAttendeesFilters.leadType)
        : "",
    });
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!leadTypeData) return;
    const options = leadTypeData.map((item) => ({
      value: item._id,
      label: item.label,
      color: item.color,
    }));
    setLeadTypeOptions(options);
  }, [leadTypeData]);

  return (
    <div className="absolute z-50 inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between border-gray-200">
          <h2 className="text-lg font-semibold">Attendee Filters</h2>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Time In Session
              </label>
              <div className="flex space-x-4">
                <Controller
                  name="timeInSession.$gte"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Min"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  )}
                />
                <Controller
                  name="timeInSession.$lte"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Max"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Webinar Attended
              </label>
              <div className="flex space-x-4">
                <Controller
                  name="attendedWebinarCount.$gte"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Min"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  )}
                />
                <Controller
                  name="attendedWebinarCount.$lte"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Max"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Webinar Attended
              </label>
              <div className="flex space-x-4">
                <Controller
                  control={control}
                  name="leadType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      className="w-full mt-2"
                      options={leadTypeOptions}
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          field.onChange(selectedOption);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      isClearable={true}
                      placeholder="Lead Type"
                      getOptionLabel={(e) => (
                        <div className="flex items-center gap-5">
                          <div
                            style={{ backgroundColor: e.color }}
                            className="w-10 h-5 rounded-sm mr-2"
                          ></div>
                          {e.label}
                        </div>
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy.sortBy}
                onChange={(e) =>
                  setSortBy((prev) => ({
                    ...prev,
                    sortBy: e.target.value,
                  }))
                }
                className="border rounded-md p-2 text-sm"
              >
                {allAttendeesSortByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Order</label>
              <select
                value={sortBy.sortOrder}
                onChange={(e) =>
                  setSortBy((prev) => ({
                    ...prev,
                    sortOrder: e.target.value,
                  }))
                }
                className="border rounded-md p-2 text-sm"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <button
              onClick={resetForm}
              className="px-4 py-1 text-md font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Reset
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-4 py-1 text-md font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupedAttendeeFilterModal;
