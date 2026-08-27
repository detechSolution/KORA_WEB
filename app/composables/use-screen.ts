import { useWindowSize } from "@vueuse/core";

export default function useScreen() {
  const { width } = useWindowSize();

  const isMobile = computed(() => width.value < 768);

  return { isMobile, width };
}
