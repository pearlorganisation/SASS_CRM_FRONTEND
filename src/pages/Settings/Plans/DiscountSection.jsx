import React, { useEffect, useState } from "react";
import { errorToast } from "../../../utils/extra";

const DiscountSection = (props) => {
  const { planDurationConfig, setPlanDurationConfig, watch, regularDurations } =
    props;

  const [isRegularDuration, setIsRegularDuration] = useState(true);

  const handleInputChange = (key, field, value) => {
    if (field === "discountType") {
      setPlanDurationConfig((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          discountValue: 0,
          discountType: value,
        },
      }));
    } else {
      const planAmount = watch("amount");
      if (
        value > planAmount &&
        planDurationConfig[key].discountType === "flat"
      ) {
        errorToast("Discount value cannot exceed Plan Amount.");
        return;
      } else if (
        value > 100 &&
        planDurationConfig[key].discountType === "percent"
      ) {
        errorToast("Discount value cannot exceed 100%.");
        return;
      }

      setPlanDurationConfig((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          discountValue: Number(value),
        },
      }));
    }
  };


  useEffect(() => {
    if(planDurationConfig.custom){
      setIsRegularDuration(false)
    }else{
      setIsRegularDuration(true)
    }

  },[planDurationConfig])

  return (
    <div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 px-4 cursor-pointer">
          <input
            type="radio"
            name="durationType"
            checked={isRegularDuration}
            onChange={() => {
              setIsRegularDuration(true);
              setPlanDurationConfig(regularDurations);
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span>Regular Durations</span>
        </label>
        <label className="flex items-center gap-2 px-4 cursor-pointer">
          <input
            type="radio"
            name="durationType"
            checked={!isRegularDuration}
            onChange={() => {
              setIsRegularDuration(false);
              setPlanDurationConfig({
                custom: {
                  duration: 0,
                  discountType: "percent",
                  discountValue: 0,
                },
              });
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span>Custom Durations</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {Object.entries(planDurationConfig).map(([key, config]) => (
          <div
            key={key}
            className="p-4 border rounded-lg shadow-md bg-white space-y-4"
          >
            <h3 className="text-lg font-bold capitalize">{key}</h3>
            <div className="space-y-2">
              {key === "custom" && (
                <div className="flex flex-col">
                  <label
                    htmlFor="custom-duration-value"
                    className="text-sm font-medium"
                  >
                    Duration
                  </label>
                  <input
                    type="number"
                    id="custom-duration-value"
                    value={config.duration}
                    onChange={(e) =>
                      setPlanDurationConfig((prev) => ({
                        custom: {
                          duration: Number(e.target.value),
                          discountType: prev.custom.discountType,
                          discountValue: prev.custom.discountValue,
                        },
                      }))
                    }
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor={`${key}-type`} className="text-sm font-medium">
                  Discount Type
                </label>
                <select
                  id={`${key}-type`}
                  value={config.discountType}
                  onChange={(e) =>
                    handleInputChange(key, "discountType", e.target.value)
                  }
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </select>
              </div>

              {/* Discount Value Input */}
              <div className="flex flex-col">
                <label htmlFor={`${key}-value`} className="text-sm font-medium">
                  Discount Value
                </label>
                <input
                  type="number"
                  id={`${key}-value`}
                  value={config.discountValue}
                  onChange={(e) =>
                    handleInputChange(key, "discountValue", e.target.value)
                  }
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                  max={
                    config.discountType === "percent"
                      ? 100
                      : watch("amount") || 0
                  }
                />
                {config.discountType === "percent" ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Discount value cannot exceed 100%.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Discount value cannot exceed Plan Amount.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountSection;
