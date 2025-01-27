import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPricePlans } from "../../features/actions/pricePlan";
import PlanCard from "../Settings/Plans/PlanCard";
import { errorToast } from "../../utils/extra";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { updateClientPlan } from "../../features/actions/client";

const UpdateClientPlan = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { planData } = useSelector((state) => state.pricePlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [durationType, setDurationType] = useState(null);

  const { isUpdating, isSuccess } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(getPricePlans());
  }, []);

  const handleConfirmPlan = () => {
    if (!selectedPlan) errorToast("Please select a plan");
    if(!id) errorToast("Client ID not found");
    const payload = {
      adminId: id,
      planId: selectedPlan,
      durationType,
    };
    console.log(payload);
    dispatch(updateClientPlan(payload));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/clients");
    }
  }, [isSuccess]);

  return (
    <div className=" w-full pt-14 p-6">
      <div className="p-6 bg-gray-50  rounded-lg">
        <div className="flex gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Update Plan</h2>
          <button
            onClick={handleConfirmPlan}
            disabled={!selectedPlan || isUpdating}
            className=" px-6 w-fit bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {isUpdating ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Confirm Plan"
            )}
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4">
          {Array.isArray(planData) &&
            planData.map((item, index) => (
              <div key={index} className="min-w-72">
                <PlanCard
                  plan={item}
                  key={item._id}
                  isSelectVisible={true}
                  selectedPlan={selectedPlan}
                  handlePlanSelection={(id, billing) => {
                    setSelectedPlan(id);
                    setDurationType(billing.durationType || "monthly");
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateClientPlan;
