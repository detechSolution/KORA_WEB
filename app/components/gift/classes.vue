<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useGiftStore } from "~/stores/gift";

const giftStore = useGiftStore();
const { sessions, loading, error, page, total, selectedSession, selectedSessionId, detailLoading, detailError } = storeToRefs(giftStore);

onMounted(() => giftStore.getClasses(page.value));
</script>

<template>
  <div class="text-foreground">
    <template v-if="selectedSessionId !== null">
      <base-button
        variant="link"
        class="text-primary mb-4"
        @click="giftStore.closeSession()"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to classes
      </base-button>
      <p
        v-if="detailLoading"
        role="status"
        class="py-12 text-center text-secondary-500"
      >
        Loading class details...
      </p>
      <div
        v-else-if="detailError"
        role="alert"
        class="py-12 text-center space-y-4"
      >
        <p>{{ detailError }}</p>
        <base-button variant="outline" @click="giftStore.viewSession(selectedSessionId)">
          Try again
        </base-button>
      </div>
      <ClassSessionDetailView
        v-else-if="selectedSession"
        :session="selectedSession"
        gifting
      />
    </template>
    <template v-else>
      <div
        v-if="loading"
        role="status"
        aria-label="Loading classes"
      >
        <ClassSessionSkeleton />
      </div>
      <div
        v-else-if="error"
        role="alert"
        class="py-12 text-center space-y-4"
      >
        <p>{{ error }}</p>
        <base-button variant="outline" @click="giftStore.getClasses(page)">
          Try again
        </base-button>
      </div>
      <div v-else-if="sessions.length">
        <ClassSessionCard
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          gifting
          @view-gift="giftStore.viewSession($event.id)"
        />
        <base-pagination
          v-if="total > giftStore.pageSize"
          :page="page"
          :total="total"
          :items-per-page="giftStore.pageSize"
          :disabled="loading"
          @update:page="giftStore.getClasses($event)"
        />
      </div>
      <div v-else class="py-16 text-center">
        <h2 class="font-serif text-2xl mb-3">
          More moments to share, soon
        </h2>
        <p class="text-sm text-secondary-500">
          There are no classes available right now. Please check back soon.
        </p>
      </div>
    </template>
  </div>
</template>
