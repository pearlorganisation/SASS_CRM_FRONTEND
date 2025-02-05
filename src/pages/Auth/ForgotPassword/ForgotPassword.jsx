import { useState, useEffect } from "react";
import { errorToast } from "../../../utils/extra";
import { useDispatch, useSelector } from "react-redux";
import { generateOTP, validateOTP } from "../../../features/actions/auth";
import { clearOTPGenerated } from "../../../features/slices/auth";

const ForgotPasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();

  const { isSomethingStillLoading, isSuccess, isOTPGenerated } = useSelector(
    (state) => state.auth
  );

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleSendOtp = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      errorToast("Please enter a valid email address.");
      return;
    }
    dispatch(generateOTP({ email }));
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    dispatch(validateOTP({ email, otp }));
  };

  const handleResendOtp = () => {
    if (canResend) {
      setCanResend(false);
      setResendTimer(60);
    }
  };

  useEffect(() => {
    if (isOTPGenerated) {
      setStep(2);
      setCanResend(false);
      setResendTimer(60);
      dispatch(clearOTPGenerated());

    }
  }, [isOTPGenerated]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      dispatch(clearOTPGenerated());
    }
  }, [isSuccess]);


  useEffect(() => {
    if (step === 2 && resendTimer > 0) {

      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {step === 1 ? (
          <>
            <label className="block text-sm font-medium mb-2">
              Enter your email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={handleSendOtp}
              disabled={isSomethingStillLoading}
            >
              {isSomethingStillLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (

          <>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={handleVerifyOtp}
              disabled={isSomethingStillLoading}
            >
              {isSomethingStillLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>


            {/* Resend OTP Section */}
            <div className="mt-4 text-center">
              <button
                className={`text-blue-600 ${
                  !canResend && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleResendOtp}
                disabled={!canResend}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </>
        )}

        <button
          className="w-full mt-2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
