<script setup lang="ts">
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";

import { computed } from "vue";

type Props = {
  variant?: "solid" | "link" | "outline" | "ghost";
  leadingIcon?: string;
  trailingIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "error";
};

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  color: "primary",
  leadingIcon: "",
  trailingIcon: "",
  loading: false,
  disabled: false,
  type: "button",
  to: "",
  size: "lg",
});

// Use explicit class names so Tailwind includes them at build time (no dynamic class names)
const getStyles = computed(() => {
  if (props.color === "primary") {
    switch (props.variant) {
      case "solid":
        return "bg-primary-700 dark:bg-primary-700 hover:bg-primary-700/75 active:bg-primary-700/75 disabled:bg-primary-700 disabled:dark:bg-primary-700 text-white";
      case "outline":
        return "border border-primary-700 text-primary-700 dark:text-primary-700 bg-[#C9A55A1A] hover:bg-[#C9A55A1A]/50 dark:hover:text-primary-700 disabled:bg-transparent";
      case "ghost":
        return "bg-transparent text-primary-700 hover:bg-primary/10 disabled:bg-transparent";
      case "link":
        return "text-foreground hover:text-primary";
      default:
        return "bg-primary hover:bg-primary/75 disabled:bg-primary";
    }
  }
  return "bg-primary hover:bg-primary/75 disabled:bg-primary";
});
</script>

<template>
  <UButton
    :leading-icon="leadingIcon"
    :trailing-icon="trailingIcon"
    loading-icon="i-ph-spinner-gap"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :to="to"
    :size="size"
    :variant="variant"
    :color="color"
    :class="`cursor-pointer ${getStyles} flex items-center justify-center font-semibold px-8 text-xs tracking-widest uppercase`"
    :ui="{
      base: 'rounded-xs h-[36px] sm:h-[44px]',
    }"
  >
    <slot />
  </UButton>
</template>
