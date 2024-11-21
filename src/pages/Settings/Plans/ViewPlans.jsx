import React, { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { roles } from "../../../utils/roles";
import { useDispatch, useSelector } from "react-redux";
import { getPricePlans } from "../../../features/actions/pricePlan";
import PlanCard from "./PlanCard";
import { Link } from "react-router-dom";

const ViewPlans = () => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";
  const { planData, isPlanDeleted } = useSelector((state) => state.pricePlans);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(planData, "planData");
  }, [planData, isPlanDeleted]);
  useEffect(() => {
    dispatch(getPricePlans());
  }, [isPlanDeleted]);

  return (
    <div className="p-4 sm:p-6 md:p-10 text-center text-gray-800 bg-gray-50 min-h-screen mt-12">
      <h1 className="text-2xl sm:text-3xl font-bold">Pricing</h1>
      <p className="pt-3 font-medium text-gray-500 text-sm sm:text-base">
        Sign Up in less than 30 seconds. Upgrade at anytime, no questions no
        hassle.
      </p>

      {/* <div className='text-center my-6 sm:my-10'>
        <a className='bg-emerald-400 text-white px-4 sm:px-10 py-2 sm:py-3 rounded-l-md font-bold text-xs sm:text-sm cursor-pointer'>MONTHLY</a>
        <a className='bg-slate-100 text-gray-500 px-4 sm:px-10 py-2 sm:py-3 rounded-r-md font-bold text-xs sm:text-sm cursor-pointer'>ANNUALLY</a>
      </div> */}

      <div className="grid grid-cols-1   lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        <div className="col-span-full  flex justify-end items-end pt-6">
          {/* {roles.SUPER_ADMIN === role && (
            <div className="">
              <Link to="/plans/addPlan">
                <button className="w-fit  bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                  Add Plan
                </button>
              </Link>
            </div>
          )} */}  
        </div>
        { planData && Array.isArray(planData) && planData?.map((item) => {
          return (
            <div className="">
              <PlanCard plan={item} key={item?._id} />

              {/* {true ? <button className='border-2 cursor-pointer my-4 sm:my-6 hover:border-green-700 hover:text-green-700 border-green-600 rounded-[5px] py-2 px-6 sm:px-10 font-bold text-green-600 text-sm'>Active</button> : <button className='border-2 cursor-pointer my-4 sm:my-6 hover:border-gray-600 hover:text-gray-700 border-gray-400 rounded-[5px] py-2 px-6 sm:px-10 font-bold text-gray-600 text-sm'>Buy Now</button>} */}
            </div>
          );
        })}

        {/* <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-6 sm:pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-3 sm:pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={20} /><span className='text-4xl sm:text-5xl font-bold'>699 <span className='text-sm sm:text-base font-medium text-gray-500'>/mo</span></span></p>

          <div className='text-gray-500 text-xs sm:text-sm font-medium py-6 sm:py-10'>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Cred sociale lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Vitae liam lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Consequat ted tempus</p></div>
          </div>

          <button className='border-2 cursor-pointer my-4 sm:my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700 py-2 px-6 sm:px-10 font-bold text-gray-600 text-sm'>Buy Now</button>
        </div>
        <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-6 sm:pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-3 sm:pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={20} /><span className='text-4xl sm:text-5xl font-bold'>699 <span className='text-sm sm:text-base font-medium text-gray-500'>/mo</span></span></p>

          <div className='text-gray-500 text-xs sm:text-sm font-medium py-6 sm:py-10'>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Cred sociale lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Vitae liam lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Consequat ted tempus</p></div>
          </div>

          <button className='border-2 cursor-pointer my-4 sm:my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700 py-2 px-6 sm:px-10 font-bold text-gray-600 text-sm'>Buy Now</button>
        </div>
        <div className='border bg-white'>
          <p className='text-center font-bold text-lg pt-6 sm:pt-8 '>Basic Plan</p>
          <p className='flex justify-center items-end pt-3 sm:pt-4'><FaRupeeSign className='pb-1 text-gray-800' size={20} /><span className='text-4xl sm:text-5xl font-bold'>699 <span className='text-sm sm:text-base font-medium text-gray-500'>/mo</span></span></p>

          <div className='text-gray-500 text-xs sm:text-sm font-medium py-6 sm:py-10'>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Cred sociale lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Vitae liam lobortis erat</p></div>
            <div className='flex items-center pl-4 sm:pl-5 gap-2'><CiCircleCheck className='text-green-600' size={20} /><p>Consequat ted tempus</p></div>
          </div>

          <button className='border-2 cursor-pointer my-4 sm:my-6 border-gray-400 rounded-[5px] hover:border-gray-600 hover:text-gray-700 py-2 px-6 sm:px-10 font-bold text-gray-600 text-sm'>Buy Now</button>
        </div> */}
      </div>
    </div>
  );
};

export default ViewPlans;
