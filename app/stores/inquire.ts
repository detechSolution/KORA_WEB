import type { ApiResponse } from "~/types/api";
import type { CorporateInquire, Inquire } from "~/types/inquire";

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
    }
    catch (error) {
      console.error("Failed to create inquire", error);
      throw error;
    }
  };

  const createCorporateInquire = async (inquire: CorporateInquire) => {
    try {
      const response = await http.post<ApiResponse<CorporateInquire>>(
        API_ENDPOINTS.INQUIRE.CREATE_CORPORATE,
        inquire,
      );
      return response.data;
    }
    catch (error) {
      console.error("Failed to create inquire", error);
      throw error;
    }
  };

  return {
    createInquire,
    createCorporateInquire,
  };
});
