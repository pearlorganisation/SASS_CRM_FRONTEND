import React from 'react'

const AlarmBanner = ({bannerData, closeBanner}) => {
  return (
    <div
          role="dialog"
          aria-modal="false"
          aria-label="Alarm banner"
          tabIndex={-1}
          className="fixed bottom-[15px] right-[5px] m-0 p-4 text-white border border-solid border-[#117195f0] rounded-xl w-[400px] min-h-[150px] max-w-full bg-[#23a7daee] backdrop-blur-sm shadow-xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left Content */}
            <div className="flex-shrink self-start sm:self-center">
              {bannerData && (
                <>
                  <h2 className="text-base font-bold mb-2">
                    {bannerData.message}
                  </h2>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong className="font-semibold">E-Mail:</strong> 
                      <span className="ml-1">{bannerData.deleteResult.email}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Note:</strong> 
                      <span className="ml-1">{bannerData.deleteResult.note}</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right Buttons */}
            <div className="flex flex-row-reverse sm:flex-col gap-4 flex-shrink-0 self-end sm:self-center">
              {bannerData && (
                <a
                  href={`/particularContact?email=${bannerData?.deleteResult?.email}&attendeeId=${bannerData?.deleteResult?.attendeeId}`}
                  className="no-underline"
                >
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow-md">
                    View Attendee
                  </button>
                </a>
              )}
              <button
                onClick={closeBanner}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm hover:shadow-md"
              >
                Stop Alarm
              </button>
            </div>
          </div>
        </div>
  )
}

export default AlarmBanner