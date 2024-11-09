import { Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendees } from "../../features/actions/webinarContact";
import Pagination from "@mui/material/Pagination";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Select from "react-select";
import { addAssign } from "../../features/actions/assign";
import { toast } from "sonner";
import AssignmentTable from "../../components/AssignmentTable";
import EmployeeAssignModal from "./Modal/EmployeeAssignModal";
import PageLimitEditor from "../../components/PageLimitEditor";

const ViewAttendees = () => {
  const [savedPresets, setSavedPresets] = useState(false);
  const [assignedButton, setAssignedButton] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const dispatch = useDispatch();
  const { attendeeData, isLoading } = useSelector(
    (state) => state.webinarContact
  );
  const { employeeData } = useSelector((state) => state.employee);

  const pageCount = attendeeData?.totalPages;

  const options = [
    { show: "Email", backend: "email" },
    { show: "Start - End Time", backend: "time" },
    { show: "Gender", backend: "gender" },
    { show: "Location", backend: "location" },
    { show: "Min Age Range", backend: "ageRangeMin" },
    { show: "Max Age Range", backend: "ageRangeMax" },
    { show: "Search From Mobile Number", backend: "phone" },
  ];
  const empOptions = [
    {
      label: "Sales",
      value: "EMPLOYEE_SALES",
    },
    {
      label: "Reminder",
      value: "EMPLOYEE_REMINDER",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ageRangeMin, setAgeRangeMin] = useState();
  const [ageRangeMax, setAgeRangeMax] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [pills, setPills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const checkboxRefs = useRef([]);

  useEffect(() => {
    console.log("pills", pills)
  }, [pills])

  const handleOptionClick = (option) => {
    if (option.show === selectedOption?.show) {
      // If the clicked option is already selected, hide the input field
      setSelectedOption(null);
      setStartTime("");
      setEndTime("");
      setAgeRangeMin("");
      setAgeRangeMax("");
      setPhone("");
      setEmail("");
      setGender("");
      setLocation("");
    } else {
      // Otherwise, show the input field for the new option
      setSelectedOption(option);
    }
  };

  const handleInputSubmit = () => {
    if (selectedOption) {
      let newPills = [];

      switch (selectedOption.backend) {
        case "time":
          // Ensure startTime is less than endTime
          if (startTime && endTime && Number(startTime) < Number(endTime)) {
            newPills = [{ option: "time", value: `${startTime} - ${endTime}` }];
          } else {
            alert("Start Time must be smaller than End Time.");
            return; // Exit the function if the condition is not met
          }
          break;

        case "ageRangeMin":
          // Ensure ageRangeMin is less than ageRangeMax, if both are present
          if (
            ageRangeMin &&
            ageRangeMax &&
            Number(ageRangeMin) >= Number(ageRangeMax)
          ) {
            alert("hello");
            alert("Min Age must be smaller than Max Age.");
            return; // Exit the function if the condition is not met
          }
          if (ageRangeMin) {
            newPills = [{ option: "ageRangeMin", value: ageRangeMin }];
          }
          break;

        case "ageRangeMax":
          // Ensure ageRangeMin is less than ageRangeMax, if both are present
          if (
            ageRangeMin &&
            ageRangeMax &&
            Number(ageRangeMin) >= Number(ageRangeMax)
          ) {
            toast.error("Min Age must be smaller than Max Age.");
            return; // Exit the function if the condition is not met
          }
          if (ageRangeMax) {
            newPills = [{ option: "ageRangeMax", value: ageRangeMax }];
          }
          break;

        case "phone":
          if (phone) {
            newPills = [{ option: "phone", value: phone }];
          }
          break;

        case "email":
          if (email) {
            newPills = [{ option: "email", value: email }];
          }
          break;

        case "gender":
          if (gender) {
            newPills = [{ option: "gender", value: gender }];
          }
          break;

        case "location":
          if (location) {
            newPills = [{ option: "location", value: location }];
          }
          break;

        default:
          break;
      }

      if (newPills?.length) {
        const updatedPills = pills.filter(
          (pill) => !newPills.some((newPill) => newPill.option === pill.option)
        );
        setPills([...updatedPills, ...newPills]);
        // Clear inputs
        switch (selectedOption.backend) {
          case "time":
            setStartTime("");
            setEndTime("");
            break;
          // case 'ageRangeMin':
          //   setAgeRangeMin('');
          //   break;
          // case 'ageRangeMax':
          //   setAgeRangeMax(');
          //   break;
          case "phone":
            setPhone("");
            break;
          case "email":
            setEmail("");
            break;
          case "gender":
            setGender("");
            break;
          case "location":
            setLocation("");
            break;
          default:
            break;
        }
        setSelectedOption(null); // Hide the input field after submission
      }
    }
  };

  const removePill = (indexToRemove) => {
    setPills(pills.filter((_, index) => index !== indexToRemove));
  };

  const renderInputField = () => {
    const commonStyle = "border p-[6px] rounded-md w-full"; // Common style for all input fields
    const timeInputStyle = "border p-[6px] rounded-md w-[150px]"; // Smaller width for time inputs

    if (selectedOption?.backend === "time") {
      return (
        <div className="flex gap-2">
          <input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={timeInputStyle}
            placeholder="Start Time"
          />
          <input
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={timeInputStyle}
            placeholder="End Time"
          />
        </div>
      );
    }

    if (selectedOption?.backend === "ageRangeMin") {
      return (
        <input
          type="Number"
          value={ageRangeMin}
          onChange={(e) => setAgeRangeMin(e.target.value)}
          className={commonStyle}
          placeholder="Min Age Range"
        />
      );
    }
    if (selectedOption?.backend === "ageRangeMax") {
      return (
        <input
          type="Number"
          value={ageRangeMax}
          onChange={(e) => setAgeRangeMax(e.target.value)}
          className={commonStyle}
          placeholder="Max Age Range"
        />
      );
    }

    if (selectedOption?.backend === "phone") {
      return (
        <input
          type="Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={commonStyle}
          placeholder="Phone Number"
        />
      );
    }

    if (selectedOption?.backend === "email") {
      return (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={commonStyle}
          placeholder="Email Address"
        />
      );
    }

    if (selectedOption?.backend === "gender") {
      return (
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={commonStyle}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      );
    }

    if (selectedOption?.backend === "location") {
      return (
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={commonStyle}
          placeholder="Location"
        />
      );
    }

    return null;
  };

  const buildQueryString = (pills) => {
    return pills
      .map(
        (pill) =>
          `${encodeURIComponent(pill.option)}=${encodeURIComponent(pill.value)}`
      )
      .join("&");
  };

  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [page, setPage] = useState(searchParams.get("page") || 1);
  // const [pageLimit, setPageLimit] = useState(10);

  const [selectedType, setSelectedType] = useState("EMPLOYEE_SALES");

  const handleSelectChange = (event) => {
    const recordType = event.target.value;
    setSelectedType(recordType);
    const option = empOptions.find((option) => option.value === recordType);
    if (option) {
      dispatch(
        getAllAttendees({ page, recordType: option.label.toLocaleLowerCase() })
      );
    }
  };

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  useEffect(() => {
    console.log("parent useEffect")
    const filters = buildQueryString(pills);
    dispatch(getAllAttendees({ page, filters, recordType: "" }));
  }, [page, pills]);

  useEffect(() => {
    if (assigned?.length > 0) {
      setAssignedButton(true);
    } else {
      setAssignedButton(false);
    }
  }, [assigned]);

  const handleAssignNow = (selectedEmployee) => {
    dispatch(
      addAssign({
        userId: selectedEmployee,
        attendees: assigned,
      })
    ).then(() => {
      setShowModal(false);
      setAssigned([]);
      clearCheckboxes();
    });
  };

  const clearCheckboxes = () => {
    checkboxRefs.current.forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  return (
    <>
      <div className="px-4 md:px-8 py-10">
        <div className="flex justify-between">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-5">
            Manage Attendees Details
          </h3>
          <div className="relative inline-block text-left">
            <select
              value={selectedType}
              onChange={handleSelectChange}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer transition duration-150 ease-in-out"
            >
              <option value="" disabled>
                Select Record Type
              </option>
              {empOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          {/* Options List */}
          <div className="border text-gray-600 rounded-md text-sm h-8 items-center mb-5 px-3 flex justify-between gap-3 w-full">
            {options.map((option, idx) => (
              <span
                key={idx}
                className="hover:text-blue-800 flex items-center cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option.show}
                <IoIosArrowDown className="text-slate-400 mx-2" />
              </span>
            ))}
          </div>

          {/* Input Field */}
          {selectedOption && (
            <div className="mb-3 text-sm">
              <p className="text-gray-600">
                Enter value for
                <span className="text-blue-700"> {selectedOption.show}:</span>
              </p>
              <div className="flex items-center gap-3 mt-2">
                {renderInputField()}
                <button
                  className="py-1 px-3 bg-blue-500 text-white rounded-md"
                  onClick={handleInputSubmit}
                >
                  Add Filter
                </button>
              </div>
            </div>
          )}

          {/* Pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {pills.map((pill, index) => {
              const optionLabel =
                options.find((opt) => opt.backend === pill.option)?.show ||
                pill.option;
              return (
                <div
                  key={index}
                  className="text-sm hover:border-gray-400 cursor-pointer border p-2 rounded-full flex items-center"
                >
                  <span>{`${optionLabel}: ${pill.value}`}</span>
                  <button
                    onClick={() => removePill(index)}
                    className="ml-2 text-lg"
                  >
                    <IoClose />
                  </button>
                </div>
              );
            })}
            {pills?.length > 0 ? <button onClick={() => {
              const temp = pills.map(ite => {
                return `${ite?.option}=${ite?.value}`
              })
              console.log(`?${temp.join('&')}`)
            }} className="bg-blue-600 text-white font-medium px-5 rounded-lg" type="button">Save Presets</button> : ''}
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex gap-6">
            <div className="relative w-56">
              <button
                id="dropdownActionButton"
                className="inline-flex w-full text-nowrap justify-between items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2 "
                type="button"
                onClick={() => setSavedPresets((prev) => !prev)}
              >
                <span className="sr-only">Action button</span>
                Saved Filter Presets
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownAction"
                className={` ${savedPresets ? "" : "hidden"
                  } absolute top-full z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-full  `}
              >
                <ul
                  className="py-1 text-sm text-gray-700 "
                  aria-labelledby="dropdownActionButton"
                >
                  {
                    pills?.length > 0 ? pills?.map(pres => {
                      return <li>
                        <a href="#" className="block px-4 line-clamp-1 py-2 hover:bg-gray-100  ">
                          <span className="font-medium ">{pres?.option} : </span>
                          {pres?.value}
                        </a>
                      </li>
                    }) : <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">
                        No saved presets filter
                      </a>
                    </li>
                  }

                </ul>
              </div>
            </div>

            {/* <PageLimitEditor
              localStorageKey="viewAttendeesPageLimit"
              setLimit={(limit) => setPageLimit(limit)}
            /> */}
          </div>

          {assignedButton && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 rounded-md px-1 text-white"
              >
                Assign Employee
              </button>
            </div>
          )}
        </div>
        <AssignmentTable
          isLoading={isLoading}
          checkboxRefs={checkboxRefs}
          assignmentData={attendeeData?.result}
          page={page}
          setAssigned={setAssigned}
        />
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={pageCount}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>

      {showModal && (
        <EmployeeAssignModal
          employeeData={employeeData}
          selectedType={selectedType}
          onClose={() => setShowModal(false)}
          onAssign={handleAssignNow}
        />
      )}
    </>
  );
};

export default ViewAttendees;
