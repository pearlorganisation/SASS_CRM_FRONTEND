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
  { header: "Assigned To", key: "isAssigned", width: 20, type: "" },
  { header: "First Name", key: "firstName", width: 20, type: "" },
  { header: "Last Name", key: "lastName", width: 20, type: "" },
  { header: "Status", key: "status", width: 20, type: "" },
  { header: "Time in Session", key: "timeInSession", width: 20, type: "" },
  { header: "Gender", key: "gender", width: 20, type: "" },
  { header: "Location", key: "location", width: 20, type: "" },
  { header: "Phone", key: "phone", width: 20, type: "" },
];

export const employeeTableColumns = [
  { header: "Email", key: "email", width: 50, type: "" },
  { header: "User Name", key: "userName", width: 20, type: "" },
  { header: "Is Active", key: "isActive", width: 10, type: "status" },
  { header: "Role", key: "role", width: 20, type: "" },
  { header: "Phone", key: "phone", width: 15, type: "" },
  { header: "Valid Call Time(Sec)", key: "validCallTime", width: 20, type: "" },
  {
    header: "Daily Contact Limit",
    key: "dailyContactLimit",
    width: 20,
    type: "",
  },
  {
    header: "Inactivity Time(Sec)",
    key: "inactivityTime",
    width: 20,
    type: "",
  },
];

export const webinarTableColumns = [
  { header: "Webinar Name", key: "webinarName", width: 50, type: "" },
  { header: "Webinar Date", key: "webinarDate", width: 20, type: "Date" },
  {
    header: "Total Registrations",
    key: "totalRegistrations",
    width: 10,
    type: "",
  },
  { header: "Total Attendees", key: "totalAttendees", width: 20, type: "" },
  {
    header: "Total Participants",
    key: "totalParticipants",
    width: 15,
    type: "",
  },
];

export const productTableColumns = [
  { header: "Name", key: "name", width: 50, type: "" },
  { header: "Price", key: "price", width: 20, type: "" },
  {
    header: "Level",
    key: "level",
    width: 10,
    type: "",
  },
  { header: "Description", key: "description", width: 20, type: "" },
];

export const pullbacksTableColumns = [
  { header: "Email", key: "attendeeEmail", width: 50, type: "" },
  { header: "Assigned To", key: "assignedTo", width: 20, type: "" },
];



export const enrollmentsColumn = [
  { header: "E-Mail", key: "attendee", width: 50, type: "" },
  { header: "Product", key: "product", subKey: "name", width: 20, type: "Product" },
  { header: "Level", key: "product", subKey: "level", width: 20, type: "Product" },
  { header: "Price", key: "product", subKey: "price", width: 20, type: "Product" },
  { header: "Date", key: "createdAt", width: 20, type: "Date" },

];