<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';
import { useErrorStore } from '../../stores/error';

const errorStore = useErrorStore();

const email = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');
const emailVerified = ref(false);
const cooldown = ref(0);

let timer = null;
const router = useRouter();

const passwordMatch = computed(() => {
  if (!confirmPassword.value) return null;
  return password.value === confirmPassword.value;
});

const requestCode = async () => {
  errorStore.clear();

  if (!email.value) {
    alert('이메일을 입력해주세요.');
    return;
  }

  try {
    await api.post('/auth/email/send', { email: email.value });
    alert('인증 코드가 전송되었습니다.');
    cooldown.value = 60;
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      if (cooldown.value <= 1) {
        clearInterval(timer);
        timer = null;
        cooldown.value = 0;
      } else {
        cooldown.value = -1;
      }
    }, 1000);
  } catch (e) {
    const msg = e.response.data.message || '인증 요청에 실패했습니다.';
    errorStore.set(msg);
  }
};

const verifyCode = async () => {
  if (!code.value) {
    alert('인증 코드를 입력해주세요.');
    return;
  }

  try {
    await api.post('/auth/email/verify', { email: email.value, code: code.value });
    alert('이메일 인증 성공');
    emailVerified.value = true;

    if (timer) {
      clearInterval(timer);
      timer = null;
      cooldown.value = 0;
    }
  } catch (e) {
    const msg = e.response.data.message || '인증에 실패했습니다. 코드를 확인해주세요.';
    errorStore.set(msg);
  }
};

const handleSignUp = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }
  if (!passwordMatch.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (!emailVerified.value) {
    alert('이메일 인증을 먼저 완료해주세요.');
    return;
  }

  try {
    await api.post('/auth/signup', { email: email.value, password: password.value });
    alert('회원가입 성공! 로그인 화면으로 이동합니다.');
    router.push('/signin');
  } catch (e) {
    const msg = e.response.data.message || '회원 가입 실패';
    errorStore.set(msg);
  }
};

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow dark:bg-slate-800">
      <h2 class="text-center text-xl font-bold text-slate-800 dark:text-white">📮 TimePlanner 회원가입</h2>

      <!-- 이메일 -->
      <div class="space-y-2">
        <label class="block text-sm text-slate-600 dark:text-slate-300">이메일</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
          class="w-full rounded border px-3 py-2 outline-none focus:ring focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <button
          @click="requestCode"
          :disabled="cooldown > 0 || emailVerified"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg mb-4"
        >
          {{ emailVerified ? '인증 완료됨' : cooldown > 0 ? `재요청 (${cooldown})` : '인증 코드 전송' }}
        </button>

        <!-- 인증코드 -->
        <template v-if="!emailVerified">
          <input
            type="text"
            placeholder="인증코드 입력"
            v-model="code"
            class="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <button
            @click="verifyCode"
            class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white py-2 rounded-lg mb-4"
          >
            인증 확인
          </button>
        </template>
      </div>

      <!-- 비밀번호 -->
      <div class="space-y-2">
        <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-slate-200">비밀번호</label>
        <input
          type="password"
          v-model="password"
          class="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="space-y-2">
        <label class="block text-sm mb-1 font-medium text-gray-700 dark:text-slate-200">비밀번호 확인</label>
        <input
          type="password"
          v-model="confirmPassword"
          class="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
        <p
          v-if="passwordMatch !== null"
          class="text-sm mt-1"
          :class="passwordMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ passwordMatch ? '비밀번호가 일치합니다 ✅' : '비밀번호가 일치하지 않습니다 ❌' }}
        </p>
      </div>

      <!-- 회원가입 버튼 -->
      <button @click="handleSignUp" class="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
        회원가입
      </button>
    </div>
  </div>
</template>
