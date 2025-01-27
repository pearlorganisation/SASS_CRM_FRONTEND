import React, { useEffect, useState } from "react";

const PlanSelectorModal = ({ onClose, onSuccess, planData, setModal }) => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const monthMultiplier = {
    monthly: 1,
    quarterly: 3,
    halfyearly: 6,
    yearly: 12,
  };

  const { planDurationConfig = {}, name } = planData;

  const baseAmount = 500;

  const calculatePlanPrice = (planKey) => {
    const durationConfig = planDurationConfig[planKey];
    if(!durationConfig) return 0;
    const basePrice = baseAmount * monthMultiplier[planKey];

    if (durationConfig.discountType === "flat") {
      return Math.max(basePrice - durationConfig.discountValue, 0);
    } else if (durationConfig.discountType === "percent") {
      return Math.max(
        basePrice * ((100 - durationConfig.discountValue) / 100),
        0
      );
    }

    return basePrice;
  };

  const totalAmount = calculatePlanPrice(selectedPlan);
  const plan = planDurationConfig[selectedPlan];
  const discountAmount =
    plan.discountType === "flat"
      ? plan.discountValue
      : (baseAmount * monthMultiplier[selectedPlan] * plan.discountValue) / 100;
  const subtotal = totalAmount;
  const gst = subtotal * 0.18; // 18% GST
  const totalWithGST = subtotal + gst;

  useEffect(() => {
    document.body.style.overflow = true ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
      setModal(false);
    };
  }, []);

  const handleConfirmPlan = () => {
    const billingData = {};
    billingData["planDuration"] = billingData["itemAmount"] = 1000;
    billingData["taxPercent"] = 0;
    billingData["taxAmount"] = 0;
    billingData["totalAmount"] = 1000;
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
                  {planDurationConfig[key].duration} days ·{" "}
                  {planDurationConfig[key].discountType === "flat"
                    ? `Flat discount of ₹${planDurationConfig[key].discountValue}`
                    : `Discount of ${planDurationConfig[key].discountValue}%`}
                </p>
                <p className="text-sm font-bold text-blue-600">
                  ₹{price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Base Price:</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{(baseAmount * monthMultiplier[selectedPlan]).toFixed(2)}
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

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleConfirmPlan}
        >
          Confirm Plan
        </button>
      </div>
    </div>
  );
};

export default PlanSelectorModal;
