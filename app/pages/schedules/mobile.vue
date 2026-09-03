<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { usePagination } from "~/composables/use-pagination";
import { useSessionStore } from "~/stores/session";
import { getApiErrorMessage } from "~/utils/error";
import { formatDate } from "~/utils/format";
import { getSessionPath } from "~/utils/session";

type SessionType = "event" | "class" | "workshop";

type Session = {
  id: number;
  name: string;
  title?: string;
  type: SessionType;
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  startsAt?: string;
  endsAt?: string;
  capacity: number;
  bookedCount: number;
  remainingSpots: number;
  availability: number;
  price: number;
  venue?: string;
  location?: string;
  currency?: string;
  [key: string]: any;
};

type CalendarDay = {
  event: boolean;
  class: boolean;
  workshop: boolean;
  total: number;
};

const loading = ref(false);
const sessionStore = useSessionStore();
const { pagination } = usePagination(100);
const { error: showError } = useNotification();
const router = useRouter();

const currentDate = new Date();

const displayedMonth = ref(
  new CalendarDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
);

const selectedDate = ref(
  new CalendarDate(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate(),
  ),
);

const sessions = ref<Session[]>([]);

function formatCalendarDate(date: CalendarDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(
    date.day,
  ).padStart(2, "0")}`;
}

const startDate = computed(() => {
  return new Date(displayedMonth.value.year, displayedMonth.value.month - 1, 1);
});

const endDate = computed(() => {
  return new Date(displayedMonth.value.year, displayedMonth.value.month, 0);
});

const selectedDateLabel = computed(() => {
  const date = selectedDate.value;

  return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
});

async function getSessionsList() {
  try {
    loading.value = true;

    const params = {
      page: pagination.value.page,
      limit: pagination.value.pageSize,

      startDate: formatDate(startDate.value, "YYYY-MM-DD"),

      endDate: formatDate(endDate.value, "YYYY-MM-DD"),

      type: "",
    };

    const res = await sessionStore.getSessionsByDay(params);
    sessions.value = res?.data ?? [];
  }
  catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to load sessions"),
    });

    sessions.value = [];
  }
  finally {
    loading.value = false;
  }
}

function handleDetailSessionView(session: Session) {
  router.push(getSessionPath(session.name || session.title || "session", session.id));
}

const calendarDays = computed<Record<string, CalendarDay>>(() => {
  const result: Record<string, CalendarDay> = {};

  sessions.value.forEach((session) => {
    const date = session.sessionDate;

    if (!result[date]) {
      result[date] = {
        event: false,
        class: false,
        workshop: false,
        total: 0,
      };
    }

    result[date].total++;

    if (session.type === "event") {
      result[date].event = true;
    }

    if (session.type === "class") {
      result[date].class = true;
    }

    if (session.type === "workshop") {
      result[date].workshop = true;
    }
  });

  return result;
});

function getCalendarDay(date: CalendarDate): CalendarDay {
  const dateString = formatCalendarDate(date);

  return (
    calendarDays.value[dateString] ?? {
      event: false,
      class: false,
      workshop: false,
      total: 0,
    }
  );
}

const filteredSessions = computed(() => {
  const date = formatCalendarDate(selectedDate.value);

  return sessions.value.filter(session => session.sessionDate === date);
});

// const selectedDateCounts = computed(() => {
//   return filteredSessions.value.reduce(
//     (counts, session) => {
//       counts[session.type]++;

//       return counts;
//     },
//     {
//       event: 0,
//       class: 0,
//       workshop: 0,
//     } as Record<SessionType, number>,
//   );
// });

const monthCounts = computed(() => {
  return sessions.value.reduce(
    (counts, session) => {
      counts[session.type]++;

      return counts;
    },
    {
      event: 0,
      class: 0,
      workshop: 0,
    } as Record<SessionType, number>,
  );
});

function formatTimeString(time?: string) {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSessionTitle(session: Session) {
  return session.name || "Untitled Session";
}

function getSessionLocation(session: Session) {
  return session.venue || session.location || "Location not specified";
}

watch(displayedMonth, async (newMonth, oldMonth) => {
  if (
    oldMonth
    && newMonth.year === oldMonth.year
    && newMonth.month === oldMonth.month
  ) {
    return;
  }

  selectedDate.value = new CalendarDate(newMonth.year, newMonth.month, 1);

  await getSessionsList();
});

onMounted(async () => {
  await getSessionsList();
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 p-4 sm:p-6 font-sans text-foreground pb-24"
  >
    <div class="mb-6 pt-4">
      <p
        class="text-[#B59A6D] text-[11px] tracking-[0.3em] font-semibold uppercase mb-2"
      >
        Weekly Sessions
      </p>

      <h1
        class="font-serif text-5xl md:text-6xl text-foreground font-normal tracking-wide"
      >
        Schedules
      </h1>
    </div>

    <div
      class="flex items-center gap-4 text-[8px] font-bold tracking-wider mb-6 text-gray-700"
    >
      <!-- Events -->
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 bg-[#1B6F4C] rounded-full" />

        <span class="text-stone-400"> EVENTS - {{ monthCounts.event }} </span>
      </div>

      <!-- Classes -->
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 bg-[#1F4CBB] rounded-full" />

        <span class="text-stone-400"> CLASSES - {{ monthCounts.class }} </span>
      </div>

      <!-- Workshops -->
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 bg-[#7524A6] rounded-full" />

        <span class="text-stone-400">
          WORKSHOPS - {{ monthCounts.workshop }}
        </span>
      </div>
    </div>

    <div class="mb-8">
      <UCalendar
        v-model="selectedDate"
        v-model:placeholder="displayedMonth"
        class="w-full mx-auto"
        :ui="{
          headCell: 'text-xs font-normal',
          gridBody: 'grid gap-2 sm:gap-4',
          cellTrigger:
            'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border data-[selected=true]:bg-primary-700 ',
        }"
      >
        <template #day="{ day }">
          <div class="flex flex-col items-center justify-center w-full h-full">
            <!-- Day number -->
            <span>
              {{ day.day }}
            </span>

            <!-- Session indicators -->
            <div class="flex items-center justify-center gap-1">
              <!-- Event -->
              <span
                v-if="getCalendarDay(day).event"
                class="size-1.5 rounded-full bg-[#1B6F4C]"
              />

              <!-- Class -->
              <span
                v-if="getCalendarDay(day).class"
                class="size-1.5 rounded-full bg-[#1F4CBB]"
              />

              <!-- Workshop -->
              <span
                v-if="getCalendarDay(day).workshop"
                class="size-1.5 rounded-full bg-[#7524A6]"
              />
            </div>
          </div>
        </template>
      </UCalendar>
    </div>

    <div class="-mx-4 sm:-mx-6 px-4 sm:px-6 py-8 min-h-[50vh]">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-foreground font-semibold text-sm">
          {{ selectedDateLabel }}
          &middot;
          {{ filteredSessions.length }} sessions
        </h2>
      </div>

      <div
        v-if="loading"
        class="text-center py-12 text-gray-500 text-sm font-medium"
      >
        Loading sessions...
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          class="group relative border-t-4 p-4 overflow-hidden shadow-sm"
          :class="[getBorderClass(session.type), getCardClass(session.type)]"
          @click="handleDetailSessionView(session)"
        >
          <UIcon
            name="i-lucide-arrow-up-right"
            class="pointer-events-none absolute right-3 top-3 h-5 w-5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          />

          <div
            class="inline-block text-[8px] font-bold text-white px-2 py-0.5 tracking-wider uppercase mb-3 rounded-sm"
            :class="getBadgeClass(session.type)"
          >
            {{ session.type }}
          </div>

          <h3
            class="font-serif text-lg text-foreground font-normal mb-3 leading-tight"
          >
            {{ getSessionTitle(session) }}
          </h3>

          <div
            class="flex flex-col gap-2 text-[11px] text-secondary-500 mb-4 font-medium"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 opacity-50" />

              <span>
                {{ formatTimeString(session.startTime) }}
                -
                {{ formatTimeString(session.endTime) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5 opacity-50" />

              <span>
                {{ getSessionLocation(session) }}
              </span>
            </div>
          </div>

          <UProgress
            v-model="session.bookedCount"
            :max="session.capacity"
            class="my-4 bg-transparent h-0.5"
            :color="getProgressColor(session.type)"
          />

          <div
            class="flex justify-between items-center text-[10px] text-secondary-500 dark:text-secondary-200 font-medium"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-users" class="w-3.5 h-3.5 opacity-50" />

              <span> {{ session.remainingSpots }} spots left </span>
            </div>

            <span class="text-foreground font-serif text-xs">
              {{ session.currency || "NPR" }}
              {{ session.price }}
            </span>
          </div>
        </div>

        <div
          v-if="filteredSessions.length === 0"
          class="text-center py-12 text-gray-500 text-sm font-medium"
        >
          No sessions scheduled for this day.
        </div>
      </div>
    </div>
  </div>
</template>
