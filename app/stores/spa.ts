import { defineStore } from "pinia";
import { ref } from "vue";

import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import type { ApiResponse } from "~/types/api";
import type { Spa } from "~/types/spa";

export const useSpaStore = defineStore("spa", () => {
    const http = getHttp();

  const spa = ref<Spa>();

  const getSpas = async () => {
    try {
      const response = await http.get(API_ENDPOINTS.SPA.GET);
      spa.value = response as Spa;
    } catch (error) {
      console.error("Failed to fetch spas:", error);
      throw error;
    }
  };

  return {
    spa,
    getSpas
  };
});
