import { instance } from "./axiosInterceptor";
import { errorToast } from "../utils/extra";

class TagsService {
  async getTags(params = {}) {
    try {
      const { data } = await instance.get(`tags`, { params });
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error fetching tags");
      return { success: false };
    }
  }

  async createTag(payload) {
    try {
      const { data } = await instance.post(`tags`, payload);
      return data;
    } catch (error) {
      console.error(error);
      errorToast(error || "Error creating tag");
      return { success: false };
    }
  }

}

const tagsService = new TagsService();

export default tagsService;
