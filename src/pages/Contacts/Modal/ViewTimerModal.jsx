import React, { useState } from 'react'
import Select from "react-select"

const ViewTimerModal = ({setModal}) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('AM');

  const handleHoursChange = (e) => {
    let value = e.target.value;
    if (value.length > 2) {
      value = value.slice(0, 2);
    }
    if (value > 12) {
      value = '12';
    } else if (value < 1) {
      value = '01';
    }
    setHours(value.padStart(2, '0'));
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;
    if (value.length > 2) {
      value = value.slice(0, 2);
    }
    if (value > 59) {
      value = '59';
    } else if (value < 0) {
      value = '00';
    }
    setMinutes(value.padStart(2, '0'));
  };

  const togglePeriod = () => {
    setPeriod((prevPeriod) => (prevPeriod === 'AM' ? 'PM' : 'AM'));
  };

  return (
    
    <div
    className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
    aria-labelledby="header-3a content-3a"
    aria-modal="true"
    tabindex="-1"
    role="dialog"
  >
    {/*    <!-- Modal --> */}
    <div
      className="flex h-auto sm:w-[35%]  flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl "
      id="modal"
      role="document"
    >
     <div className='flex gap-5'>
        <div className=' rounded-lg p-5 bg-slate-50 w-full' >
     <div className=''>
         <label className='font-medium text-sm '>Time </label>
      {/* <input type='time'  className='w-full mt-1  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border rounded-lg focus:border-teal-400 shadow-sm rounded-lg"' /> */}
      <div className='  w-full flex  items-center gap-3 p-1'>
      <input
        className="border bg-white w-12 h-10 rounded-md text-center"
        type="number"
        value={hours}
        onChange={handleHoursChange}
        placeholder="HH"
        min="1"
        max="12"
      /> 
      :
      <input
        className="border bg-white w-12 h-10 rounded-md text-center"
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
        min="0"
        max="59"
      />
      <button
        className="border bg-white active: w-12 h-10 rounded-md"
        onClick={togglePeriod}
      >
        {period}
      </button>
      </div>
      </div>
         <div className="pt-2 ">
                <label className="font-medium text-sm" >Note</label>
                <textarea
                  //    {...register('duration', { required:true })}
                  className="w-full bg-white mt-1  px-5 py-2 text-gray-500 text-sm border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {/* {errors.duration && (
                   <span className="text-red-500">
                     Duration is required
                   </span>
                 )} */}
              </div>
              <button className='text-white bg-blue-600 hover:bg-blue-700  py-1 px-4 mt-2 rounded-md  border-md'>Save</button>
      </div>
        
        <div>
        <button
          onClick={() => setModal(false)}
          className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
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
        </div>
</div>
</div>
    
  )
}

export default ViewTimerModal