<script setup lang="ts">
import { computed } from "vue";

type Props = {
  open: boolean;
  dismissible?: boolean;
  handle?: boolean;
  direction?: "left" | "right" | "top" | "bottom";
  overlayClass?: string;
  contentClass?: string;
  drawerWidth?: number;
  title?: string;
};

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
  handle: false,
  direction: "right",
  overlayClass: "bg-black/50 backdrop-blur-sm",
  contentClass: "",
  drawerWidth: 520,
  title: "Edit",
});

const emit = defineEmits<{
  close: [];
}>();
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) {
      emit("close");
    }
  },
});

const widthClassMap: Record<number, string> = {
  420: "max-w-[420px]",
  480: "max-w-[480px]",
  520: "max-w-[520px]",
  600: "max-w-[600px]",
  700: "max-w-[700px]",
};

const ui = computed(() => ({
  content: `inset-y-0 right-0 flex h-screen w-full ${widthClassMap[props.drawerWidth] ?? widthClassMap[520]} flex-col overflow-hidden rounded-none bg-background text-foreground shadow-2xl border-l border-border ${props.contentClass}`.trim(),
  overlay: props.overlayClass,
}));
</script>

<template>
  <UDrawer
    v-model:open="isOpen"
    :direction="direction"
    :dismissible="dismissible"
    :handle="handle"
    :ui="ui"
  >
    <template #content>
      <!-- Drawer Header -->
      <slot name="header">
        <div class="flex items-center justify-between gap-4 p-6 border-b border-border">
          <h2 class="text-2xl font-serif text-foreground font-medium">
            {{ title }}
          </h2>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="emit('close')"
          />
        </div>
      </slot>

      <!-- Drawer Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <slot />
      </div>

      <!-- Drawer Footer -->
      <slot name="footer" />
    </template>
  </UDrawer>
</template>
