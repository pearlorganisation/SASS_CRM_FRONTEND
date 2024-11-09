import React, { useState } from 'react';

export default function ConfirmActionModal({ setModal, handleAction, modalData, action }) {
  const [inputValue, setInputValue] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === modalData?.email);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      handleAction();
    }
  };

  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-md p-6 relative">
        <div className="border-b border-b-neutral-500 flex justify-between pb-2">
          <p>{`${action === 'activate' ? 'Activate' : 'Deactivate'} Account`}</p>
          <svg
            onClick={() => {
              setModal(null);
            }}
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
            viewBox="0 0 320.591 320.591"
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
            ></path>
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
            ></path>
          </svg>
        </div>
        <div className="mt-8 mb-4 text-center">
          <h4 className="text-xl font-semibold mt-6">
            Confirm {action === 'activate' ? 'activation' : 'deactivation'} by entering Email: {modalData?.email}
          </h4>
          
          <div className='relative pb-5'>
            <input
              type="email"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your email to confirm"
              className={`border ${
                isInputValid ? 'border-gray-300' : 'border-red-500'
              } p-2 rounded-md w-full`}
            />
            {!isInputValid && (
              <p className="text-red-500 text-sm absolute bottom-0 left-1/2 -translate-x-1/2 text-nowrap">
                The email entered does not match.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleConfirmAction}
            type="button"
            disabled={!isInputValid}
            className={`px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none ${
              isInputValid
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {action === 'activate' ? 'Activate' : 'Deactivate'}
          </button>
          <button
            onClick={() => {
              setModal(false);
            }}
            type="button"
            className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-slate-300/70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
