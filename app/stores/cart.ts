import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref<any[]>([]);

  if (import.meta.client) {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        cartItems.value = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart items from local storage", e);
      }
    }

    watch(
      cartItems,
      (newVal) => {
        localStorage.setItem("cartItems", JSON.stringify(newVal));
      },
      { deep: true }
    );
  }

  const addToCart = (item: any) => {
    const cartItem = {
      ...item,
      cartId: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    cartItems.value.push(cartItem);
  };

  const removeItem = (cartId: string | number) => {
    cartItems.value = cartItems.value.filter((item) => item.cartId !== cartId && item.id !== cartId);
  };

  return {
    cartItems,
    addToCart,
    removeItem,
  };
});
