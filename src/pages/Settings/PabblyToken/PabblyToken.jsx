import React, { useEffect } from 'react'

const PabblyToken = () => {

    useEffect(()=>{},
    [])
  return (
    <div className='p-10 flex flex-col items-center  text-gray-800 bg-gray-50 h-screen'>
        <div className='bg-white w-fit  p-4 rounded-md'>
            <span className='font-semibold'>Endpoint: </span><span className='text-sm'>localhost:8000/api/v1/auth/signup</span>
            <br/>
            <span className='font-semibold'>Request Type: </span><span className='text-sm'>GET</span>
            <br/>
            <span className='font-semibold'>JSON Body Requirement: </span><span className='text-sm '><br/>
           "userName": "jj",<br/>
    "password": "jj@123",<br/>
    "phone":"9999999999",<br/>
    "email": "jj@gmail.com",<br/>
    "amount": 699</span>
            </div>


        </div>
  )
}

export default PabblyToken