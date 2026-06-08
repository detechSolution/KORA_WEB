import type { ApiResponse } from "~/types/api";
import type { Newsletter } from "~/types/newsletter";

import { defineStore } from "pinia";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useNewsletterStore = defineStore("newsletter", () => {
  const http = getHttp();

  const createNewsletter = async (newsletter: Newsletter) => {
    try {
      const response = await http.post<ApiResponse<Newsletter>>(
        API_ENDPOINTS.NEWSLETTER.CREATE,
        newsletter,
      );
      return response.data;
    }
    catch (error) {
      throw error;
    }
  };

  return {
    createNewsletter,
  };
});
