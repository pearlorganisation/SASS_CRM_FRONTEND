import React from "react";
// import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  // Dummy data
  const data = {
    accounts: {
      totalCreated: 1500,
      active: 1200,
    },
    revenue: 520000,
    admins: [
      { name: "Admin 1", employees: 10 },
      { name: "Admin 2", employees: 20 },
      { name: "Admin 3", employees: 15 },
    ],
    contacts: 3500,
  };

  const accountTrends = [
    { date: "Jan", created: 200 },
    { date: "Feb", created: 300 },
    { date: "Mar", created: 250 },
    { date: "Apr", created: 350 },
  ];

  return <div></div>

  // return (
  //   <Box sx={{ padding: 4 }}>
  //     {/* Header */}
  //     <Typography variant="h4" gutterBottom>
  //       Dashboard
  //     </Typography>

  //     {/* Summary Cards */}
  //     <Grid container spacing={2}>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <Card>
  //           <CardContent>
  //             <Typography variant="h6">Total Accounts Created</Typography>
  //             <Typography variant="h4">{data.accounts.totalCreated}</Typography>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <Card>
  //           <CardContent>
  //             <Typography variant="h6">Active Accounts</Typography>
  //             <Typography variant="h4">{data.accounts.active}</Typography>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <Card>
  //           <CardContent>
  //             <Typography variant="h6">Total Revenue</Typography>
  //             <Typography variant="h4">₹{data.revenue.toLocaleString()}</Typography>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <Card>
  //           <CardContent>
  //             <Typography variant="h6">Total Admins</Typography>
  //             <Typography variant="h4">{data.admins.length}</Typography>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <Card>
  //           <CardContent>
  //             <Typography variant="h6">Total Contacts</Typography>
  //             <Typography variant="h4">{data.contacts}</Typography>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>

  //     {/* Trends Chart */}
  //     <Box mt={4}>
  //       <Typography variant="h6" gutterBottom>
  //         Account Creation Trends
  //       </Typography>
  //       <ResponsiveContainer width="100%" height={300}>
  //         <LineChart data={accountTrends}>
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="date" />
  //           <YAxis />
  //           <Tooltip />
  //           <Line type="monotone" dataKey="created" stroke="#8884d8" />
  //         </LineChart>
  //       </ResponsiveContainer>
  //     </Box>
  //   </Box>
  // );
};

export default Dashboard;
