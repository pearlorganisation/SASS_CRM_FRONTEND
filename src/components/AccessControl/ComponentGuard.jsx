import { useSelector } from 'react-redux';

const ComponentGuard = ({ allowedRoles, children }) => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role;

  // Check if the user's role is in the allowedRoles array
  return allowedRoles.includes(role) ? children : null;
};

export default ComponentGuard;
