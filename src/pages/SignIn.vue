<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useErrorStore } from '../stores/error';

const email = ref('');
const password = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const errorStore = useErrorStore();

const signin = async () => {
  if (loading.value) return;
  loading.value = true;
  errorStore.clear();

  try {
    await auth.login({ email: email.value, password: password.value }); // auth.js 기준
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/schedule';
    await router.replace(redirect);
  } catch (e) {
    const msg = e?.response?.data?.message || '로그인에 실패했습니다.';
    errorStore.set(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <form @submit.prevent="signin" class="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow dark:bg-slate-800">
      <h2 class="text-center text-xl font-bold text-slate-800 dark:text-white">로그인</h2>

      <div class="space-y-2">
        <label class="block text-sm text-slate-600 dark:text-slate-300">이메일</label>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
          class="w-full rounded border px-3 py-2 outline-none focus:ring focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm text-slate-600 dark:text-slate-300">비밀번호</label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          required
          class="w-full rounded border px-3 py-2 outline-none focus:ring focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {{ loading ? '로그인 중…' : '로그인' }}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        회원이 아니신가요?
        <router-link to="/signup" class="text-indigo-600 hover:underline">회원가입</router-link>
      </div>
    </form>
  </div>
</template>
