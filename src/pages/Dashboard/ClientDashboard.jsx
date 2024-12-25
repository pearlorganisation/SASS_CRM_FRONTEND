import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { getDashboardNotes } from '../../features/actions/assign';
import { StatusComponent } from '../../components/Dashboard';

const ClientDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardNotes());
  },[])
  return (
    <div className='min-h-screen bg-gray-100 pt-14'>
      <StatusComponent />

    </div>
  )
}

export default ClientDashboard