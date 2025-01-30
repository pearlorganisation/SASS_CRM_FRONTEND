import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPricePlans } from "../../../features/actions/pricePlan";
import PlanCard from "./PlanCard";
import { getUserSubscription } from "../../../features/actions/auth";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";
import useRoles from "../../../hooks/useRoles";
import { Link } from "react-router-dom";
import { resetPricePlanSuccess } from "../../../features/slices/pricePlan";
import PlanInactiveModal from "./PlanInactiveModal";

const ViewPlans = () => {
  const roles = useRoles();
  const { userData, subscription } = useSelector((state) => state.auth);
  const { planData, isPlanDeleted, isSuccess, isLoading } = useSelector(
    (state) => state.pricePlans
  );
  const dispatch = useDispatch();

  const [modalData, setModalData] = useState(null);
  const [planType, setPlanType] = useState("active");

  useEffect(() => {
    dispatch(getPricePlans({ isActive: planType }));
  }, [planType]);

  useEffect(() => {
    dispatch(getUserSubscription());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getPricePlans({ isActive: planType }));
      resetPricePlanSuccess();
    }
  }, [isSuccess]);

  return (
    <div className="py-14 px-6 flex flex-col items-center">
      <div className="p-6 bg-gray-50 rounded-lg w-full">
        <div className="flex gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Plans </h2>
        </div>

        <div className="grid grid-cols-1   lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          <div className="col-span-full  flex justify-end items-end pt-6">
            <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
              <div className=" flex gap-5 w-full justify-between">
                <div className="flex gap-5">
                  <Link to="/plans/order">
                    <button className="w-fit  bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300">
                      Change Order
                    </button>
                  </Link>
                  <Link to="/plans/addPlan">
                    <button className="w-fit  bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300">
                      Add Plan
                    </button>
                  </Link>
                </div>

                <button
                  onClick={() => {
                    console.log(planType);
                    setPlanType(planType === "active" ? "inactive" : "active");
                  }}
                  disabled={isLoading}
                  className="w-fit bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  {planType === "active" ? "Inactive" : "Active"} Plans
                </button>
              </div>
            </ComponentGuard>
          </div>
          {planData &&
            Array.isArray(planData) &&
            planData?.map((item, idx) => {
              return (
                <div key={idx} className="">
                  <PlanCard
                    plan={item}
                    planType={planType}
                    setModalData={setModalData}
                    isMenuVisible={true}
                    key={item?._id}
                    currentPlan={subscription?.plan?._id}
                  />
                </div>
              );
            })}
        </div>
        {modalData && (
          <PlanInactiveModal
            setModalData={setModalData}
            modalData={modalData}
            planType={planType}
            
          />
        )}
      </div>
    </div>
  );
};

export default ViewPlans;
