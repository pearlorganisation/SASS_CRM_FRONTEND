
import React, { useEffect } from 'react'
import { getAllEmployees } from '../../features/actions/employee'
import { useDispatch, useSelector } from 'react-redux'

const Dashboard = () => {
  const dispatch = useDispatch()
  const {userData}= useSelector((state)=>state.auth)
  
  useEffect(()=>{
    dispatch(getAllEmployees(userData?.id))
  },[])
  return (
    <div  className='mt-10 flex flex-col font-medium items-center gap-4'>

 Last Site Updated on <span className='text-2xl font-bold font-mono'>9 October 2024</span></div>

  )
}

export default Dashboard
