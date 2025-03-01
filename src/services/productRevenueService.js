import { instance } from "./axiosInterceptor";
import { errorToast } from "../utils/extra";

class ProductRevenueService {
  async getTotalRevenue(payload) {
    try {
      const { data } = await instance.get(`product-revenue/total-revenue`, { 
        params: payload 
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching total product revenue");
    }
  }

  async getRevenueByLevel(payload) {
    try {
      const { data } = await instance.get(`product-revenue/revenue-by-level`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching revenue by level");
    }
  }

  async getAdoptionRate(payload) {
    try {
      const { data } = await instance.get(`product-revenue/adoption-rate`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching adoption rate");
    }
  }

  async getTopProducts(payload) {
    try {
      const { data } = await instance.get(`product-revenue/top-products`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching top products");
    }
  }

  async getRevenueByWebinar(payload) {
    try {
      const { data } = await instance.get(`product-revenue/webinar`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching webinar revenue");
    }
  }

  async getMonthlyRevenue(payload) {
    try {
      const { data } = await instance.get(`product-revenue/monthly-revenue`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching monthly revenue");
    }
  }

  async getTopUsers(payload) {
    try {
      const { data } = await instance.get(`product-revenue/top-users`, {
        params: payload
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching top users");
    }
  }
}

const productRevenueService = new ProductRevenueService();

export default productRevenueService;
