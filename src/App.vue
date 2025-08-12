<script setup>
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

const route = useRoute();

const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DefaultLayout));
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <component :is="layout">
      <!-- 페이지 콘텐츠 -->
      <RouterView />

      <!-- 전역 에러 알림 -->
      <ErrorAlert />
    </component>
  </div>
</template>
