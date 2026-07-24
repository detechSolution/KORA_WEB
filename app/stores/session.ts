import type { ApiResponse } from "~/types/api";
import type { Session } from "~/types/session";

import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

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
  const guestRemainingSpots = ref<number>(0);

  const getSessions = async (
    params: SessionQueryParams = {},
  ): Promise<void> => {
    loading.value = true;
    try {
      const qs = buildQueryString(params);
      const response = (await http.get(
        `${API_ENDPOINTS.SESSION.GET}?${qs}`,
      )) as any;
      sessions.value = response;
    }
    catch (error) {
      console.error("Failed to fetch sessions:", error);
      throw error;
    }
    finally {
      loading.value = false;
    }
  };

  const getSessionById = (id: string): Session | undefined => {
    return sessions.value.data.find(session => session.id === Number(id));
  };

  const getSessionDetail = async (id: string): Promise<Session> => {
    loading.value = true;
    try {
      const response = (await http.get(
        `${API_ENDPOINTS.SESSION.GET}/${id}`,
      )) as Session;
      return response;
    }
    catch (error) {
      console.error(`Failed to fetch session detail for ${id}:`, error);
      throw error;
    }
    finally {
      loading.value = false;
    }
  };

  const addToWaitlist = async (id: number): Promise<void> => {
    loading.value = true;
    try {
      await http.post(`${API_ENDPOINTS.SESSION.WAITLIST(id)}`, {});
    }
    catch (error) {
      console.error(`Failed to add session ${id} to waitlist:`, error);
      throw error;
    }
    finally {
      loading.value = false;
    }
  };
  const fetchGuestRemainingSpots = async (): Promise<void> => {
    try {
      const response = (await http.get(`${API_ENDPOINTS.SESSION.REMAINING_GUEST}`)) as { guestRemainingSpots: number };
      guestRemainingSpots.value = response?.guestRemainingSpots ?? 0;
    }
    catch (error) {
      console.error("Failed to fetch remaining guest spots", error);
    }
  };

  return {
    sessions,
    loading,
    guestRemainingSpots,
    getSessions,
    getSessionById,
    getSessionDetail,
    addToWaitlist,
    fetchGuestRemainingSpots,
  };
});
