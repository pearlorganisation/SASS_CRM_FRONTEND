import React from 'react'

export default function ViewModalAttendees ({viewData,setModal}) {
    const createdAtDate = viewData?.updatedAt ? new Date(viewData?.updatedAt) : null;
  const formattedDate = createdAtDate ? createdAtDate.toISOString().split('T')[0] : '';

  return (
    <div
    className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdroap-blur-sm"
    aria-labelledby="header-3a content-3a"
    aria-modal="true"
    tabindex="-1"
    role="dialog"
  >
    {/*    <!-- Modal --> */}
    <div
      className="flex h-auto w-[80%] sm:w-[70%]  flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl "
      id="modal"
      role="document"
    >
      {/*        <!-- Modal header --> */}
      <header id="header-3a" className="flex items-center gap-4">
        <h3 className="flex-1 text-xl font-medium text-slate-700">
        Attendee Details
        </h3>
        <div>Added on : {viewData?.date} </div>
        <button
          onClick={() => setModal(false)}
          className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
          aria-label="close dialog"
        >
          <span className="relative only:-mx-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              role="graphics-symbol"
              aria-labelledby="title-79 desc-79"
            >
              <title id="title-79">Icon title</title>
              <desc id="desc-79">
                A more detailed description of the icon
              </desc>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </button>
      </header>
      {/*        <!-- Modal body --> */}
      <div id="content-3a" className="flex-1 overflow-auto space-y-10">

      <table className="w-full table-auto text-sm">
    <tbody className="text-gray-600">
      <tr>
        <td className="py-2 px-4 border border-gray-300">First Name</td>
        <td className="py-2 px-4 border border-gray-300">{viewData?.firstName}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-gray-300">Last Name</td>
        <td className="py-2 px-4 border border-gray-300">{viewData?.lastName?.match(/:-\)/) ||viewData?.lastName === "1"  ? '--' : viewData?.lastName}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-gray-300">Contact Number</td>
        <td className="py-2 px-4 border border-gray-300">{viewData?.phone}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-b-1 border-gray-300">Email</td>
        <td className="py-2 px-4 border border-gray-300">{viewData ? viewData?.email : ''}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-b-1 border-gray-300">Webinar Name</td>
        <td className="py-2 px-4 border border-gray-300">{viewData ? viewData?.csvName : ''}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-b-1 border-gray-300">Webinar Date</td>
        <td className="py-2 px-4 border border-gray-300">{viewData ? viewData?.date : ''}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-b-1 border-gray-300">Webinar Minutes</td>
        <td className="py-2 px-4 border border-gray-300">{viewData ? viewData?.timeInSession : ''}</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border border-b-1 border-gray-300">Lead Type</td>
        <td className="py-2 px-4 border border-gray-300"><span className='bg-red-500 text-white rounded-md font-medium px-2'>HOT</span></td>
      </tr>

      

      
    </tbody>
  </table>
      </div>

</div>
</div>
  )
}
