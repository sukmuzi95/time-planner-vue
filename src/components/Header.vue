<script setup>
import { RouterLink } from 'vue-router';
import { computed, ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const isAuthenticated = computed(() => !!auth.accessToken);
const avatarUrl = computed(() => auth.user?.avatarUrl || null);
const displayName = computed(() => auth.user?.name || auth.user?.nickname || auth.user?.email || 'User');

const initials = computed(() => {
  const n = (displayName.value || '').trim();
  if (!n) return 'U';
  const [a = '', b = ''] = n.split(/\s+/);
  return (a[0] || 'U').toUpperCase() + (b[0]?.toUpperCase() || '');
});

const handleLogout = () => {
  auth.logout();
};

// ---- 다크모드 토글 ----
const THEME_KEY = 'theme';
const isDark = ref(false);

const applyTheme = () => {
  const root = document.documentElement;
  if (isDark.value) {
    root.classList.add('dark');
    localStorage.setItem(THEME_KEY, 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, 'light');
  }
};

onMounted(() => {
  //   const saved = localStorage.getItem(THEME_KEY);
  //   if (saved === 'dark') isDark.value = true;
  //   else if (saved === 'light') isDark.value = false;
  //   else isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  //   applyTheme();

  // 현재 html 상태를 기준으로 동기화
  isDark.value = document.documentElement.classList.contains('dark');
});

watch(isDark, applyTheme);
</script>

<template>
  <header class="bg-white dark:bg-slate-900 shadow-md px-6 py-4 flex justify-between items-center">
    <!-- 로고 -->
    <router-link to="/" class="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80">
      TimePlanner
    </router-link>

    <div class="flex items-center gap-4">
      <!-- 다크모드 토글 -->
      <button
        type="button"
        class="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:shadow-none"
        @click="isDark = !isDark"
        :aria-pressed="isDark ? 'true' : 'false'"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <span v-if="!isDark">🌙</span>
        <span v-else>☀️</span>
      </button>

      <!-- 인증 UI -->
      <template v-if="isAuthenticated">
        <RouterLink to="/profile" class="block">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="프로필"
            class="w-10 h-10 rounded-full cursor-pointer object-cover"
          />
          <div
            v-else
            class="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold cursor-pointer"
          >
            {{ initials }}
          </div>
        </RouterLink>

        <button
          @click="handleLogout"
          class="text-sm text-gray-500 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400"
        >
          로그아웃
        </button>
      </template>

      <template v-else>
        <RouterLink to="/signin" class="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
          로그인
        </RouterLink>
      </template>
    </div>
  </header>
</template>
