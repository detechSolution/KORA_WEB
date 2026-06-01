import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import type { MembershipPlans, Passes } from "~/types/membership";
import type { ApiResponse } from "~/types/api";

type MembershipFrequency = "monthly" | "quarterly" | "yearly" | "custom";

export const useMembershipStore = defineStore("membership", () => {
  const http = getHttp();

  const membershipPlans = ref<MembershipPlans[]>([]);
  const passPlans = ref<Passes[]>([]);

  const isLoadingMembership = ref(false);
  const isLoadingPass = ref(false);

  const membershipError = ref<string | null>(null);
  const passError = ref<string | null>(null);

  const groupedMembershipPlans = computed(() => {
    const grouped: Record<MembershipFrequency, MembershipPlans[]> = {
      monthly: [],
      quarterly: [],
      yearly: [],
      custom: [],
    };

    membershipPlans.value.forEach((plan) => {
      const hasMonthly = plan.options?.some(
        (option) => option.frequency === "monthly",
      );

      const hasQuarterly = plan.options?.some(
        (option) => option.frequency === "quarterly",
      );

      const hasYearly = plan.options?.some(
        (option) => option.frequency === "yearly",
      );

      const hasCustom = plan.options?.some(
        (option) => option.frequency === "custom",
      );

      if (hasMonthly) grouped.monthly.push(plan);

      if (hasQuarterly) grouped.quarterly.push(plan);

      if (hasYearly) grouped.yearly.push(plan);

      if (hasCustom) grouped.custom.push(plan);
    });

    return grouped;
  });

  const getMembership = async () => {
    isLoadingMembership.value = true;
    membershipError.value = null;

    try {
      const response = await http.get<ApiResponse<MembershipPlans[]>>(
        API_ENDPOINTS.MEMBERSHIP.GET,
      );

      membershipPlans.value = response.data || [];
    } catch (error: any) {
      membershipError.value =
        error?.message || "Failed to fetch membership plans";

      console.error("Failed to fetch membership plans:", error);

      throw error;
    } finally {
      isLoadingMembership.value = false;
    }
  };

  const getPass = async () => {
    isLoadingPass.value = true;
    passError.value = null;

    try {
      const response = await http.get<Passes[]>(API_ENDPOINTS.PASS.GET);

      passPlans.value = response || [];
    } catch (error: any) {
      passError.value = error?.message || "Failed to fetch pass plans";

      console.error("Failed to fetch pass plans:", error);

      throw error;
    } finally {
      isLoadingPass.value = false;
    }
  };

  return {
    membershipPlans,
    passPlans,

    groupedMembershipPlans,

    isLoadingMembership,
    isLoadingPass,

    membershipError,
    passError,

    getMembership,
    getPass,
  };
});
