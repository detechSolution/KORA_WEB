<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

type MenuLink = { name: string; path: string };
type MenuItem = { name: string; image: string; path?: string; children?: MenuLink[] };

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();
const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

const menuItems: MenuItem[] = [
  {
    name: "Experiences",
    image: "/images/hero/offerings_sessions.png",
    children: [
      { name: "Classes", path: "/session?tab=class" },
      { name: "Events", path: "/session?tab=event" },
      { name: "Workshops", path: "/session?tab=workshop" },
    ],
  },
  {
    name: "Sanctuary",
    image: "/images/wellness/spa.png",
    children: [
      { name: "Spa", path: "/spa" },
      { name: "Recovery", path: "/recovery" },
      { name: "Wellness", path: "/wellness" },
      { name: "Nutrition", path: "/nutrition" },
    ],
  },
  { name: "Schedules", path: "/schedules", image: "/images/wellness/classes.png" },
  { name: "Guest Pass", path: "#", image: "/images/hero/offerings_memberships.png" },
  { name: "Gift Card", path: "/gift-card", image: "/images/hero/experience_aroma.png" },
];

const previewImages = [...new Set(menuItems.map(item => item.image))];
const expanded = ref<string | null>(null);
const activeItem = ref<string | null>(null);
const previewVisible = ref(false);
const previewColumn = ref<HTMLElement | null>(null);
const previewPanel = ref<HTMLElement | null>(null);
let previewPointerY: number | null = null;
let previewFrame: number | null = null;
let previewSwitchTimer: ReturnType<typeof setTimeout> | null = null;
let previewHideTimer: ReturnType<typeof setTimeout> | null = null;
const previewImage = ref(menuItems[0]!.image);
const previewOffset = ref(0);
const dialog = ref<HTMLDialogElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;
let previousOverflow: string | null = null;

function close() {
  emit("close");
}

// Map pointer travel across the full menu to the preview's available screen height.
// Accordion heights do not determine the image position.
function trackPreviewPosition() {
  if (previewPointerY === null || !previewColumn.value || !previewPanel.value)
    return;
  const columnTop = previewColumn.value.getBoundingClientRect().top;
  const viewportTop = window.visualViewport?.offsetTop ?? 0;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const maxTop = Math.max(viewportTop + 24, viewportTop + viewportHeight - previewPanel.value.offsetHeight - 24);
  const minTop = Math.min(maxTop, Math.max(viewportTop + 24, columnTop));
  const progress = Math.min(1, Math.max(0, (previewPointerY - viewportTop) / viewportHeight));
  previewOffset.value = minTop + (maxTop - minTop) * progress - columnTop;
  previewFrame = requestAnimationFrame(trackPreviewPosition);
}

function movePreview(event: PointerEvent) {
  if (event.pointerType !== "touch" && activeItem.value !== null)
    previewPointerY = event.clientY;
}

function hidePreview() {
  clearPreviewTimers();
  previewVisible.value = false;
  activeItem.value = null;
  previewPointerY = null;
  if (previewFrame !== null) {
    cancelAnimationFrame(previewFrame);
    previewFrame = null;
  }
}

function clearPreviewTimers() {
  if (previewSwitchTimer !== null)
    clearTimeout(previewSwitchTimer);
  if (previewHideTimer !== null)
    clearTimeout(previewHideTimer);
  previewSwitchTimer = null;
  previewHideTimer = null;
}

function leaveItem() {
  clearPreviewTimers();
  // Bridge the gap between rows without fading the whole preview out and in.
  previewHideTimer = setTimeout(hidePreview, 140);
}

function hoverItem(event: PointerEvent, item: MenuItem) {
  if (event.pointerType === "touch")
    return;
  clearPreviewTimers();
  previewPointerY = event.clientY;
  activeItem.value = item.name;
  const delay = previewVisible.value && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 180 : 0;
  previewSwitchTimer = setTimeout(() => {
    previewImage.value = item.image;
    previewVisible.value = true;
    previewSwitchTimer = null;
  }, delay);
  if (previewFrame === null)
    trackPreviewPosition();
}

function toggleSection(item: MenuItem) {
  expanded.value = expanded.value === item.name ? null : item.name;
}

function restorePage() {
  if (previousOverflow !== null) {
    document.body.style.overflow = previousOverflow;
    previousOverflow = null;
  }
  if (previousFocus?.isConnected)
    previousFocus.focus({ preventScroll: true });
  previousFocus = null;
}

function afterLeave() {
  if (props.isOpen)
    return;
  dialog.value?.close();
  restorePage();
}

watch(() => props.isOpen, async (open) => {
  if (!import.meta.client)
    return;
  hidePreview();
  if (!open)
    return;
  if (previousOverflow === null) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow = document.body.style.overflow;
  }
  document.body.style.overflow = "hidden";
  expanded.value = null;
  previewOffset.value = 0;
  await nextTick();
  if (!props.isOpen)
    return;
  dialog.value?.showModal();
  closeButton.value?.focus({ preventScroll: true });
}, { immediate: true });

onBeforeUnmount(() => {
  hidePreview();
  dialog.value?.close();
  restorePage();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="menu" @after-leave="afterLeave">
      <dialog
        v-if="isOpen"
        id="main-menu"
        ref="dialog"
        class="kora-menu"
        :style="{ colorScheme: colorMode.value === 'dark' ? 'dark' : 'light' }"
        aria-label="Main navigation"
        @pointermove="movePreview"
        @cancel.prevent="close"
      >
        <div class="menu-header">
          <NuxtLink
            to="/"
            aria-label="KORA home"
            @click="close"
          >
            <img
              :src="colorMode.value === 'dark' ? '/logo/kora_white_logo.svg' : '/logo/kora_black_logo.svg'"
              alt="KORA"
              class="menu-logo"
            >
          </NuxtLink>
          <div class="menu-actions">
            <button
              type="button"
              class="menu-theme"
              :aria-label="colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
              :title="colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
              @click="toggleTheme"
            >
              <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
            </button>
            <button
              ref="closeButton"
              type="button"
              class="menu-close"
              aria-label="Close menu"
              @click="close"
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div class="menu-body">
          <div
            ref="previewColumn"
            class="preview-column"
            aria-hidden="true"
          >
            <div
              ref="previewPanel"
              class="menu-preview"
              :class="{ 'is-hovered': previewVisible }"
              :style="{ '--preview-offset': `${previewOffset}px` }"
            >
              <img
                v-for="src in previewImages"
                :key="src"
                :src="src"
                alt=""
                class="preview-image"
                :class="{ 'is-visible': previewVisible && previewImage === src }"
                decoding="async"
              >
            </div>
          </div>

          <nav class="menu-navigation" aria-label="Main">
            <div class="navigation-label">
              <span>Menu navigations</span>
              <span class="navigation-rule" />
            </div>
            <ol class="menu-list">
              <li
                v-for="(item, index) in menuItems"
                :key="item.name"
                class="menu-item"
                :style="{ '--item-delay': `${100 + index * 55}ms` }"
                @pointerenter="hoverItem($event, item)"
                @pointerleave="leaveItem"
                @pointercancel="hidePreview"
              >
                <div
                  class="menu-row"
                >
                  <span class="menu-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                  <button
                    v-if="item.children"
                    :id="`menu-heading-${index}`"
                    type="button"
                    class="menu-title"
                    :aria-label="item.name"
                    :class="{ 'is-active': expanded === item.name }"
                    :aria-expanded="expanded === item.name"
                    :aria-controls="`menu-section-${index}`"

                    @click="toggleSection(item)"
                  >
                    <span class="title-label" aria-hidden="true">
                      <span class="title-default">{{ item.name }}</span>
                      <span class="title-hover">{{ item.name }}</span>
                    </span>
                    <svg
                      class="menu-chevron"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3 7 7 7 7-7"
                        stroke="currentColor"
                        stroke-width="1.1"
                      />
                    </svg>
                  </button>
                  <NuxtLink
                    v-else
                    :to="item.path"
                    class="menu-title"
                    :aria-label="item.name"
                    :class="{ 'is-previewed': activeItem === item.name }"

                    @click="close"
                  >
                    <span class="title-label" aria-hidden="true">
                      <span class="title-default">{{ item.name }}</span>
                      <span class="title-hover">{{ item.name }}</span>
                    </span>
                  </NuxtLink>
                </div>

                <div
                  v-if="item.children"
                  :id="`menu-section-${index}`"
                  class="submenu"
                  :class="{ 'is-expanded': expanded === item.name }"
                  :inert="expanded !== item.name"
                  :aria-hidden="expanded !== item.name"
                  :aria-labelledby="`menu-heading-${index}`"
                >
                  <div class="submenu-clip">
                    <ul class="submenu-links">
                      <li v-for="child in item.children" :key="child.path">
                        <NuxtLink
                          :to="child.path"

                          @click="close"
                        >
                          {{ child.name }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kora-menu {
  --menu-gold: var(--sidebar-primary);
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 32px 5.82vw 64px;
  border: 0;
  background: var(--sidebar);
  color: var(--sidebar-foreground);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.kora-menu::backdrop {
  background: var(--sidebar);
}
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.menu-logo {
  width: 96px;
  height: auto;
}
.menu-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.menu-theme {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 250ms ease;
}
.menu-theme:hover,
.menu-close:hover {
  color: var(--menu-gold);
}
.menu-close {
  position: relative;
  width: 40px;
  height: 44px;
  margin-right: -10px;
  color: var(--muted-foreground);
  cursor: pointer;
}
.menu-close span {
  position: absolute;
  top: 50%;
  left: 14px;
  width: 13px;
  height: 1px;
  background: currentColor;
  transform: rotate(45deg);
  transition: transform 350ms ease;
}
.menu-close span + span {
  transform: rotate(-45deg);
}
.menu-close:hover span {
  transform: rotate(135deg);
}
.menu-close:hover span + span {
  transform: rotate(45deg);
}
.menu-body {
  display: grid;
  grid-template-columns: 26.4% minmax(0, 1fr);
  column-gap: 7.3%;
  margin-top: 40px;
}
.preview-column {
  position: relative;
  pointer-events: none;
}
.menu-preview {
  position: absolute;
  top: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: calc(100dvh - 48px);
  border-radius: 20px;
  overflow: hidden;
  background: var(--sidebar-accent);
  transform: translateY(var(--preview-offset)) scale(0.97);
  opacity: 0;
  visibility: hidden;
  transition:
    transform 950ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 450ms ease,
    visibility 450ms;
}
.menu-preview.is-hovered {
  opacity: 1;
  visibility: visible;
  transform: translateY(var(--preview-offset)) scale(1);
}
.preview-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.045);
  transition:
    opacity 850ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 1400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.preview-image.is-visible {
  opacity: 1;
  transform: scale(1);
}
.navigation-label {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--muted-foreground);
  font-size: 10px;
  line-height: 14px;
  text-transform: uppercase;
}
.navigation-rule {
  height: 1px;
  flex: 1;
  background: var(--sidebar-border);
}
.menu-list {
  list-style: none;
  padding: 0;
  margin: 30px 0 0;
}
.menu-item {
  margin: 0;
  width: fit-content;
  max-width: 100%;
  animation: menu-rise 650ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--item-delay);
}
.menu-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  width: fit-content;
  max-width: 100%;
}
.menu-number {
  width: 12px;
  flex-shrink: 0;
  color: var(--muted-foreground);
  font-size: 10px;
  line-height: 1;
}
.menu-title {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  max-width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(40px, 4.3vw, 66px);
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: -0.02em;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 250ms ease,
    transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-title.is-active,
.menu-title.is-previewed,
.menu-title:hover,
.menu-title:focus-visible {
  color: var(--menu-gold);
}
.title-label {
  display: inline-grid;
  overflow: hidden;
  padding-inline: 0.12em;
  margin-inline: -0.12em;
}
.title-default,
.title-hover {
  grid-area: 1 / 1;
  display: block;
  transition:
    transform 1600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 500ms ease;
}
.title-default {
  opacity: 1;
  transform: translateY(0);
}
.title-hover {
  color: var(--menu-gold);
  font-style: italic;
  opacity: 0;
  transform: translateY(75%);
}
.menu-item:hover .title-default,
.menu-title:focus-visible .title-default {
  opacity: 0;
  transform: translateY(-75%);
}
.menu-item:hover .title-hover,
.menu-title:focus-visible .title-hover {
  opacity: 1;
  transform: translateY(0);
}
.menu-chevron {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--sidebar-foreground);
  transition: transform 350ms ease;
}
.menu-title[aria-expanded="true"] .menu-chevron {
  transform: rotate(0deg);
}
.menu-title[aria-expanded="false"] .menu-chevron {
  transform: rotate(-90deg);
}
.submenu {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  visibility: hidden;
  transition:
    grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 250ms ease,
    visibility 450ms;
}
.submenu.is-expanded {
  grid-template-rows: 1fr;
  opacity: 1;
  visibility: visible;
}
.submenu-clip {
  overflow: hidden;
  min-height: 0;
}
.submenu-links {
  list-style: none;
  margin: 10px 0 12px 24px;
  padding: 0 0 0 12px;
  border-left: 1px solid var(--sidebar-border);
}
.submenu-links a {
  display: block;
  width: fit-content;
  padding: 7px 0;
  font-size: 16px;
  line-height: 24px;
  color: var(--sidebar-foreground);
  text-decoration: none;
  transition:
    color 200ms ease,
    transform 250ms ease;
}
.submenu-links a:hover,
.submenu-links a:focus-visible {
  color: var(--menu-gold);
  transform: translateX(5px);
}
.kora-menu :focus-visible {
  outline: 1px solid var(--menu-gold);
  outline-offset: 5px;
}
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 350ms ease,
    transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}
@keyframes menu-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (min-width: 1600px) {
  .menu-body {
    margin-top: 64px;
  }
}
@media (max-width: 767px) {
  .kora-menu {
    padding: 22px 24px 40px;
  }
  .menu-logo {
    width: 86px;
  }
  .menu-body {
    grid-template-columns: 1fr;
    margin-top: 28px;
    gap: 28px;
  }
  .preview-column {
    display: none;
  }
  .menu-preview {
    position: relative;
    top: auto;
    width: min(58vw, 272px);
    border-radius: 14px;
    transform: none;
  }
  .menu-list {
    margin-top: 20px;
  }
  .menu-title {
    font-size: clamp(36px, 9vw, 52px);
    gap: 20px;
  }
  .submenu-links a {
    padding: 10px 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kora-menu,
  .kora-menu *,
  .kora-menu *::before,
  .kora-menu *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
