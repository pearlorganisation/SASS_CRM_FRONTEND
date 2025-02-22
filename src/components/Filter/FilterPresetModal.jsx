import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import {
  creattFilterPreset,
  deleteFilterPreset,
  getFilterPreset,
} from "../../features/actions/filter-preset";
import { clearPreset } from "../../features/slices/filter-preset";
import { errorToast, formatDateAsNumber } from "../../utils/extra";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllProductsByAdminId } from "../../features/actions/product";

const FilterPresetModal = ({
  setIsPresetModalOpen,
  tableName = "",
  filters = {},
  setFilters,
}) => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { leadTypeData } = useSelector((state) => state.assign);
  const { plansForDropdown } = useSelector((state) => state.pricePlans);
  const { productDropdownData } = useSelector((state) => state.product);

  const { filterPresets, isSuccess } = useSelector(
    (state) => state.filterPreset
  );
  const [newPresetName, setNewPresetName] = useState("");
  const [activePresetId, setActivePresetId] = useState(null);

  const handleSavePreset = () => {
    if (
      filters &&
      !Array.isArray(filters) &&
      typeof filters === "object" &&
      Object.keys(filters).length > 0
    ) {
      const payload = {
        name: newPresetName,
        tableName: tableName,
        filters: filters,
      };

      dispatch(creattFilterPreset(payload));
      logUserActivity({
        action: "create",
        type: `Filter Preset for Table - ${tableName}`,
        detailItem: newPresetName,
      });
    } else {
      errorToast("Please select at least one filter");
    }
  };

  const onApplyPreset = (preset) => {
    setFilters(preset.filters);
    setIsPresetModalOpen(false);
    logUserActivity({
      action: "filter",
      type: `Preset for Table - ${tableName}`,
      detailItem: preset?.name,
    });
  };

  const onClose = () => {
    setIsPresetModalOpen(false);
    dispatch(clearPreset());
  };

  useEffect(() => {
    if (tableName === "webinarAttendeesTable") {
      dispatch(getAllProductsByAdminId());
    }

    dispatch(getFilterPreset(tableName));
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setNewPresetName("");
      dispatch(getFilterPreset(tableName));
    }
  }, [isSuccess]);

  return (
    <Modal open={true} onClose={onClose} disablePortal>
      <Box className="p-4 max-w-full w-96 sm:max-w-xl sm:w-full  bg-gray-50 rounded-lg shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Typography variant="h6" component="h2" gutterBottom>
          Filter Presets
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Save Preset Section */}
        <Typography variant="subtitle1" gutterBottom>
          Save Current Filters
        </Typography>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Preset Name"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSavePreset}
            disabled={!newPresetName.trim()}
          >
            Save
          </Button>
        </Box>

        {/* Presets List */}
        {Array.isArray(filterPresets) && filterPresets.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Saved Presets
            </Typography>
            <div className="space-y-2">
              {filterPresets.map((preset) => (
                <div
                  key={preset._id}
                  className="flex justify-between items-center bg-gray-100 px-3 rounded-md"
                >
                  <span className="text-gray-700">{preset.name}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApplyPreset(preset)}
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md text-blue-800"
                    >
                      <CheckIcon fontSize="small" />
                      Apply
                    </button>

                    <div className="relative inline-block group">
                      <button 
                        className="text-blue-600 p-2 hover:bg-blue-100 rounded-full"
                        onClick={() => setActivePresetId(preset._id === activePresetId ? null : preset._id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </button>
                      {activePresetId === preset._id && (
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 
                                     bg-white p-4 rounded-lg shadow-xl border border-gray-200 
                                     min-w-[200px] overflow-y-auto max-h-[200px]"
                        >
                          {Object.entries(preset.filters).map(([key, value]) => {
                            const formattedKey = key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());
                            let displayValue = value;

                            if (
                              typeof value === "object" &&
                              !Array.isArray(value) &&
                              value !== null
                            ) {
                              const parts = [];
                              if (value.$gte || value.$gte === 0) {
                                const gteValue = value.$gte;
                                if (isNaN(gteValue)) {
                                  const formattedGteDate =
                                    formatDateAsNumber(gteValue);

                                  parts.push(`Min: ${formattedGteDate}`);
                                } else {
                                  parts.push(`Min: ${gteValue}`);
                                }
                              }

                              if (value.$lte || value.$lte === 0) {
                                const lteValue = value.$lte;

                                if (isNaN(lteValue)) {
                                  const formattedLteDate =
                                    formatDateAsNumber(lteValue);
                                  parts.push(`Max: ${formattedLteDate}`);
                                } else {
                                  parts.push(`Max: ${lteValue}`);
                                }
                              }

                              displayValue = parts.join(" - ");
                            }

                            if (key === "leadType") {
                              displayValue =
                                leadTypeData.find((lead) => lead._id === value)
                                  ?.label || "N/A";
                            }
                            if (key === "planName") {
                              displayValue =
                                plansForDropdown.find(
                                  (plan) => plan.value === value
                                )?.label || "N/A";
                            }

                            return (
                              <div
                                key={key}
                                className="text-sm mb-2 last:mb-0 break-keep"
                              >
                                <p className="font-semibold text-gray-700">
                                  {formattedKey}
                                </p>
                                {console.log("value", value, displayValue)}
                                <p className="text-gray-600">
                                  {" "}
                                  {Array.isArray(value)
                                    ? key === "enrollments" 
                                    ? productDropdownData
                                    .filter((product) => value.includes(product._id))
                                    .map((product) => `${product.name} | Level - ${product.level}`).join(", ")
                                    :value.join(", ")
                                    : displayValue}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        dispatch(deleteFilterPreset(preset._id));
                        logUserActivity({
                          action: "delete",
                          type: `Filter Preset for Table - ${tableName}`,
                          detailItem: preset.name,
                        });
                      }}
                      className="text-red-600 p-2 hover:bg-red-100 rounded-full"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Box mt={3} textAlign="right">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterPresetModal;