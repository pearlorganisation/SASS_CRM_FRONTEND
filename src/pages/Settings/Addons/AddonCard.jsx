import { useDispatch, useSelector } from "react-redux";
import { checkoutAddon } from "../../../features/actions/razorpay";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";
import { formatDateAsNumber } from "../../../utils/extra";

const AddonCard = ({ addon, id, roles, showAction = true, showExpiryDate = false }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const handleAddonSelection = (addonId) => {
    dispatch(checkoutAddon({ addon: addonId })).then((res) => {
      console.log(res);
      if (res?.payload?.result) {
        const order = res?.payload?.result;
        const addon = res?.payload?.addonData;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: order.currency,
          order_id: order.id, // This is the order_id created in the backend
          callback_url: `${
            import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
              ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
              : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
          }/razorpay/addon/payment-success?addonId=${addon._id}&adminId=${
            userData?._id
          }`, // Your success URL
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      }
    });
  };

  return (
    <div
      key={addon._id}
      className={`border h-full rounded-lg p-4 shadow-md bg-white`}
    >
      <h2 className="text-lg font-semibold mb-2">{addon.addonName}</h2>
      <div className="w-full border-b mb-2"></div>
      {addon.employeeLimit ? (
        <p className="text-gray-700">Employee Limit: {addon.employeeLimit}</p>
      ) : null}
      {addon.contactLimit ? (
        <p className="text-gray-700">Contact Limit: {addon.contactLimit}</p>
      ) : null}
      <p className="text-gray-700">
        Price: {"\u20B9"}
        {addon.addOnPrice} (+ 18% GST)
      </p>
      { showExpiryDate ? (
        <p className="text-gray-700">Validity: {addon.validityInDays} days</p>
      ) : (
        <p className="text-gray-700">
          Expiry Date:{" "}
          {addon.expiryDate ? formatDateAsNumber(addon.expiryDate) : "N/A"}
        </p>
      )}
      <ComponentGuard allowedRoles={[roles.ADMIN]}>
        {showAction && (
          <button
            className="mt-4 bottom-0 relative w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleAddonSelection(id)}
          >
            Select AddOn
          </button>
        )}
      </ComponentGuard>

      {/* <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
         <div className="border-t pt-4 w-full mt-2">
  
         </div>
        </ComponentGuard> */}
    </div>
  );
};

export default AddonCard;
