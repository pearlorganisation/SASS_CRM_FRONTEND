import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FormControlLabel, Paper } from "@mui/material";

const AssignedEmployeeTable = ({
  options,
  selectedEmployee,
  setSelectedEmployee,
  moveToPullbacks,
  isLabel = true,
  forceAssign = false,
}) => (
  <div className="mb-4">
    {isLabel && <label className="block text-lg font-semibold mb-2">Select Employee</label>}
    <RadioGroup
      value={selectedEmployee}
      onChange={(e) => setSelectedEmployee(e.target.value)}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Select</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Employee Name</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Daily Count</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Daily Limit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((employee) => {
              const isDisabled = moveToPullbacks || (!forceAssign && employee?.contactCount >= employee?.contactLimit);
              
              return (
                <TableRow 
                  key={employee?.value}
                  onClick={() => !isDisabled && setSelectedEmployee(employee?.value)}
                  sx={{
                    cursor: isDisabled ? 'default' : 'pointer',
                    '&:hover': { backgroundColor: isDisabled ? 'inherit' : '#f9fafb' }
                  }}
                >
                  <TableCell sx={{ padding: 0, textAlign: "center" }}>
                    <Radio
                      value={employee?.value}
                      disabled={isDisabled}
                      sx={{ padding: '8px' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee?.label}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee?.contactCount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee?.contactLimit}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </RadioGroup>
  </div>
);

export default AssignedEmployeeTable;
