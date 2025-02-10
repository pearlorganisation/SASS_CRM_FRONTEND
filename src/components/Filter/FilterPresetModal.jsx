import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { closeModal } from "../../features/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  creattFilterPreset,
  deleteFilterPreset,
  getFilterPreset,
} from "../../features/actions/filter-preset";
import { clearPreset } from "../../features/slices/filter-preset";
import { errorToast } from "../../utils/extra";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

  const { filterPresets, isSuccess } = useSelector(
    (state) => state.filterPreset
  );
  const [newPresetName, setNewPresetName] = useState("");

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
                      <button className="text-blue-600 p-2 hover:bg-blue-100 rounded-full">
                        <VisibilityIcon fontSize="small" />
                      </button>
                      <div
                        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 
                                  transition-all duration-200 absolute left-1/2 -translate-x-1/2 
                                  top-full mt-2 z-50 bg-white p-4 rounded-lg shadow-xl border 
                                  border-gray-200 min-w-[200px] overflow-y-auto max-h-[200px]"
                      >
                        {Object.entries(preset.filters).map(([key, value]) => {
                          const formattedKey = key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                          let displayValue = value;
                          console.log("value", value);

                          if (typeof value === "object" && value !== null) {
                            const parts = [];
                            if (value.$gte || value.$gte === 0) {
                              const gteValue = value.$gte;
                              if (isNaN(gteValue)) {
                                const gteDate = new Date(gteValue);
                                const gteDay = gteDate.getDate();
                                const gteMonth = gteDate.getMonth() + 1;
                                const gteYear = gteDate.getFullYear();

                                parts.push(
                                  `Min: ${gteDay}/${gteMonth}/${gteYear}`
                                );
                              } else {
                                parts.push(`Min: ${gteValue}`);
                              }
                            }

                            if (value.$lte || value.$lte === 0) {
                              console.log("value.$lte", value.$lte);
                              const lteValue = value.$lte;

                              if (isNaN(lteValue)) {
                                const lteDate = new Date(lteValue);
                                const lteDay = lteDate.getDate();
                                const lteMonth = lteDate.getMonth() + 1;

                                const lteYear = lteDate.getFullYear();

                                parts.push(
                                  `Max: ${lteDay}/${lteMonth}/${lteYear}`
                                );
                              } else {
                                parts.push(`Max: ${lteValue}`);
                              }
                            }
                          console.log("plansForDropdown", parts);

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
                              <p className="text-gray-600">{displayValue}</p>
                            </div>
                          );
                        })}
                      </div>
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
