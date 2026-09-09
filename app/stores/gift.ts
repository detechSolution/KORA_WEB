import type { ApiResponse } from "~/types/api";
import type { Session } from "~/types/session";
import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import { getApiErrorMessage } from "~/utils/error";

export type GiftCategory = "membership" | "spa" | "classes";

export const useGiftStore = defineStore("gift", () => {
  const http = getHttp();
  const activeCategory = ref<GiftCategory>("membership");
  const sessions = ref<Session[]>([]);
  const page = ref(1);
  const pageSize = 10;
  const total = ref(0);
  const loading = ref(false);
  const error = ref("");
  const selectedSession = ref<Session | null>(null);
  const selectedSessionId = ref<number | null>(null);
  const detailLoading = ref(false);
  const detailError = ref("");
  let listRequest = 0;
  let detailRequest = 0;

  function closeSession() {
    ++detailRequest;
    selectedSession.value = null;
    selectedSessionId.value = null;
    detailLoading.value = false;
    detailError.value = "";
  }

  function selectCategory(category: GiftCategory) {
    activeCategory.value = category;
    closeSession();
  }

  async function getClasses(nextPage = 1) {
    const request = ++listRequest;
    loading.value = true;
    error.value = "";
    page.value = nextPage;
    try {
      const query = new URLSearchParams({ type: "class", page: String(nextPage), limit: String(pageSize) });
      const response = await http.get<ApiResponse<Session[]>>(`${API_ENDPOINTS.SESSION.GET}?${query}`);
      if (request === listRequest) {
        sessions.value = response.data;
        total.value = response.meta.total;
      }
    }
    catch (cause) {
      if (request === listRequest) {
        sessions.value = [];
        total.value = 0;
        error.value = getApiErrorMessage(cause, "Unable to load classes. Please try again.");
      }
    }
    finally {
      if (request === listRequest)
        loading.value = false;
    }
  }

  async function viewSession(id: number) {
    const request = ++detailRequest;
    selectedSessionId.value = id;
    selectedSession.value = null;
    detailLoading.value = true;
    detailError.value = "";
    try {
      const session = await http.get<Session>(`${API_ENDPOINTS.SESSION.GET}/${id}`);
      if (request === detailRequest)
        selectedSession.value = session;
    }
    catch (cause) {
      if (request === detailRequest)
        detailError.value = getApiErrorMessage(cause, "Unable to load this class. Please try again.");
    }
    finally {
      if (request === detailRequest)
        detailLoading.value = false;
    }
  }

  return {
    activeCategory,
    sessions,
    page,
    pageSize,
    total,
    loading,
    error,
    selectedSession,
    selectedSessionId,
    detailLoading,
    detailError,
    selectCategory,
    getClasses,
    viewSession,
    closeSession,
  };
});
