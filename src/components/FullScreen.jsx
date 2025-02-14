import React, { useRef, useState } from "react";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const FullScreen = ({ children }) => {
  const myRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    console.log(myRef.current);
    if (!document.fullscreenElement) {
      myRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div
      ref={myRef}
      className="relative h-full w-full space-y-10  bg-white p-6 rounded-lg"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <button className="absolute right-5 top-2" onClick={toggleFullScreen}>
          {" "}
          {isFullScreen ? <FullscreenExitIcon fontSize="large"  /> : <FullscreenIcon fontSize="large" />}
        </button>

        {children}
      </div>
    </div>
  );
};

export default FullScreen;
