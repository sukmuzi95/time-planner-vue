import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../pages/Home.vue';
import SignIn from '../pages/SignIn.vue';
import ScheduleCalendar from '../pages/ScheduleCalendar.vue';

const routes = [
  // 공개 페이지 (레이아웃: default)
  { path: '/', name: 'home', component: Home, meta: { layout: 'default', public: true } },

  // 공개 페이지 (레이아웃: auth)
  { path: '/signin', name: 'signin', component: SignIn, meta: { layout: 'auth', public: true } },

  // 인증 필요한 페이지 (레이아웃: default)
  { path: '/schedule', name: 'schedule', component: ScheduleCalendar, meta: { layout: 'default', requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 가드: requiresAuth 처리 (public은 그냥 통과)
router.beforeEach((to) => {
  const auth = useAuthStore();
  const isLoggedIn = !!auth.accessToken;

  if (to.meta?.requiresAuth && !isLoggedIn) {
    return { name: 'signin', query: { redirect: to.fullPath } };
  }
  // public은 따로 처리할 거 없음
  return true;
});

export default router;
