import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../services/axiosInterceptor';

export const exportClientExcel = createAsyncThunk(
  "client/exportExcel",
  async ({ limit = 100, columns = "" }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`export-excel`, {
        params: { limit, columns },
        responseType: 'blob', // Ensure you get the file as a binary Blob
      });

      // Automatically trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set file name for download
      link.setAttribute('download', 'clients.xlsx'); 

      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up after download

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
