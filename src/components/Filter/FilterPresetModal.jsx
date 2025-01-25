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

const FilterPresetModal = ({
  setIsPresetModalOpen,
  tableName = "",
  filters = {},
  setFilters,
}) => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  // console.log('FilterPresetModal -> Rendered')

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
    <Modal open={true} onClose={onClose}>
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
            <List>
              {filterPresets.map((preset) => (
                <ListItem
                  key={preset._id}
                  sx={{ bgcolor: "grey.100", borderRadius: "4px", mb: 1 }}
                >
                  <ListItemText primary={preset.name} />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      startIcon={<CheckIcon />}
                      onClick={() => onApplyPreset(preset)}
                    >
                      Apply
                    </Button>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        dispatch(deleteFilterPreset(preset._id));
                        logUserActivity({
                          action: "delete",
                          type: `Filter Preset for Table - ${tableName}`,
                          detailItem: preset.name,
                        });
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
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
