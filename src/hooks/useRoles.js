import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useRoles = () => {
  const { roles } = useSelector((state) => state.auth);

  // Transform roles array into an object with name as key and _id as value
  const rolesObject = useMemo(() => {
    if (!Array.isArray(roles) || roles.length === 0) return {};
    return roles.reduce((acc, role) => {
      acc[role.name] = role._id;
      return acc;
    }, {});
  }, [roles]);

  // Wrap rolesObject with Proxy to handle undefined fields gracefully
  const rolesProxy = useMemo(() => {
    return new Proxy(rolesObject, {
      get(target, property) {
        // Return the actual property if it exists, otherwise return an empty string
        return property in target ? target[property] : 'defaultName';
      },
    });
  }, [rolesObject]);

  return rolesProxy;
};

export default useRoles;
