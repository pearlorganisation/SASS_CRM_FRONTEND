import { instance } from "./axiosInterceptor";
import { errorToast } from "../utils/extra";

class ProductLevelService {
  async getProductLevels(payload) {
    try {
      const { data } = await instance.get(`products/level`, {
        params: payload,
      });

      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error fetching product levels");
      return { success: false };
    }
  }

  async createProductLevel(payload) {
    try {
      const { data } = await instance.post(`products/level`, payload);
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error creating product level");
      return { success: false };
    }
  }

  async updateProductLevel(id, payload) {
    try {
      const { data } = await instance.put(`products/level/${id}`, payload);
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error updating product level");
      return { success: false };
    }
  }

  async deleteProductLevel(payload) {
    try {
      const { data } = await instance.post(`products/level/${payload.id}`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error deleting product level");
      return { success: false };
    }
  }
}

const productLevelService = new ProductLevelService();

export default productLevelService;
