import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPabblyToken } from '../../../features/actions/pabblyToken'

const PabblyToken = () => {
    const {pabblyTokenData} = useSelector((action)=>action.pabblyToken)

    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getPabblyToken())
    
    },
    [])

    console.log(pabblyTokenData)
  return (
    <div className='p-10 flex flex-col items-center  text-gray-800 bg-gray-50 h-screen'>
        <div className='bg-white w-fit  p-4 rounded-md'>
            <span className='font-semibold'>Endpoint: </span><span className='text-sm'>localhost:8000/api/v1/auth/signup</span>
            <br/>
            <span className='font-semibold'>Request Type: </span><span className='text-sm'>POST</span>
            <br/>
            <span className='font-semibold'>JSON Body Requirement: </span><span className='text-sm '><br/>
           "userName": "jj",<br/>
    "password": "jj@123",<br/>
    "phone":"9999999999",<br/>
    "email": "jj@gmail.com",<br/>
    "amount": 699</span>
            </div>

            <div className='bg-white max-w-5xl mt-10 p-4 rounded-md'>
            <span className='font-semibold'>Pabbly Token: </span>
            <span className='text-sm '>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjlmYWE2MGEyYWU2OGNjMDE5ZTBkNCIsInJJZCI6IjY2Yjc1ODQ2NDg5MmNlM2Q5OTQ3NDV<br/>jNSIsImlhdCI6MTcyOTUxMDI5Mn0.ZVUsycOoUEDPJQc5f9dWhsO3eiEY_ZLy3RvNu0uSfC8</span>
            </div>
        </div>
  )
}

export default PabblyToken