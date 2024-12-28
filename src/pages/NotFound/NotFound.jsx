import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center"
    >
      <Typography variant="h1" className="text-4xl font-bold text-gray-800 mb-4">
        404
      </Typography>
      <Typography
        variant="h6"
        className="text-lg text-gray-600 mb-6 max-w-lg"
      >
        Oops! The page you’re looking for doesn’t exist. It might have been moved or deleted.
      </Typography>
      <Button
        variant="contained"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-md"
        onClick={() => navigate('/')}
      >
        Go Back to Home
      </Button>
      <Box className="mt-8">
        <img
          src="https://via.placeholder.com/400"
          alt="Not Found Illustration"
          className="w-80 h-auto"
        />
      </Box>
    </Box>
  );
};

export default NotFoundPage;
