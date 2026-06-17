import type {
  MemberBookingsResponse,
  MemberDashboardResponse,
} from "~/types/member";
import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useMemberStore = defineStore("member", () => {
  const http = getHttp();

  const dashboardData = ref<MemberDashboardResponse | null>(null);
  const bookingsData = ref<MemberBookingsResponse>({
    status: "upcoming",
    data: [],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });
  const loading = ref(false);
  const bookingsLoading = ref(false);

  const getDashboard = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await http.get(API_ENDPOINTS.MEMBER.DASHBOARD);
      dashboardData.value = response as MemberDashboardResponse;
    }
    catch (error) {
      console.error("Failed to fetch member dashboard:", error);
      throw error;
    }
    finally {
      loading.value = false;
    }
  };

  const getBookings = async (
    params: Record<string, any> = {},
  ): Promise<void> => {
    bookingsLoading.value = true;
    try {
      const qs = buildQueryString(params);
      const response = await http.get(`${API_ENDPOINTS.MEMBER.BOOKINGS}?${qs}`);
      bookingsData.value = response as MemberBookingsResponse;
    }
    catch (error) {
      console.error("Failed to fetch member bookings:", error);
      throw error;
    }
    finally {
      bookingsLoading.value = false;
    }
  };

  const requestBookingCancellation = async (bookingId: number): Promise<void> => {
    try {
      await http.patch(API_ENDPOINTS.AUTH.REQUEST_CANCELLATION(bookingId));
    }
    catch (error: unknown) {
      console.error(error, "Request Booking Cancellation Error");
      throw error;
    }
  };

  return {
    dashboardData,
    bookingsData,
    loading,
    bookingsLoading,
    getDashboard,
    getBookings,
    requestBookingCancellation,
  };
});
