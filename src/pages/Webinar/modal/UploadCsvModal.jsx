import React, { useEffect, useState } from "react";
import CsvParser from "papaparse";
import { toast } from "sonner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addAttendees } from "../../../features/actions/attendees";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { clearSuccess } from "../../../features/slices/attendees";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import { formatPhoneNumber } from "../../../utils/extra";

const UploadCsvModal = ({ tabValue, setModal, update }) => {
  const logUserActivity = useAddUserActivity();

  const { isLoading, isSuccess } = useSelector((state) => state.attendee);
  const { id } = useParams();
  const [mapUI, setMapUI] = useState(false);
  const [selectedValues, setSelectedValues] = useState({}); // State to store selected values
  const [meetingData, setMeetingData] = useState([]);
  const [filterRow, setFilterRow] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [date, setDate] = useState("");

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // this function is for displaying the selected field values in UI
  const handleSelectChange = (field, selectedOption) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      CsvParser.parse(file, {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: (chunk) => {
          // Split the CSV content by newlines
          const rows = chunk.split("\n");
          // Take the 12th row as the header (index 11) and join it with the rest of the data from the 13th row
          const newChunk = [rows[filterRow - 1], ...rows.slice(filterRow)].join(
            "\n"
          );
          return newChunk;
        },
        complete: (results) => {
          setMeetingData(results.data);
          console.log("uploaded");
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
      setMapUI(true);
      toast.success("File Uploaded Successfully", { position: "top-center" });
    }
  };

  // console.log(meetingData)
  const generateOptions = (data) => {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      return keys.map((key) => ({
        label: key,
        value: data[0][key],
      }));
    }
    return [];
  };
  // console.log(generateOptions(meetingData))

  const handleNextClick = () => {
    if (filterRow === "") {
      setErrorMessage("This field is required");
    } else {
      setErrorMessage("");
      setShowFileUpload(true);
    }
  };

  const dateError = () => {
    if (date === "") {
      setDateErrorMessage("Date is required");
    } else {
      setDateErrorMessage("");
    }
  };

  const onSubmit = (data2) => {
    console.log(data2);
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      sessionMinutes,
      csvName,
      location,
      gender,
    } = data2;

    const emailField = email?.label;
    const firstNameField = firstName?.label;
    const lastNameField = lastName?.label;
    const phoneNumberField = phoneNumber?.label;
    const sessionMinutesField = sessionMinutes?.label;
    const locationField = location?.label;
    const genderField = gender?.label;

    const mergeDataByEmail = (data) => {
      console.log("data ----> ", data);
      const mergedData = {};

      if (!update) {
        data.forEach((item) => {
          const email = item[emailField];
          if (!mergedData[email]) {
            mergedData[email] = {
              email: item[emailField],
              firstName: item[firstNameField],
              lastName: item[lastNameField],
              phone: formatPhoneNumber(item[phoneNumberField]),
              location: item[locationField],
              gender: item[genderField],
              totalTimeInSession: parseInt(item[sessionMinutesField], 10) || 0,
              actualWebinarDate: date,
            };
          } else {
            const existing = mergedData[email];
            existing.totalTimeInSession +=
              parseInt(item[sessionMinutesField], 10) || 0;
          }
        });
      } else {
        data.forEach((item) => {
          const email = item[emailField];
          if (!mergedData[email]) {
            mergedData[email] = {
              email: item[emailField],
              firstName: item[firstNameField],
              lastName: item[lastNameField],
              phone: formatPhoneNumber(item[phoneNumberField]),
              location: item[locationField],
              gender: item[genderField],
              totalTimeInSession: parseInt(item[sessionMinutesField], 10) || 0,
            };
          } else {
            const existing = mergedData[email];
            existing.totalTimeInSession +=
              parseInt(item[sessionMinutesField], 10) || 0;
          }
        });
      }
      console.log(mergedData);

      if (!update) {
        return Object.values(mergedData).map((item) => ({
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          phone: item.phone,
          timeInSession: item.totalTimeInSession,
          location: item.location,
          gender: item.gender,
          date: date,
          csvName: csvName,
        }));
      } else {
        return Object.values(mergedData).map((item) => ({
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          phone: item.phone,
          location: item.location,
          gender: item.gender,
          timeInSession: item.totalTimeInSession,
        }));
      }
    };

    const mergedResult = mergeDataByEmail(meetingData);
    console.log("mergedResult --- >", mergedResult);
    // setMeetingData(mergedResult);

    const payloadData = {
      webinarId: id,
      isAttended: tabValue === "postWebinar" ? true : false,
      data: mergedResult,
    };

    dispatch(addAttendees(payloadData));
    logUserActivity({
      action: "import",
      type: "CSV Data",
      detailItem: tabValue,
    });
  };

  function handleCloseModal() {
    setModal(false);
    dispatch(clearSuccess());
  }

  useEffect(() => {
    console.log("isSucess ", isSuccess);
    if (isSuccess) {
      handleCloseModal();
    }
  }, [isSuccess]);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
      aria-labelledby="header-3a content-3a"
      aria-modal="true"
      tabIndex="-1"
      role="dialog"
    >
      {/*    <!-- Modal --> */}
      <div
        className="rounded bg-white pb-6 shadow-xl "
        id="modal"
        role="document"
      >
        <div className="flex justify-end px-5">
          <button
            onClick={() => setModal(false)}
            className="me-3 flex h-10 items-center justify-center justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
            aria-label="close dialog"
          >
            <span className="relative only:-mx-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                role="graphics-symbol"
                aria-labelledby="title-79 desc-79"
              >
                <title id="title-79">Icon title</title>
                <desc id="desc-79">
                  A more detailed description of the icon
                </desc>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </button>
        </div>
        <div className="flex flex-col justify-center gap-5">
          {!mapUI && (
            <div className="px-8 space-y-5">
              {!showFileUpload && (
                <>
                  <p className="text-sm font-medium text-red-500">
                    {" "}
                    Note : For zoom downloaded csv it starts with 14th line{" "}
                  </p>
                  <div className="flex justify-center items-center gap-3  ">
                    <label className="font-medium text-sm">
                      Header Row Starts with :
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                      placeholder="Type the line number"
                      onChange={(e) => {
                        setFilterRow(e.target.value);
                      }}
                      required={true}
                    />
                    <button
                      className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md text-center"
                      onClick={handleNextClick}
                    >
                      Next{" "}
                    </button>
                  </div>
                  <div>
                    {errorMessage && (
                      <span className="text-white bg-red-500 rounded-lg px-2 py-1 text-sm">
                        {errorMessage}
                      </span>
                    )}
                  </div>{" "}
                </>
              )}
              {showFileUpload && (
                <>
                  {" "}
                  <div className="max-w-md h-40 rounded-lg border-2 border-dashed flex items-center justify-center">
                    <label
                      htmlFor="file"
                      className="cursor-pointer text-center p-4 md:p-8"
                    >
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
                      <p className="mt-3 text-gray-700 max-w-xs mx-auto">
                        {" "}
                        <span className="font-medium text-indigo-600">
                          Select a csv file
                        </span>{" "}
                        or drag and drop a csv file here
                      </p>
                    </label>
                    <input
                      id="file"
                      accept=".csv"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {mapUI && (
            <form className="mt-2 px-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-lg border border-slate-300 ">
                <table className="text-gray-800">
                  <thead>
                    <tr className="border-b font-semibold ">
                      <td className="px-6 py-2">HEADER</td>
                      <td className="px-6 py-2">FIELD</td>
                      <td className="px-6 py-2">FIELD VALUES</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 ">Email</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange("email", selectedOption);
                              }}
                              className="mt-2"
                              placeholder="Select a custom field"
                            />
                          )}
                          rules={{ required: true }}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.email}
                        </span>
                        {errors.email && (
                          <span className=" bg-slate-100 p-1 rounded-lg text-sm font-medium text-red-500">
                            Email is required
                          </span>
                        )}{" "}
                      </td>
                    </tr>
                    {!update && (
                      <>
                        <tr>
                          <td className="px-6 ">Actual Webinar Date</td>
                          <td className="px-6 py-2 ">
                            <input
                              type="date"
                              className="border rounded-[4px] border-gray-300 w-full px-2 outline-none py-[4px]"
                              onChange={(e) => {
                                setDate(e.target.value);
                              }}
                            />
                          </td>
                          <td className="px-6 pb-2">
                            <span className="bg-slate-100 rounded-lg p-1">
                              {date}
                            </span>
                            {dateErrorMessage && (
                              <span className=" bg-slate-100 p-1 rounded-lg text-sm font-medium text-red-500">
                                {dateErrorMessage}
                              </span>
                            )}{" "}
                          </td>
                        </tr>
                        <tr className="">
                          <td className="px-6 ">Webinar Name</td>
                          <td className="px-6 py-2 ">
                            <input
                              {...register("csvName", { required: true })}
                              type="text"
                              className="border rounded-[4px] border-gray-300 w-full px-2 outline-none py-[4px]"
                            />
                          </td>
                          <td className="px-6 pb-2">
                            {" "}
                            {errors.csvName && (
                              <span className=" bg-slate-100 p-1  rounded-lg text-sm font-medium text-red-500">
                                Webinar Name is required
                              </span>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr className="">
                      <td className="px-6 ">First Name</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="firstName"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange("firstName", selectedOption);
                              }}
                              className="mt-2"
                              isClearable={true}
                              placeholder="Select a custom field"
                            />
                          )}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.firstName}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 ">Last Name</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="lastName"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange("lastName", selectedOption);
                              }}
                              className="mt-2"
                              isClearable={true}
                              placeholder="Select a custom field"
                            />
                          )}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.lastName}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 ">Phone Number</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange(
                                  "phoneNumber",
                                  selectedOption
                                );
                              }}
                              className="mt-2"
                              isClearable={true}
                              placeholder="Select a custom field"
                            />
                          )}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.phoneNumber}
                        </span>
                      </td>
                    </tr>
                    {tabValue === "postWebinar" && (
                      <tr>
                        <td className="px-6 ">Session Minutes</td>
                        <td className="px-6 pb-2 ">
                          {" "}
                          <Controller
                            control={control}
                            name="sessionMinutes"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                options={generateOptions(meetingData)}
                                onChange={(selectedOption) => {
                                  field.onChange(selectedOption);
                                  handleSelectChange(
                                    "sessionMinutes",
                                    selectedOption
                                  );
                                }}
                                className="mt-2"
                                isClearable={true}
                                placeholder="Select a custom field"
                                menuPlacement="top"
                              />
                            )}
                          />
                        </td>
                        <td className="px-6 pb-2">
                          <span className="bg-slate-100 rounded-lg p-1">
                            {/* //here i want to display the value of react-select by selecting the label */}
                            {selectedValues.sessionMinutes}
                          </span>
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td className="px-6 ">Location</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="location"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange("location", selectedOption);
                              }}
                              className="mt-2"
                              isClearable={true}
                              placeholder="Select a custom field"
                              menuPlacement="top"
                            />
                          )}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.location}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 ">Gender</td>
                      <td className="px-6 pb-2 ">
                        {" "}
                        <Controller
                          control={control}
                          name="gender"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              options={generateOptions(meetingData)}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                handleSelectChange("gender", selectedOption);
                              }}
                              className="mt-2"
                              isClearable={true}
                              placeholder="Select a custom field"
                              menuPlacement="top"
                            />
                          )}
                        />
                      </td>
                      <td className="px-6 pb-2">
                        <span className="bg-slate-100 rounded-lg p-1">
                          {/* //here i want to display the value of react-select by selecting the label */}
                          {selectedValues.gender}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                onClick={dateError}
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 w-full text-white p-2 rounded-md text-center mt-7 mb-3"
              >
                {isLoading ? <ClipLoader color="#fff" size={20} /> : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCsvModal;
