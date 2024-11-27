import { useSelector } from 'react-redux';

const ComponentGuard = ({ allowedRoles=[], children, conditions=[] }) => {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role;

  if(conditions.includes(false))
    return null;
  // Check if the user's role is in the allowedRoles array
  return allowedRoles.includes(role) ? children : null;
};

export default ComponentGuard;
