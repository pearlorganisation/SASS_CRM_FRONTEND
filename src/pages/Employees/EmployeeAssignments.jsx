import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployeeAssignments } from '../../features/actions/employee';
import { useParams } from 'react-router-dom';
import AssignmentTable from '../../components/AssignmentTable';

const EmployeeAssignments = () => {

    const dispatch = useDispatch();
    const { id } = useParams();
    const { isLoading, employeeAssignments } = useSelector((state) => state.employee);
    console.log('empassignments',employeeAssignments);
    useEffect(() => {
        dispatch(getEmployeeAssignments(id));

    },[]);
  return (
    <div className="px-4 md:px-8 py-10">
    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-5">
    Employee Assignments Details
    </h3>

    <AssignmentTable
      isLoading={isLoading}
      assignmentData={employeeAssignments}
      
    />


    {/* <div className="flex justify-center mt-5">
      <Pagination
        count={totalPages}
        page={Number(page)}
        color="primary"
        onChange={handlePagination}
      />
    </div> */}
  </div>
  )
}

export default EmployeeAssignments