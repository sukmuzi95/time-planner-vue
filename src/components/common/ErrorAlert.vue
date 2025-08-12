<!-- src/components/ErrorAlert.vue -->
<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

// 노출 여부는 message 유무로 제어
const message = computed(() => errorStore.message);
const visible = computed(() => !!message.value);

const AUTO_CLOSE_MS = 4000;
let timer = null;

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function scheduleAutoClose() {
  clearTimer();
  if (!message.value) return;
  timer = setTimeout(() => {
    errorStore.clear();
  }, AUTO_CLOSE_MS);
}

function handleMouseEnter() {
  // 호버 시 자동 닫힘 일시정지
  clearTimer();
}
function handleMouseLeave() {
  // 다시 카운트다운 시작
  scheduleAutoClose();
}

function close() {
  clearTimer();
  errorStore.clear();
}

// message가 바뀔 때마다 자동 닫힘 스케줄링
watch(message, (val) => {
  clearTimer();
  if (val) scheduleAutoClose();
});

// 컴포넌트 unmount 시 타이머 정리
onBeforeUnmount(() => clearTimer());
</script>

<template>
  <!-- 스크린리더에 즉시 읽히도록 role="alert" -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="visible"
      role="alert"
      class="fixed inset-x-0 top-4 z-[1000] mx-auto w-[92%] max-w-xl"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div
        class="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg border-red-200 bg-red-50 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-100 backdrop-blur"
      >
        <!-- 아이콘 -->
        <svg class="mt-0.5 h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M9.401 1.592a1.5 1.5 0 0 1 1.198 0l7.5 3.333A1.5 1.5 0 0 1 19 6.333v7.334a1.5 1.5 0 0 1-.9 1.375l-7.5 3.333a1.5 1.5 0 0 1-1.2 0l-7.5-3.333A1.5 1.5 0 0 1 1 13.667V6.333A1.5 1.5 0 0 1 1.9 4.925l7.5-3.333ZM9 6.25a1 1 0 1 1 2 0v4.5a1 1 0 1 1-2 0v-4.5Zm1 8a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- 메시지 -->
        <p class="flex-1 leading-6">
          {{ message }}
        </p>

        <!-- 닫기 버튼 -->
        <button
          type="button"
          class="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:text-red-100 dark:hover:bg-red-800/40 dark:focus:ring-red-700"
          @click="close"
          aria-label="닫기"
          title="닫기"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293A1 1 0 0 1 4.293 14.293L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>
