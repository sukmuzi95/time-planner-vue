<script setup>
import Header from '../components/common/Header.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
