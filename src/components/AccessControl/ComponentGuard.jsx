import { useSelector } from 'react-redux';

const ComponentGuard = ({ allowedRoles=[], children, conditions=[] }) => {
  const { userData } = useSelector((state) => state.auth);
  console.log('ComponentGuard -> Rendered')
  const role = userData?.role;

  if(conditions.includes(false))
    return null;
  // Check if the user's role is in the allowedRoles array
  if(allowedRoles.length === 0) return children
  return allowedRoles.includes(role) ? children : null;
};

export default ComponentGuard;
