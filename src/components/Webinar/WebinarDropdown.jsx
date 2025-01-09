import React, { useEffect, useState } from "react";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import { getAllWebinars } from "../../features/actions/webinarContact";
import { copyToClipboard } from "../../utils/extra";

const WebinarDropdown = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoading, webinarData } = useSelector(
    (state) => state.webinarContact
  );

  useEffect(() => {
    dispatch(getAllWebinars({ page: 1, limit: 20 }));
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleMenuClick}
        style={{ marginBottom: 20 }}
      >
        Select Webinar
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {webinarData.map((webinar) => (
          <MenuItem key={webinar?._id} onClick={handleMenuClose}>
            <div
              className="flex justify-between w-full items-center"
            >
              <span>{webinar?.webinarName}</span>
              <Button
                onClick={() => copyToClipboard(webinar?._id, "Webinar")}
                variant="outlined"
                endIcon={<ContentCopy />}
                style={{ textTransform: "none", marginLeft: "10px" }}
              >
                {webinar?._id}
              </Button>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default WebinarDropdown;
