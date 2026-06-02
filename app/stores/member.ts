import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import type { MemberDashboardResponse } from "~/types/member";

export const useMemberStore = defineStore("member", () => {
  const http = getHttp();

  const dashboardData = ref<MemberDashboardResponse | null>(null);
  const loading = ref(false);

  const getDashboard = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await http.get(API_ENDPOINTS.MEMBER.DASHBOARD);
      dashboardData.value = response as MemberDashboardResponse;
    } catch (error) {
      console.error("Failed to fetch member dashboard:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    dashboardData,
    loading,
    getDashboard,
  };
});
