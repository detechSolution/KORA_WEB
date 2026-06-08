import type { ApiResponse } from "~/types/api";
import type { Inquire } from "~/types/inquire";

import { defineStore } from "pinia";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useInquireStore = defineStore("inquire", () => {
  const http = getHttp();

  const createInquire = async (inquire: Inquire) => {
    try {
      const response = await http.post<ApiResponse<Inquire>>(
        API_ENDPOINTS.INQUIRE.CREATE,
        inquire,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    createInquire,
  };
});
