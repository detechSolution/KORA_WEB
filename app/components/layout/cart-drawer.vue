<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

const isRemoveItemModalOpen = ref(false);
const selectedItemId = ref<string | "">("");

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const { error: showError } = useNotification();

const cartItems = computed(() => cartStore.cartItems);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.finalPrice, 0);
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN").format(price);
}

function openRemoveModal(id: string) {
  selectedItemId.value = id;
  isRemoveItemModalOpen.value = true;
}

function handleRemoveItem() {
  if (selectedItemId.value !== "") {
    cartStore.removeItem(selectedItemId.value);
  }

  isRemoveItemModalOpen.value = false;
  selectedItemId.value = "";
}

function handleProceedToCheckout() {
  if (authStore.isAuthenticated && authStore.isMembershipFrozen()) {
    showError({
      message: "Your membership is currently frozen. Booking is disabled.",
    });
    return;
  }

  router.push("/checkout");
  close();
}
</script>

<template>
  <base-drawer
    :open="isOpen"
    :drawer-width="520"
    class="pb-12 sm:pb-0"
    @close="close"
  >
    <template #header>
      <div
        class="flex items-start justify-between p-8 pb-6 border-b border-border"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-serif text-foreground">
            Your Cart
          </h2>
          <span
            class="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold"
          >
            {{ cartItems.length }} ITEMS ADDED
          </span>
        </div>

        <button
          class="w-8 h-8 flex items-center justify-center border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-colors duration-200"
          aria-label="Close cart"
          @click="close"
        >
          <span class="relative w-3 h-3 flex items-center justify-center">
            <span
              class="absolute h-[1px] w-full bg-current transform rotate-45"
            />
            <span
              class="absolute h-[1px] w-full bg-current transform -rotate-45"
            />
          </span>
        </button>
      </div>
    </template>

    <div
      v-if="cartItems.length === 0"
      class="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6 h-full min-h-[400px]"
    >
      <div
        class="w-16 h-16 border border-border/40 flex items-center justify-center text-primary"
      >
        <UIcon name="i-lucide-shopping-bag" class="w-6 h-6" />
      </div>
      <div class="flex flex-col gap-3">
        <h3 class="text-xl font-semibold font-serif text-foreground">
          Your Cart is Empty
        </h3>
        <p
          class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed"
        >
          Book sessions & spa or purchase membership & passes to begin your
          ritual
        </p>
      </div>
    </div>

    <div v-else class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <!-- Cart Items -->
        <div
          v-for="item in cartItems"
          :key="item.referenceId"
          class="flex gap-4 pb-6 border-b border-border"
        >
          <!-- Item Details -->
          <div class="flex-1 flex flex-col pt-1">
            <span
              v-if="item.bookingFor === 'visitor'"
              class="text-[10px] uppercase text-primary-700"
            >
              {{ "Guest" }}
            </span>
            <div class="flex justify-between items-start gap-4">
              <div class="flex items-center gap-2">
                <h4 class="text-2xl font-semibold font-serif text-foreground">
                  {{ item.title }}
                  <!-- <br> -->
                  <span v-if="item.itemType !== 'membership'">
                    (<span class="text-2xl font-semibold">{{
                      item.visitors.length > 0 ? item.visitors.length : 1
                    }}
                      x {{ formatPrice(item.unitPriceAfterDiscount) }}</span>)
                  </span>
                </h4>
                <span
                  v-if="item.itemType === 'session'"
                  class="text-[10px] px-1.5 py-0.5 bg-purple-900 dark:bg-purple-900/40 text-purple-300 font-medium tracking-wide"
                >Session</span>
                <span
                  v-if="item.itemType === 'spa'"
                  class="text-[10px] px-1.5 py-0.5 bg-emerald-900 dark:bg-emerald-900/40 text-emerald-400 font-medium tracking-wide"
                >Spa</span>
                <span
                  v-if="item.itemType === 'pass'"
                  class="text-[10px] px-1.5 py-0.5 bg-blue-900 dark:bg-blue-900/40 text-blue-400 font-medium tracking-wide"
                >Pass</span>
                <span
                  v-if="item.itemType === 'membership'"
                  class="text-[10px] px-1.5 py-0.5 bg-primary dark:bg-[#5D4A17] text-primary-foreground font-medium tracking-wide"
                >Membership</span>
              </div>
              <span class="text-2xl font-serif text-[#B59A6D]">Rs. {{ formatPrice(item.finalPrice) }}</span>
            </div>

            <div class="mt-2 flex gap-1.5">
              <div
                v-if="item.bookingDate"
                class="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                <span>{{ item.bookingDate }}</span>
              </div>
              <div
                v-if="item.bookingTime"
                class="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                <span>{{ formatTime(item.bookingTime) }}</span>
              </div>
              <div
                v-if="item.location"
                class="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                <span>{{ item.location }}</span>
              </div>
              <div
                v-if="item.discountText"
                class="text-[10px] text-muted-foreground mt-1"
              >
                {{ item.discountText }}
              </div>
            </div>

            <div class="mt-auto flex justify-end">
              <button
                class="text-red-800 hover:text-red-700 transition-colors hover:cursor-pointer"
                aria-label="Remove item"
                @click="openRemoveModal(item.cartId)"
              >
                <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer (Total & Checkout) -->
      <template v-if="cartItems.length > 0">
        <div class="p-8 pb-4">
          <div
            class="flex items-center justify-between border-t border-border/20 pt-6 mb-8"
          >
            <span class="text-2xl font-semibold font-serif text-foreground">Total</span>
            <span class="text-2xl font-semibold font-serif text-primary">{{
              formatPrice(totalPrice)
            }}</span>
          </div>

          <base-button class="w-full" @click="handleProceedToCheckout">
            Proceed to Checkout
          </base-button>
        </div>
      </template>
    </div>
  </base-drawer>

  <cart-delete-modal
    :open="isRemoveItemModalOpen"
    @close="isRemoveItemModalOpen = false"
    @confirm="handleRemoveItem"
  />
</template>
