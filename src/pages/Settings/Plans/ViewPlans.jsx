import React from 'react'
import { FaRupeeSign } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";

const ViewPlans = () => {
  return (
    <div className='p-10 text-center text-gray-800 bg-gray-50 h-screen'>
      <h1 className='text-3xl font-bold'>Pricing</h1>
      <p className='pt-3 font-medium text-gray-500'>Sign Up in less than 30 seconds. Upgrade at anytime, no questions no hassle.</p>

      <div className='text-center my-10'>
        <a className='bg-emerald-400 text-white px-10 py-3 rounded-l-md font-bold text-sm cursor-pointer'>MONTHLY</a>
        <a className='bg-slate-100 text-gray-500 px-10 py-3 rounded-r-md font-bold text-sm cursor-pointer'>ANNUALLY</a>
        </div>
      
      <div className='grid grid-cols-4 gap-5'>
        <div className={`border ${true ? "bg-emerald-200" : "bg-white"}`}>
         {/* {true ? <p className='text-center font-bold text-lg pt-8 '>Basic Plan</p> : ""} */}
          <p className='text-center font-bold text-lg pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={23}/> <span className='text-5xl font-bold'>699 <span className='text-base font-medium text-gray-500'>/mo</span></span></p>
         
          <div className='text-gray-500  text-sm font-medium py-10'>
          <div className='flex items-center pl-5 gap-2 '><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Cred sociale lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Vitae liam lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Consequat ted tempus</p>
          </div>
          
           </div>

           {true ? <button className='border-2 cursor-pointer my-6 hover:border-green-700 hover:text-green-700  border-green-600 rounded-[5px]  py-2 px-10 font-bold text-green-600'>Active</button> : <button className='border-2 cursor-pointer my-6 hover:border-gray-600 hover:text-gray-700 border-gray-400 rounded-[5px]  py-2 px-10 font-bold text-gray-600'>Buy Now</button>}  
        </div>
        <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={23}/> <span className='text-5xl font-bold'>699 <span className='text-base font-medium text-gray-500'>/mo</span></span></p>
         
          <div className='text-gray-500  text-sm font-medium py-10'>
          <div className='flex items-center pl-5 gap-2 '><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Cred sociale lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Vitae liam lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Consequat ted tempus</p>
          </div>
          
           </div>

           <button className='border-2 cursor-pointer my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700 py-2 px-10 font-bold text-gray-600'>Buy Now</button>
        </div>
        <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={23}/> <span className='text-5xl font-bold'>699 <span className='text-base font-medium text-gray-500'>/mo</span></span></p>
         
          <div className='text-gray-500  text-sm font-medium py-10'>
          <div className='flex items-center pl-5 gap-2 '><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Cred sociale lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Vitae liam lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Consequat ted tempus</p>
          </div>
          
           </div>

           <button className='border-2 cursor-pointer my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700 py-2 px-10 font-bold text-gray-600'>Buy Now</button>
        </div>
        <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={23}/> <span className='text-5xl font-bold'>699 <span className='text-base font-medium text-gray-500'>/mo</span></span></p>
         
          <div className='text-gray-500  text-sm font-medium py-10'>
          <div className='flex items-center pl-5 gap-2 '><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Cred sociale lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Vitae liam lobortis erat</p>
          </div>
          <div className='flex items-center pl-5 gap-2'><CiCircleCheck className='text-green-600 ' size={24}/>
          <p>Consequat ted tempus</p>
          </div>
          
           </div>

           <button className='border-2 cursor-pointer my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700  py-2 px-10 font-bold text-gray-600'>Buy Now</button>
        </div>

      </div>
<div className=' mt-10 '> 
     <a href='/plans/addPlan' className='bg-blue-700 hover:bg-blue-600 text-white rounded-md py-1 px-10 text-lg font-bold'>Add Plan</a></div>
  
      </div>
  )
}

export default ViewPlans