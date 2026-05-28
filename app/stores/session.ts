import { defineStore } from "pinia";
import { ref } from "vue";

import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import type { ApiResponse } from "~/types/api";
import type { Session } from "~/types/session";

type SessionQueryParams = Record<string, any>;

export const useSessionStore = defineStore("session", () => {
  const http = getHttp();

  const sessions = ref<ApiResponse<Session[]>>({
    data: [],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
    },
  });

  const loading = ref(false);

  const getSessions = async (params: SessionQueryParams = {}): Promise<void> => {
    loading.value = true;
    try {
      const qs = buildQueryString(params);
      const response = await http.get(`${API_ENDPOINTS.SESSION.GET}?${qs}`) as any;
      sessions.value = response;
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getSessionById = (id: string): Session | undefined => {
    return sessions.value.data.find((session) => session.id === Number(id));
  }

  const getSessionDetail = async (id: string): Promise<Session> => {
    loading.value = true;
    try {
      const response = await http.get(`${API_ENDPOINTS.SESSION.GET}/${id}`) as Session;
      return response;
    } catch (error) {
      console.error(`Failed to fetch session detail for ${id}:`, error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    sessions,
    loading,
    getSessions,
    getSessionById,
    getSessionDetail
  };
});
