export const clientTableColumns = [
  { header: "Email", key: "email", width: 50, type: "" },
  { header: "Company Name", key: "companyName", width: 30, type: "" },
  { header: "User Name", key: "userName", width: 20, type: "" },
  { header: "Phone", key: "phone", width: 15, type: "" },
  { header: "Is Active", key: "isActive", width: 10, type: "status" },
  { header: "Plan Name", key: "planName", width: 20, type: "" },
  { header: "Plan Start Date", key: "planStartDate", width: 20, type: "Date" },
  { header: "Plan Expiry", key: "planExpiry", width: 20, type: "Date" },
  { header: "Contacts Limit", key: "contactsLimit", width: 15, type: "" },
  { header: "Total Employees", key: "totalEmployees", width: 15, type: "" },
  {
    header: "Employee Sales Count",
    key: "employeeSalesCount",
    width: 15,
    type: "",
  },
  {
    header: "Employee Reminder Count",
    key: "employeeReminderCount",
    width: 15,
    type: "",
  },
  { header: "Toggle Limit", key: "toggleLimit", width: 15, type: "" },
];


export const attendeeTableColumns = [
  { header: "Email", key: "email", width: 50, type: "" },
  { header: "First Name", key: "firstName", width: 20, type: "" },
  { header: "Last Name", key: "lastName", width: 20, type: "" },
  { header: "Time in Session", key: "timeInSession", width: 20, type: "" },
  { header: "Gender", key: "gender", width: 20, type: "" },
  { header: "Location", key: "location", width: 20, type: "" },
  { header: "Phone", key: "phone", width: 20, type: "" },
  { header: "Status", key: "status", width: 20, type: "" },
];

export const employeeTableColumns = [
  { header: "Email", key: "email", width: 50, type: "" },
  { header: "User Name", key: "userName", width: 20, type: "" },
  { header: "Is Active", key: "isActive", width: 10, type: "status" },
  { header: "Role", key: "role", width: 20, type: "" },
  { header: "Phone", key: "phone", width: 15, type: "" },
  { header: "Valid Call Time(Sec)", key: "validCallTime", width: 20, type: "" },
  { header: "Daily Contact Limit", key: "dailyContactLimit", width: 20, type: "" },
];