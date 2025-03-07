import { instance } from "./axiosInterceptor";
import { errorToast } from "../utils/extra";

class MultiService {

  async getDailyAssignmentStats(params = {}) {
    try {
      const { data } = await instance.get(`assignment/metrics/daily`, { params });
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error fetching daily assignment stats");
      return { success: false };
    }
  }

  async getAllAssignmentsByDateRange(params = {}) {
    try {
      const { data } = await instance.get(`assignment/metrics/all`, { params });
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error fetching all assignments by date range");
      return { success: false };
    }
  }
}

const multiService = new MultiService();

export default multiService;
