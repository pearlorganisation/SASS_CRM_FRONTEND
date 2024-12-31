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
  
  const AssignedEmployeeTable = ({ options, selectedEmployee, setSelectedEmployee, moveToPullbacks }) => (
    <div className="mb-4">
      <label className="block font-medium mb-2">Select Employee</label>
      <RadioGroup
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell   >Select</TableCell>
                <TableCell className="whitespace-nowrap">Employee Name</TableCell>
                <TableCell className="whitespace-nowrap">Daily Count</TableCell>
                <TableCell className="whitespace-nowrap">Daily Limit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((employee) => (
                <TableRow key={employee?.value}>
                  <TableCell sx={{padding: 0}} >
                    <Radio
                      value={employee?.value}
                      disabled={moveToPullbacks}
                    />
                  </TableCell>
                  <TableCell>{employee?.label}</TableCell>
                  <TableCell>{employee?.contactCount}</TableCell>
                  <TableCell>{employee?.contactLimit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    </div>
  );
  
  export default AssignedEmployeeTable;
  