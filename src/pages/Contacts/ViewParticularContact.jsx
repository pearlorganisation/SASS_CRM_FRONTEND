import React, { useState } from "react";
import { toast } from "sonner";
import { BiSolidCopy } from "react-icons/bi";

import Select from "react-select";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import ViewTimerModal from "./Modal/ViewTimerModal";
import { useLocation } from "react-router-dom";

const ViewParticularContact = () => {

  const {state:item} = useLocation()

console.log(item)
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal(true);
  };

  const [showTimerModal, setShowTimerModal] = useState(false);

  const handleTimerModal = () => {
    setShowTimerModal(true);
  };

    // PHONE NUMBER SECTION
  
    const handleCopyClick = (textToCopy) => {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast("Text copied to clipboard!", { position: "top-center" });
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };
  
  //  LEAD TYPE SECTION
  
  const [selectedOption, setSelectedOption] = useState(null);

  const getColor = (option) => {
    switch (option?.value) {
      case "Hot":
        return "#ef4444"; // Orange
      case "Mild":
        return "#ffab00"; // Yellow
      case "Cold":
        return "#3b82f6"; // Blue
      default:
        return "white";
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #CBD5E1", // Custom border style
      borderRadius: "7px",
      backgroundColor: getColor(selectedOption),
      boxShadow: "none", // Remove the default box shadow
      "&:hover": {
        borderColor: "none", // Keep the border color consistent on hover
      },
      "&:focus": {
        outline: "none", // Remove the focus outline
        borderColor: "#CBD5E1", // Ensure the border color remains the same
      }, // Change background color based on the selected option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF", // Custom placeholder color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#FFFFFF", // Default text color for the selected option
    }),
  };

  return (
    <>
      <div className=" max-w-screen-xl mx-auto px-4 md:px-2 pt-12 space-y-7">
        <div className="flex justify-between  ">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Attendee Contact Details
          </h3>
          <p className=" rounded-lg bg-slate-100  text-sm px-2 py-1">Call Timer is scheduled at <span className="text-green-600">5:00 PM</span> by James </p>
        </div>
<div className="grid grid-cols-[47%_auto]  max-h-fit gap-10 ">

        <div className=" flex-col space-y-3 h-full ">
        <div className="border rounded-lg py-2  px-3 shadow-md">
              <p>
                Email :{" "}
                <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
              
        {item?.email}
        {/* dummy@gmail.com */}
                </span>
              </p>
           </div>
          <div className="flex justify-between border rounded-lg py-2 px-3 shadow-md">
      
              <p>
               Name :{" "}
                <span className="ms-2 bg-slate-100 rounded-md px-3 py-1">
                 
 {item?.firstName}{" "}{item?.lastName?.match(/:-\)/) ? '' : item?.lastName}
 {/* Dummy  */}
 
                </span>
              </p>
            
              </div>

            

                 <div className="border rounded-lg py-1  px-3  shadow-md">
            <p className="flex items-center">
              {" "}
              Phone Number :
              <span className="ms-2 grid lg:grid-cols-2 gap-3" >
     
        <span onClick={() => handleCopyClick(item?.phone) } className="flex justify-center items-center gap-1 bg-red-500 ms-2 p-1 text-white cursor-pointer rounded-md px-2 py-1">
         {item?.phone}
         {/* 9876543210 */}
         <BiSolidCopy color="#050A30" size={12} />
         </span>
              
             
              </span>
            </p>
          </div>

          <div className="flex justify-between gap-20 min-h-[73%] ">
          <div className="border rounded-lg overflow-auto shadow-md  scrollbar-thin w-full ">
            <div className="border-b-4 py-2">
              {" "}
              <span className="font-semibold  px-3 ">Notes</span>{" "}
            </div>

            <div
              className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
              onClick={handleModal}
            >
              <div className="bg-red-500 w-[7px] h-full absolute"></div>
              <div className="flex  pl-4 pr-2 pt-2 justify-between ">
                <div className="text-xs font-semibold ">Note 1 : </div>
                <div className="flex gap-2">
                  <p className="text-xs">
                    Date :{" "}
                    <span className="  rounded-md px-2 ">17 May 2024 </span>
                  </p>
                  <p className="text-xs">
                    Call Duration :{" "}
                    <span className="  rounded-md px-2 ">10 mins </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-3">
                <p className="text-sm  rounded-md px-2 py-2 bg-slate-100 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  quaerat...
                </p>
              </div>
              <div className="px-2 py-2 flex justify-end">
                {/* <button onClick={handleModal} className='text-sm rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700'>View Full Details</button> */}
              </div>
            </div>
            <div
              className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
              onClick={handleModal}
            >
              <div className="bg-green-500 w-[7px] h-full absolute"></div>
              <div className="flex  pl-4 pr-2 pt-2 justify-between ">
                <div className="text-xs font-semibold ">Note 2 : </div>
                <div className="flex gap-2">
                  <p className="text-xs">
                    Date :{" "}
                    <span className="  rounded-md px-2 ">17 May 2024 </span>
                  </p>
                  <p className="text-xs">
                    Call Duration :{" "}
                    <span className="  rounded-md px-2 ">10 mins </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-3">
                <p className="text-sm  rounded-md px-2 py-2 bg-slate-100 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  quaerat...
                </p>
              </div>
              <div className="px-2 py-2 flex justify-end">
                {/* <button onClick={handleModal} className='text-sm rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700'>View Full Details</button> */}
              </div>
            </div>
            
            <div
              className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
              onClick={handleModal}
            >
              <div className="bg-blue-500 w-[7px] h-full absolute"></div>
              <div className="flex  pl-4 pr-2 pt-2 justify-between ">
                <div className="text-xs font-semibold ">Note 3 : </div>
                <div className="flex gap-2">
                  <p className="text-xs">
                    Date :{" "}
                    <span className="  rounded-md px-2 ">17 May 2024 </span>
                  </p>
                  <p className="text-xs">
                    Call Duration :{" "}
                    <span className="  rounded-md px-2 ">10 mins </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-3">
                <p className="text-sm  rounded-md px-2 py-2 bg-slate-100 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  quaerat...
                </p>
              </div>
              <div className="px-2 py-2 flex justify-end">
                {/* <button onClick={handleModal} className='text-sm rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700'>View Full Details</button> */}
              </div>
            </div>
            <div
              className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
              onClick={handleModal}
            >
              <div className="bg-red-500 w-[7px] h-full absolute"></div>
              <div className="flex  pl-4 pr-2 pt-2 justify-between ">
                <div className="text-xs font-semibold ">Note 4 : </div>
                <div className="flex gap-2">
                  <p className="text-xs">
                    Date :{" "}
                    <span className="  rounded-md px-2 ">17 May 2024 </span>
                  </p>
                  <p className="text-xs">
                    Call Duration :{" "}
                    <span className="  rounded-md px-2 ">10 mins </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center pt-3">
                <p className="text-sm  rounded-md px-2 py-2 bg-slate-100 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  quaerat...
                </p>
              </div>
              <div className="px-2 py-2 flex justify-end">
                {/* <button onClick={handleModal} className='text-sm rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700'>View Full Details</button> */}
              </div>
            </div>

         
          </div>
          </div>

   

        </div>
      

       

<div className="space-y-3  h-full">
<div className="flex  justify-between gap-10  items-center">
         <div className="flex items-center gap-3">
          <div><span className="font-semibold">Set Alarm :</span></div>
         <button onClick={handleTimerModal} className=" font-semibold shadow rounded-md py-2 bg-blue-600 hover:bg-blue-700 text-white min-w-36">Set Alarm</button>
         </div>
          <div className="flex items-center gap-3">  
            <span className="font-semibold">Lead Type :</span>
            <div className="outline-none">
              <Select
                isClearable="true"
                options={[
                  { value: "Hot", label: "Hot" },
                  { value: "Mild", label: "Mild" },
                  { value: "Cold", label: "Cold" },
                ]}
                onChange={(selectedOption) => setSelectedOption(selectedOption)}
                className=" font-semibold shadow  min-w-36"
                placeholder="Lead Type "
                styles={customStyles}
              />
            </div>
            </div>

          </div>

          <div className="border rounded-lg space-y-3 shadow-md min-h-[91%] ">
            <div className="border-b-4 py-2">
             
              <span className="font-semibold px-5 ">Add Note</span>
            </div>
            <div className="px-5">
              <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-5 ">
                <div className="w-[60%]">
                  <label className="font-medium text-sm">Phone Number</label>
                  <input
                    //    {...register('duration', { required:true })}
                    type="text"
                    className="w-full mt-1  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                  />
                  {/* {errors.duration && (
                   <span className="text-red-500">
                     Duration is required
                   </span>
                 )} */}
                </div>

                <div className="w-[40%]">
                  <label className="font-medium text-sm">Call Duration <span className="font-normal text-xs">(hr : min : sec)</span></label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="text"
                      data-index={0}
                      defaultValue={"00"}
                      className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
                      maxLength={2}
                    />
                    
                    <span className="font-light px-1 ">:</span>
                    <input
                      type="text"
                      data-index={0}
                      defaultValue={"00"}
                      className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
                      maxLength={2}
                    />
                    <span className="font-light px-1">:</span>
                    <input
                      type="text"
                      data-index={1}
                      defaultValue={"00"}
                      className="w-10 h-10 rounded-lg border focus:border-teal-500 outline-none text-center text-xl"
                      maxLength={2}
                    />

                  </div>
        
                </div>
              </div>
              <div className="pt-2">
                <div className="font-medium">Status </div>
                <Select
                
                  options={[
                    { value: "Payment", label: "Payment" },
                    { value: "Discussion", label: "Discussion" },
                    { value: "Other", label: "Other" },
                  ]}
               
                  className="mt-1 text-sm shadow"
                  placeholder="Choose Status "
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "1px solid #CBD5E1", // Set custom border style
                      borderRadius: "7px",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#9CA3AF", // Set custom placeholder color
                    }),
                  }}
                />
              </div>

              <div className="pt-2 ">
                <label className="font-medium text-sm" >Note</label>
                <textarea
                  //    {...register('duration', { required:true })}
                  className="w-full mt-1  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {/* {errors.duration && (
                   <span className="text-red-500">
                     Duration is required
                   </span>
                 )} */}
              </div>
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p className=" text-gray-700 max-w-xs mx-auto">
                    Click to{" "}
                    <span className="font-medium text-indigo-600">
                      Upload Image
                    </span>{" "}
                    or drag your Image here
                  </p>
                </label>
                <input id="file" type="file" className="hidden" />
              </div>
              <button className="bg-indigo-700 w-full hover:bg-indigo-800 mt-2 text-white py-2 px-4 rounded-md">Submit </button>
            </div>

            <div></div>
          </div>

          </div>
        
      </div>
      <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
          {/* {attendeeData?.result?.length <= 0 ? (
            <div className="text-lg p-2 flex justify-center w-full">
              No record found
            </div>
          ) : ( */}
            <table className="w-full table-auto text-sm text-left ">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
                <tr>
                  <th className="py-3 px-2">S No.</th>
                  <th className="py-3 px-2">Webinar</th>
                  <th className="py-3 px-2">First Name</th>
                  <th className="py-3 px-2">Last Name</th>
                  <th className="py-3 px-2">Webinar Minutes</th>
                  <th className="py-3 px-2">Webinar Date</th>

          
                </tr>
              </thead>

              <tbody className="text-gray-600 divide-y">
                {/* {false ? (
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
                  attendeeData?.result?.length > 0 &&
                  attendeeData?.result?.map((item, idx) => {
                    const serialNumber = (page - 1) * 25 + idx + 1;
              
                    return ( */}
                      <tr>
                        <td
                          className={`px-3 py-4 whitespace-nowrap `}
                        >
                          {/* {serialNumber} */}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap ">
                          {/* {item?.firstName} */}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {/* {item?.lastName?.match(/:-\)/)
                            ? "--"
                            : item?.lastName} */}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {/* {item.email} */}
                        </td>
                        <td className="text-center py-4 whitespace-nowrap">
                          {/* {item?.timeInSession} */}
                        </td>

                 
                      </tr>
                    {/* );
                  })
                )} */}
              </tbody>
            </table>
          {/* )} */}
        </div>
      </div>
      {showModal && <ViewFullDetailsModal setModal={setShowModal} />}
      {showTimerModal && <ViewTimerModal setModal={setShowTimerModal} />}
    </>
  );
};

export default ViewParticularContact;
