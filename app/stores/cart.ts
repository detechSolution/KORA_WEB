import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { API_ENDPOINTS } from "~/config/constants";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref<any[]>([]);
  const http = getHttp();
  const promoCode = ref<string | null>(null);
  const discountAmount = ref<number>(0);
  const discountType = ref<string | null>(null);
  const isApplyingPromo = ref<boolean>(false);
  const promoError = ref<string | null>(null);
  const isPromoValid = ref<boolean>(false);
  // const cartCount = computed(() =>
  //   cartItems.value.reduce((total, item) => {
  //     const visitorsCount = item.visitors?.length > 0 ? item.visitors.length : 1;
  //     return total + visitorsCount;
  //   }, 0),
  // );
  const cartCount = computed(() => cartItems.value.length);

  if (import.meta.client) {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        cartItems.value = JSON.parse(saved);
      }
      catch (e) {
        console.error("Failed to parse cart items from local storage", e);
      }
    }

    watch(
      cartItems,
      (newVal) => {
        localStorage.setItem("cartItems", JSON.stringify(newVal));
      },
      { deep: true },
    );
  }

  const addToCart = (item: any) => {
    const cartItem = {
      ...item,
      cartId: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    cartItems.value.push(cartItem);
  };

  const removePromoCode = () => {
    promoCode.value = null;
    discountAmount.value = 0;
    promoError.value = null;
    isPromoValid.value = false;
  };

  const removeItem = (cartId: string | number) => {
    cartItems.value = cartItems.value.filter(item => item.cartId !== cartId && item.id !== cartId);

    if (cartItems.value.length === 0) {
      removePromoCode();
    }
  };

  const applyPromoCode = async (code: string) => {
    isApplyingPromo.value = true;
    promoError.value = null;
    try {
      const response: any = await http.post(API_ENDPOINTS.PROMO_CODE.VALIDATE, { code });

      promoCode.value = code;
      discountAmount.value = response?.amount || 0;
      discountType.value = response?.type;
      isPromoValid.value = response.isValid;
      promoError.value = response.message;
    }
    catch (e: any) {
      promoCode.value = null;
      discountAmount.value = 0;
      isPromoValid.value = false;
      discountType.value = null;
      promoError.value = e?.response?._data?.message || e?.message || "Failed to apply promo code";
    }
    finally {
      isApplyingPromo.value = false;
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    removePromoCode();
  };

  return {
    cartItems,
    cartCount,
    promoCode,
    discountAmount,
    discountType,
    isApplyingPromo,
    isPromoValid,
    promoError,
    addToCart,
    removeItem,
    applyPromoCode,
    removePromoCode,
    clearCart,
  };
});
