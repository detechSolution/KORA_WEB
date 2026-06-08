import type { Spa } from "~/types/spa";

import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useSpaStore = defineStore("spa", () => {
  const http = getHttp();

  const spa = ref<Spa>();

  const getSpas = async () => {
    try {
      const response = await http.get(API_ENDPOINTS.SPA.GET);
      spa.value = response as Spa;
    }
    catch (error) {
      console.error("Failed to fetch spas:", error);
      throw error;
    }
  };

  const getAvailableTimes = async (params: Record<string, any>) => {
    try {
      const qs = buildQueryString(params);
      const response = await http.get(`${API_ENDPOINTS.SPA.TIME_AVAILABILITY}?${qs}`);
      return response.data;
    }
    catch (error) {
      console.error("Failed to fetch available times:", error);
      throw error;
    }
  };

  return {
    spa,
    getSpas,
    getAvailableTimes,
  };
});
