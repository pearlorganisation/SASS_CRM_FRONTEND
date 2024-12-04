import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useRoles from "../../hooks/useRoles";
// import { roles } from "../../utils/roles";
export default function RouteGuard({ children, roleNames = [] }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const roles = useRoles();
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  useEffect(() => {
    // console.log("role naimgn useEffecter", roleNames);
    setLoader(true);

    if (roleNames.length > 0) {
      let isAllowed = false;
      roleNames.forEach((roleName) => {
        if (roles[roleName] === role) {
          // console.log("aio aio", roles[roleName] === role);

          isAllowed = true;
          return;
        }
      });
      // console.log("isAllowed", isAllowed);
      if (!isAllowed) {
        navigate("/");
      }
    }

    setLoader(false);
  }, [roleNames, role]);
  // console.log("role naimgn render loadaer --- >",loader);
  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
