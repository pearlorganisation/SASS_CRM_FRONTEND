import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchReAssignments } from '../../features/actions/reAssign';
import { useNavigate, useParams } from 'react-router-dom';
import { pullbacksTableColumns } from '../../utils/columnData';
import DataTable from '../../components/Table/DataTable';
import { Visibility } from '@mui/icons-material';

const Pullbacks = (props) => {
    const tableHeader = "Re-Assignments";

    const {id} = useParams();
    const {tabValue, subTabValue, page, setPage} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { reAssignData, totalPages, isLoading, isSuccess} = useSelector((state) => state.reAssign);
      const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

    useEffect(() => {
        dispatch(fetchReAssignments(
            {
                webinarId: id,
                status: subTabValue,
                recordType: tabValue,
                page,
                limit: LIMIT
            }
        ));
    }, [subTabValue, LIMIT, page, tabValue]);

      const actionIcons = [
        {
          icon: () => (
            <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
          ),
          tooltip: "View Attendee Info",
          onClick: (item) => {
            navigate(
              `/particularContact?email=${item?.attendeeEmail}&attendeeId=${item?.attendee}`
            );
          },
          readOnly: true,
        },
      ];
  return (
    <DataTable
    tableHeader={tableHeader}
    tableUniqueKey="webinarReAssignmentsAttendeesTable"
    isSelectVisible={true}
    tableData={{
      columns: pullbacksTableColumns,
      rows: reAssignData,
    }}
    actions={actionIcons}
    totalPages={totalPages}
    page={page}
    setPage={setPage}
    limit={LIMIT}
    isLoading={isLoading}
  />
  )
}

export default Pullbacks