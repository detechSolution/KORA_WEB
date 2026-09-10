import type { Spa, SpaCategory, SpaCategoryDetail } from "~/types/spa";

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import { getApiErrorMessage } from "~/utils/error";

export const useSpaStore = defineStore("spa", () => {
  const http = getHttp();

  const spa = ref<Spa>();
  const categories = ref<SpaCategory[]>([]);
  const selectedCategoryId = ref<number | null>(null);
  const categoryDetail = ref<SpaCategoryDetail | null>(null);
  const categoriesLoading = ref(false);
  const categoryLoading = ref(false);
  const categoriesError = ref("");
  const categoryError = ref("");
  let categoryRequestId = 0;
  const selectedCategory = computed(() => categories.value.find(
    category => category.id === selectedCategoryId.value,
  ));
  const categoryServices = computed(() => categoryDetail.value?.services ?? categoryDetail.value?.subTypes ?? []);

  async function selectCategory(id: number) {
    if (!categories.value.some(category => category.id === id)) {
      return;
    }

    const requestId = ++categoryRequestId;
    selectedCategoryId.value = id;
    categoryDetail.value = null;
    categoryError.value = "";
    categoryLoading.value = true;
    try {
      const response = await http.get<SpaCategoryDetail>(API_ENDPOINTS.SPA.CATEGORY(id));
      if (requestId === categoryRequestId) {
        categoryDetail.value = response;
      }
    }
    catch (error) {
      if (requestId === categoryRequestId) {
        categoryError.value = getApiErrorMessage(error, "Failed to load spa treatments.");
      }
    }
    finally {
      if (requestId === categoryRequestId) {
        categoryLoading.value = false;
      }
    }
  }

  async function getCategories() {
    if (categoriesLoading.value) {
      return;
    }
    categoriesLoading.value = true;
    categoriesError.value = "";
    ++categoryRequestId;
    categoryDetail.value = null;
    categoryError.value = "";
    categoryLoading.value = false;
    try {
      categories.value = await http.get<SpaCategory[]>(API_ENDPOINTS.SPA.CATEGORIES);
      const category = selectedCategory.value ?? categories.value[0];
      selectedCategoryId.value = category?.id ?? null;
      if (category) {
        await selectCategory(category.id);
      }
    }
    catch (error) {
      categories.value = [];
      selectedCategoryId.value = null;
      categoriesError.value = getApiErrorMessage(error, "Failed to load spa categories.");
    }
    finally {
      categoriesLoading.value = false;
    }
  }

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
    categories,
    selectedCategoryId,
    selectedCategory,
    categoryDetail,
    categoryServices,
    categoriesLoading,
    categoryLoading,
    categoriesError,
    categoryError,
    getCategories,
    selectCategory,
    getSpas,
    getAvailableTimes,
  };
});
