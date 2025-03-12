import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPricePlanSuccess } from "../../../features/slices/pricePlan";

const PlanSelectorModal = ({ onClose, onSuccess, planData, setModal }) => {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("");
  const { isLoading, isSuccess } = useSelector((state) => state.pricePlans);
  const [error, setError] = useState(null);

  // Default month multipliers for plans
  const monthMultiplier = {
    monthly: 1,
    quarterly: 3,
    halfyearly: 6,
    yearly: 12,
  };

  // Validate incoming props
  if (!planData || typeof planData !== 'object') {
    console.error("Invalid planData prop");
    return null;
  }

  // Safe destructuring with defaults
  const { 
    planDurationConfig = {}, 
    name = "Plan Name", 
    amount = 0 
  } = planData;

  useEffect(() => {
    // Initialize selected plan when component mounts
    const planKeys = Object.keys(planDurationConfig);
    if (planKeys.length > 0 && !selectedPlan) {
      setSelectedPlan(planKeys[0]);
    }
  }, [planDurationConfig]);

  const calculatePlanPrice = (planKey) => {
     
    const durationConfig = planDurationConfig[planKey] || {};
    let basePrice = 0;
    if(planKey === "custom")
      basePrice = Number(amount) ;
      else
    basePrice = Number(amount) * (Number(monthMultiplier[planKey]) || 0);
    
    if (durationConfig.discountType === "flat") {
      return Math.max(basePrice - (Number(durationConfig.discountValue) || 0), 0);
    }
    if (durationConfig.discountType === "percent") {
      const discountValue = Number(durationConfig.discountValue) || 0;
      return Math.max(basePrice * ((100 - discountValue) / 100), 0);
    }
    return basePrice;
  };

  const totalAmount = calculatePlanPrice(selectedPlan);

  let discountAmount = 0;
  const durationConfig = planDurationConfig[selectedPlan] || {};
  if (selectedPlan && selectedPlan !== 'custom') {

    discountAmount =
      durationConfig.discountType === "flat"
        ? durationConfig.discountValue
        : (amount *
            monthMultiplier[selectedPlan] *
            durationConfig.discountValue) /
          100;
  }
  else if(selectedPlan && selectedPlan === 'custom'){

    discountAmount =
    durationConfig.discountType === "flat"
      ? durationConfig.discountValue
      : (amount *
          durationConfig.discountValue) /
        100;
  }

  
  const subtotal = totalAmount;
  const gst = subtotal * 0.18; // 18% GST
  const totalWithGST = subtotal + gst;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      setModal(false);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      dispatch(resetPricePlanSuccess());
    }
  }, [isSuccess]);

  const handleConfirmPlan = () => {
    const billingData = {
      durationType: selectedPlan,
      totalAmount: totalWithGST,
    };
    onSuccess(billingData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-fit">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">{name}</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          {Object.keys(planDurationConfig).map((key) => {
            const price = calculatePlanPrice(key);
            const duration = planDurationConfig[key]?.duration;
            const discountType = planDurationConfig[key]?.discountType;
            const discountValue = planDurationConfig[key]?.discountValue;

            return (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedPlan === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <h3 className="text-lg font-semibold capitalize">{key}</h3>
                <p className="text-sm text-gray-600">
                  {duration} days ·{" "}
                  {discountType === "flat"
                    ? `Flat discount of ₹${discountValue}`
                    : `Discount of ${discountValue}%`}
                </p>
                <p className="text-sm font-bold text-blue-600">
                  ₹{price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Price breakdown */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Base Price:</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{(selectedPlan === "custom" ? amount : amount * monthMultiplier[selectedPlan]).toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold">Discount:</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{discountAmount.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold">Subtotal:</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{subtotal.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold">GST (18%):</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{gst.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalWithGST.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Confirm Plan Button */}
        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleConfirmPlan}
          disabled={isLoading}
        >
          {isLoading ? "Confirming Plan..." : "Confirm Plan"}
        </button>
      </div>
    </div>
  );
};

export default PlanSelectorModal;
