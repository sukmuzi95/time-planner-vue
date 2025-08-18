import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';
import router from '../router';

const STORAGE_KEY = 'auth';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed.accessToken ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

function saveToStorage({ accessToken, user }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, user }));
}

export const useAuthStore = defineStore('auth', () => {
  const { accessToken: at, user: initialUser } = loadFromStorage();
  const accessToken = ref(at);
  const user = ref(initialUser);

  const isAuthenticated = computed(() => !!accessToken.value);

  function initializeFromStorage() {
    const { accessToken: at2, user: u2 } = loadFromStorage();
    accessToken.value = at2;
    user.value = u2;
  }

  function setTokens({ accessToken: newAT }) {
    accessToken.value = newAT || null;
    saveToStorage({ accessToken: accessToken.value, user: user.value });
  }

  function setUser(newUser) {
    user.value = newUser || null;
    saveToStorage({ accessToken: accessToken.value, user: user.value });
  }

  // 로그인: 응답 { user, accessToken }
  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password }, { withCredentials: true });
    // data: { user, accessToken }
    setTokens({ accessToken: data.accessToken });
    setUser(data.user);
    return data;
  }

  // 로그아웃: 서버 쿠키 제거 + 클라 상태 초기화
  async function logout() {
    try {
      await api.post('/auth/logout', null, { withCredentials: true }).catch(() => {});
    } finally {
      accessToken.value = null;
      user.value = null;
      localStorage.removeItem(STORAGE_KEY);
      router.push('/');
    }
  }

  // 리프레시: 서버 쿠키 사용
  let refreshing = null;
  async function refresh() {
    if (!refreshing) {
      refreshing = (async () => {
        const { data } = await api.post('/auth/reissue-token', {}, { withCredentials: true });
        // data: { accessToken }
        setTokens({ accessToken: data.accessToken });
        refreshing = null;
        return data.accessToken;
      })().catch((e) => {
        refreshing = null;
        // 실패 시 세션 만료 처리
        logout();
        throw e;
      });
    }
    return refreshing;
  }

  // 다른 탭 동기화
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) initializeFromStorage();
  });

  return {
    accessToken,
    user,
    isAuthenticated,
    initializeFromStorage,
    setTokens,
    setUser,
    login,
    logout,
    refresh,
  };
});
