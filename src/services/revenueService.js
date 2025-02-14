import { instance } from "./axiosInterceptor";
import { errorToast } from "../utils/extra";

class RevenueService {
  async getTotalRevenue(payload) {
    try {
      const { data } = await instance.get(`revenue/total`, { params: payload });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching total revenue");
    }
  }

  async getRevenueByType(payload) {
    try {
      const { data } = await instance.get(`revenue/by-type`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching revenue by type");
    }
  }

  async getDurationRevenue(payload) {
    try {
      const { data } = await instance.get(`revenue/duration`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching duration revenue");
    }
  }

  async getMRR(payload) {
    try {
      const { data } = await instance.get(`revenue/mrr`, { params: payload });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching MRR");
    }
  }

  async getTaxCollected(payload) {
    try {
      const { data } = await instance.get(`revenue/tax`, { params: payload });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching tax collected");
    }
  }

  async getDiscountsGiven(payload) {
    try {
      const { data } = await instance.get(`revenue/discounts`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching discounts given");
    }
  }

  async getTopPlans(payload) {
    try {
      const { data } = await instance.get(`revenue/top-plans`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching top plans");
    }
  }

  async getTopAddOns(payload) {
    try {
      const { data } = await instance.get(`revenue/top-addons`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast("Error fetching top add-ons");
    }
  }
}

const revenueService = new RevenueService();

export default revenueService;
