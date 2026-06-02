<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { usePagination } from "~/composables/use-pagination";
import type { ScheduleEvent } from "~/data/schedules";
import { useSessionStore } from "~/stores/session";
import { getApiErrorMessage } from "~/utils/error";
import { formatDate, normalizeDateTime } from "~/utils/format";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Schedules",
  description: "Weekly sessions, classes, and workshops.",
});

const router = useRouter();
const sessionStore = useSessionStore();
const { pagination } = usePagination(100);
const { error: showError } = useNotification();

const loading = ref(false);
const weekOffset = ref(0);

const sessions = computed(() => {
  return sessionStore.sessions.data.map((session: any) => ({
    id: session.id,
    title: session.name,
    type: session.type,
    start: normalizeDateTime(session.startsAt),
    end: normalizeDateTime(session.endsAt),
    location: session.venue,
    spotsLeft: session.capacity - session.remainingSpots,
    capacity: session.capacity,
    price: `Rs. ${session.price}`,
  }));
});

const startOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const getTimeKey = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const toMinutes = (timeKey: string) => {
  const [hours, minutes] = timeKey.split(":").map(Number);
  return hours * 60 + minutes;
};

const baseWeekStart = startOfWeek(new Date());

const currentWeekStart = computed(() =>
  addDays(baseWeekStart, weekOffset.value * 7),
);
const currentWeekEnd = computed(() => addDays(currentWeekStart.value, 6));

const getCurrentRangeTitle = (format?: string) => {
  const start = currentWeekStart.value;
  const end = currentWeekEnd.value;

  if (format) {
    return {
      startDate: formatDate(start, format),
      endDate: formatDate(end, format),
    };
  }

  const sameMonth = start.getMonth() === end.getMonth();

  const startMonth = start
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  const endMonth = end
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  return sameMonth
    ? `${startMonth} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`
    : `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
};

const currentRange = computed(() => ({
  title: getCurrentRangeTitle(),
  startDate: formatDate(currentWeekStart.value, "YYYY-MM-DD"),
  endDate: formatDate(currentWeekEnd.value, "YYYY-MM-DD"),
}));

const weekDates = computed(() =>
  Array.from({ length: 7 }, (_, index) =>
    addDays(currentWeekStart.value, index),
  ),
);

const weekEvents = computed(() =>
  sessions.value.filter((event) => {
    const start = new Date(event.start);
    return (
      start >= currentWeekStart.value &&
      start < addDays(currentWeekStart.value, 7)
    );
  }),
);

const timeSlots = computed(() =>
  [
    ...new Set(
      weekEvents.value.map((event) => getTimeKey(new Date(event.start))),
    ),
  ].sort((left, right) => toMinutes(left) - toMinutes(right)),
);

const scheduleByDayAndTime = computed(() => {
  const grouped = new Map<string, ScheduleEvent[]>();

  for (const event of weekEvents.value) {
    const start = new Date(event.start);
    const key = `${start.toDateString()}__${getTimeKey(start)}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(event);
    grouped.set(key, bucket);
  }

  return grouped;
});

const sessionCounts = computed(() => ({
  Event: weekEvents.value.filter((event) => event.type === "event").length,
  Class: weekEvents.value.filter((event) => event.type === "class").length,
  Workshop: weekEvents.value.filter((event) => event.type === "workshop")
    .length,
}));

const nextWeek = () => {
  weekOffset.value += 1;
};

const prevWeek = () => {
  weekOffset.value -= 1;
};

const getEventsForCell = (day: Date, timeKey: string) =>
  scheduleByDayAndTime.value.get(`${day.toDateString()}__${timeKey}`) ?? [];

const getBadgeClass = (type: string) => {
  if (type === "event")
    return "bg-emerald-800 dark:bg-[#1B3B36] text-white dark:text-[#6EE7B7]";
  if (type === "workshop")
    return "bg-purple-800 dark:bg-[#3D1E62] text-white dark:text-[#D8B4FE]";
  if (type === "class")
    return "bg-blue-800 dark:bg-[#1E3A8A] text-white dark:text-[#93C5FD]";
  return "bg-stone-800 text-white dark:text-stone-300";
};

const getProgressColor = (type: string) => {
  if (type === "event") return "emerald";
  if (type === "workshop") return "purple";
  if (type === "class") return "blue";
  return "stone";
};

const getBorderClass = (type: string) => {
  if (type === "event") return "border-emerald-800";
  if (type === "workshop") return "border-purple-800";
  if (type === "class") return "border-blue-800";
  return "border-stone-300 dark:border-stone-800";
};

const getCardClass = (type: string) => {
  if (type === "event") return "bg-[#006045]/15 hover:bg-[#006045]/35";
  if (type === "workshop") return "bg-[#6E11B0]/15 hover:bg-[#6E11B0]/35";
  if (type === "class") return "bg-[#193CB8]/15 hover:bg-[#193CB8]/35";
  return "bg-[#151515] hover:bg-[#1C1C1C]";
};

const formatTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

async function getSessionsList() {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.page,
      limit: pagination.value.pageSize,
      startDate: currentRange.value.startDate,
      endDate: currentRange.value.endDate,
      type: "",
    };
    await sessionStore.getSessions(params);
  } catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to load inquiries"),
    });
  } finally {
    loading.value = false;
  }
}

const handleDetailSessionView = (id: string | number) => {
  router.push(`/class/${id}`);
};

onMounted(() => {
  getSessionsList();
});

watch(
  () => weekOffset.value,
  () => {
    getSessionsList();
  },
);
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 min-h-screen text-foreground dark:text-white pt-24 pb-20 font-sans select-none"
  >
    <div class="max-w-400 mx-auto px-6">
      <div
        class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-b border-border pb-8"
      >
        <div>
          <h2
            class="text-[#B59A6D] text-[11px] font-bold tracking-[0.3em] uppercase mb-4"
          >
            WEEKLY SESSIONS
          </h2>
          <h1
            class="font-serif text-5xl md:text-6xl text-foreground font-normal tracking-wide"
          >
            Schedules
          </h1>
        </div>
        <!-- <ClassHeader label="WEEKLY SESSIONS" title="Schedules"/> -->

        <div
          class="flex flex-col items-start gap-6 text-[10px] font-bold tracking-widest uppercase"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5">
              <span
                class="w-2 h-2 bg-emerald-800 rounded-full inline-block"
              ></span>
              <span class="text-stone-400"
                >EVENTS - {{ sessionCounts.Event }}</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span
                class="w-2 h-2 bg-blue-800 rounded-full inline-block"
              ></span>
              <span class="text-stone-400"
                >CLASSES - {{ sessionCounts.Class }}</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span
                class="w-2 h-2 bg-purple-800 rounded-full inline-block"
              ></span>
              <span class="text-stone-400"
                >WORKSHOPS - {{ sessionCounts.Workshop }}</span
              >
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="px-4 py-2 border border-stone-300 dark:border-stone-800 bg-transparent hover:bg-[#212121] transition-colors rounded-xs text-stone-400 flex items-center gap-2"
            >
              FILTER BY SESSIONS
              <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5" />
            </button>
            <button
              class="px-4 py-2 border border-stone-300 dark:border-stone-800 bg-transparent hover:bg-[#212121] transition-colors rounded-xs text-stone-400 flex items-center gap-2"
            >
              FILTER BY VENUE
              <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div class="bg-background dark:bg-transparent rounded-sm">
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="prevWeek"
            class="w-9 h-9 border border-stone-300 dark:border-stone-800 flex items-center justify-center rounded-xs text-foreground dark:text-stone-400 hover:text-white hover:bg-[#212121] transition-colors"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </button>
          <div
            class="px-5 py-2.5 border border-stone-300 dark:border-stone-800 text-[10px] font-bold tracking-widest uppercase text-foreground dark:text-stone-300 rounded-xs"
          >
            {{ currentRange.title }}
          </div>
          <button
            @click="nextWeek"
            class="w-9 h-9 border border-stone-300 dark:border-stone-800 flex items-center justify-center rounded-xs text-foreground dark:text-stone-400 hover:text-white hover:bg-[#212121] transition-colors"
          >
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-x-auto">
          <div
            class="min-w-[1400px] border border-stone-300 dark:border-stone-800 xl:min-w-0"
          >
            <div class="grid grid-cols-[100px_repeat(7,minmax(0,1fr))]">
              <div
                class="border-b border-r border-stone-300 dark:border-stone-800 px-4 py-5 text-[10px] font-bold tracking-[0.18em] uppercase text-stone-500 flex items-center justify-center"
              >
                Time
              </div>

              <div
                v-for="day in weekDates"
                :key="day.toISOString()"
                class="border-b border-r last:border-r-0 border-stone-300 dark:border-stone-800"
              >
                <div
                  class="flex flex-col items-center justify-center py-4 text-stone-400 gap-1.5"
                >
                  <span
                    class="text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    {{
                      day
                        .toLocaleDateString("en-US", { weekday: "short" })
                        .toUpperCase()
                    }}
                  </span>
                  <span
                    class="font-serif text-3xl text-foreground font-normal leading-none"
                  >
                    {{ day.getDate() }}
                  </span>
                  <span
                    class="text-[9px] font-bold tracking-[0.2em] uppercase text-stone-500"
                  >
                    {{
                      day
                        .toLocaleDateString("en-US", { month: "short" })
                        .toUpperCase()
                    }}
                  </span>
                </div>
              </div>

              <template v-if="timeSlots.length">
                <template v-for="timeKey in timeSlots" :key="timeKey">
                  <div
                    class="border-b border-r border-stone-300 dark:border-stone-800 px-4 py-6 text-[10px] font-bold tracking-[0.14em] uppercase text-primary flex items-center justify-center"
                  >
                    {{ formatTime(`2000-01-01T${timeKey}:00`) }}
                  </div>

                  <div
                    v-for="day in weekDates"
                    :key="`${day.toISOString()}-${timeKey}`"
                    class="border-b border-r last:border-r-0 border-stone-300 dark:border-stone-800 bg-background dark:bg-secondary-900 align-top"
                    :class="{ 'bg-[#1D1D1D]': isSameDay(day, new Date()) }"
                  >
                    <div
                      v-if="getEventsForCell(day, timeKey).length"
                      class="flex h-full flex-col gap-3 p-1.5"
                    >
                      <div
                        v-for="event in getEventsForCell(day, timeKey)"
                        :key="event.id"
                        :class="[
                          'group relative min-h-[180px] w-full flex flex-col p-3 border-t-4 transition-colors rounded-xs hover:cursor-pointer',
                          getBorderClass(event.type),
                          getCardClass(event.type),
                        ]"
                        @click="handleDetailSessionView(event.id)"
                      >
                        <UIcon
                          name="i-lucide-arrow-up-right"
                          :class="[
                            'pointer-events-none absolute right-3 top-3 h-5 w-5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100',
                            `bg-${getProgressColor(event.type)}-800`,
                          ]"
                        />
                        <div class="mb-2.5">
                          <span
                            :class="[
                              'px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded-xs inline-block',
                              getBadgeClass(event.type),
                            ]"
                          >
                            {{ event.type }}
                          </span>
                        </div>

                        <div
                          class="font-serif text-lg text-foreground font-normal mb-3 leading-tight"
                        >
                          {{ event.title }}
                        </div>

                        <div
                          class="flex flex-col gap-2 text-[10px] font-light text-secondary-500 dark:text-secondary-200 mb-auto"
                        >
                          <div class="flex items-center gap-2">
                            <UIcon
                              name="i-lucide-clock"
                              class="w-3.5 h-3.5 shrink-0"
                            />
                            <span class="truncate">
                              {{ formatTime(event.start) }} -
                              {{ formatTime(event.end) }}
                            </span>
                          </div>
                          <div class="flex items-center gap-2">
                            <UIcon
                              name="i-lucide-map-pin"
                              class="w-3.5 h-3.5 shrink-0"
                            />
                            <span class="truncate">{{ event.location }}</span>
                          </div>
                        </div>

                        <div>
                          <UProgress
                            v-model="event.spotsLeft"
                            :max="event.capacity"
                            class="my-4 bg-transparent h-0.5"
                            :color="getProgressColor(event.type)"
                          />
                          <div
                            class="flex items-center justify-between dark:border-stone-800/60 text-[10px]"
                          >
                            <div
                              class="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-200"
                            >
                              <UIcon
                                name="i-lucide-users"
                                class="w-3.5 h-3.5"
                              />
                              {{ event.spotsLeft }} spots left
                            </div>
                            <div class="text-foreground font-serif text-xs">
                              {{ event.price }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <template v-else>
                <div
                  class="col-span-8 px-6 py-16 text-center text-sm text-stone-500 uppercase tracking-[0.2em]"
                >
                  No sessions scheduled for this week.
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
