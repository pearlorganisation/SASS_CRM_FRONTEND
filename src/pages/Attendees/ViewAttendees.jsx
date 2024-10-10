import { Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendees } from "../../features/actions/webinarContact";
import Pagination from "@mui/material/Pagination";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Select from "react-select"
import { addAssign } from "../../features/actions/assign";

const ViewAttendees = () => {
  const [savedPresets, setSavedPresets] = useState(false);
  const [assignedButton, setAssignedButton] = useState(false);
  const [assignedEmployee,setAssignedEmployee]= useState();
  const [assigned, setAssigned] = useState([]);
  const dispatch = useDispatch();
  const { attendeeData, isLoading } = useSelector(
    (state) => state.webinarContact
  );
  const { employeeData } = useSelector(
    (state) => state.employee
  );

  const pageCount = attendeeData?.totalPages;


  const options = [
    { show: "Email", backend: 'email' },
    { show: "Start - End Time", backend: 'time' },
    { show: "Gender", backend: 'gender' },
    { show: "Location", backend: 'location' },
    { show: "Min Age Range", backend: 'ageRangeMin' },
    { show: "Max Age Range", backend: 'ageRangeMax' },
    { show: "Search From Mobile Number", backend: 'phone' }
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ageRangeMin, setAgeRangeMin] = useState();
  const [ageRangeMax, setAgeRangeMax] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [pills, setPills] = useState([]);

  const handleOptionClick = (option) => {
    if (option.show === selectedOption?.show) {
      // If the clicked option is already selected, hide the input field
      setSelectedOption(null);
      setStartTime('');
      setEndTime('');
      setAgeRangeMin('');
      setAgeRangeMax('');
      setPhone('');
      setEmail('');
      setGender('');
      setLocation('');
    } else {
      // Otherwise, show the input field for the new option
      setSelectedOption(option);
    }
  };
console.log(ageRangeMin,"sdvsdf")
 
const handleInputSubmit = () => {
    if (selectedOption) {
      let newPills = [];
      
      switch (selectedOption.backend) {
        case 'time':
          // Ensure startTime is less than endTime
          if (startTime && endTime && Number(startTime) < Number(endTime)) {
            newPills = [{ option: 'time', value: `${startTime} - ${endTime}` }];
          } else {
            alert("Start Time must be smaller than End Time.");
            return; // Exit the function if the condition is not met
          }
          break;
          
          case 'ageRangeMin':
            // Ensure ageRangeMin is less than ageRangeMax, if both are present
            if (ageRangeMin && ageRangeMax && Number(ageRangeMin) >= Number(ageRangeMax)) {
              alert("hello",)
              alert("Min Age must be smaller than Max Age.");
              return; // Exit the function if the condition is not met
            }
            if (ageRangeMin) {
              newPills = [{ option: 'ageRangeMin', value: ageRangeMin }];
              alert("hi")
            }
            break;

          case 'ageRangeMax':
              // Ensure ageRangeMin is less than ageRangeMax, if both are present
              if (ageRangeMin && ageRangeMax && Number(ageRangeMin) >= Number(ageRangeMax)) {
                alert("Min Age must be smaller than Max Age.");
                return; // Exit the function if the condition is not met
              }
              if (ageRangeMax) {
                newPills = [{ option: 'ageRangeMax', value: ageRangeMax }];
              }
              break;
              
          
        case 'phone':
          if (phone) {
            newPills = [{ option: 'phone', value: phone }];
          }
          break;
          
        case 'email':
          if (email) {
            newPills = [{ option: 'email', value: email }];
          }
          break;
          
        case 'gender':
          if (gender) {
            newPills = [{ option: 'gender', value: gender }];
          }
          break;
          
        case 'location':
          if (location) {
            newPills = [{ option: 'location', value: location }];
          }
          break;
          
        default:
          break;
      }
  
      if (newPills.length) {
        const updatedPills = pills.filter(pill => !newPills.some(newPill => newPill.option === pill.option));
        setPills([...updatedPills, ...newPills]);
        // Clear inputs
        switch (selectedOption.backend) {
          case 'time':
            setStartTime('');
            setEndTime('');
            break;
          // case 'ageRangeMin':
          //   setAgeRangeMin('');
          //   break;
          // case 'ageRangeMax':
          //   setAgeRangeMax(');
          //   break;
          case 'phone':
            setPhone('');
            break;
          case 'email':
            setEmail('');
            break;
          case 'gender':
            setGender('');
            break;
          case 'location':
            setLocation('');
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

    if (selectedOption?.backend === 'time') {
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


    if (selectedOption?.backend === 'ageRangeMin') {
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
    if (selectedOption?.backend === 'ageRangeMax') {
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

    if (selectedOption?.backend === 'phone') {
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

    if (selectedOption?.backend === 'email') {
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

    if (selectedOption?.backend === 'gender') {
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

    if (selectedOption?.backend === 'location') {
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
    return pills.map((pill) => `${encodeURIComponent(pill.option)}=${encodeURIComponent(pill.value)}`).join('&');
  };

  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  useEffect(() => {
    const filters = buildQueryString(pills);
    console.log(filters);
    dispatch(getAllAttendees({ page, filters }));
  }, [page, pills, dispatch]);

  useEffect(()=>{
    if(assigned.length >0){
      setAssignedButton(true)
    }else{
      setAssignedButton(false)
    }
    console.log(assigned)
    console.log(assignedEmployee)
  },[assigned])


  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-5">
          Manage Attendees Details
        </h3>

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
              const optionLabel = options.find(opt => opt.backend === pill.option)?.show || pill.option;
              return (
                <div key={index} className="text-sm hover:border-gray-400 cursor-pointer border p-2 rounded-full flex items-center">
                  <span>{`${optionLabel}: ${pill.value}`}</span>
                  <button onClick={() => removePill(index)} className="ml-2 text-lg">
                    <IoClose />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

            <div className="flex justify-between gap-4">

              <div className="relative">
                <button
                  id="dropdownActionButton"
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2 "
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownAction"
                  className={` ${
                    savedPresets ? "" : "hidden"
                  } absolute top-full z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44  `}
                >
                  <ul
                    className="py-1 text-sm text-gray-700 "
                    aria-labelledby="dropdownActionButton"
                  >
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100  "
                      >
                        No saved presets filter
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
             {assignedButton && <div className="flex gap-4">
              <Select 

              options={Array.isArray(employeeData) && employeeData.map((item)=>({value:item?._id ,label:item?.userName})) }
              onChange={(selectedOption) => setAssignedEmployee(selectedOption.value)}
              />
             {assignedEmployee && <button onClick={()=>dispatch(addAssign({userId:assignedEmployee,attendees:assigned}))} 
             className="bg-blue-600 rounded-md px-1 text-white">Assign Now</button>}</div>}
            </div>
        <div className="mt-7 shadow-lg rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
              <tr>
                <th className=""></th>
                <th className="py-3 px-6 text-center">S No.</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">First Name</th>
                <th className="py-3 px-6">Last Name</th>
                <th className="py-3 text-center px-6">Webinar Minutes</th>
                <th className="py-3 text-center px-6">Total Records</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center px-6 py-8">
                    <Stack spacing={4}>
                      <Skeleton variant="rounded" height={30} />
                      <Skeleton variant="rounded" height={25} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                      <Skeleton variant="rounded" height={20} />
                    </Stack>
                  </td>
                </tr>
              ) : (
                Array.isArray(attendeeData?.result) &&
                attendeeData?.result.length > 0 ?
                attendeeData?.result?.map((item, idx) => {
                  const serialNumber = (page - 1) * 25 + idx + 1;
                  return (
                    <tr key={idx}>
                      <td className="ps-4 py-4 whitespace-nowrap">
                      <input onClick={(e)=>{
                         if(e.target.checked){
                          setAssigned(prev => [...prev,{ attendeeId:item?._id,email:item?.email}])
                        }else{
                          setAssigned(prev => prev.filter(attendeeObj => attendeeObj.attendeeId !== item?._id))
                        }

                      }} type="checkbox" className="scale-125"/>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {item._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {item?.records[0]?.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {item?.records[0]?.lastName?.match(/:-\)/)
                            ? "--"
                            : item?.lastName}
                      </td>
               
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item?.records?.reduce((acc,time)=>
                            acc + time?.timeInSession
                          ,0)}
                      </td>
                      <td className="px-6 py-4  text-center whitespace-nowrap">
                      {item?.records?.length}
                      </td>
                      <td className="px-3 whitespace-nowrap">
                      <Link to={"/particularContact"} state={item}
                            className="cursor-pointer py-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50 rounded-lg
                    "
                          >
                            View full details
                          </Link>
                        <button
                          onClick={() => {
                            handleDeleteModal(item?._id);
                          }}
                          className="py-2 px-3 leading-none font-semibold text-red-500 hover:text-red-600 duration-150 hover:bg-gray-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
                : <div className="text-gray-700 p-3">No Data Found</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={pageCount}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>
    </>
  );
};

export default ViewAttendees;
