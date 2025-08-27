<script setup>
const heroBg = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop';

const features = [
  {
    to: '/schedule',
    title: '일정 등록',
    desc: '일정을 손쉽게 등록하고 관리하세요. 반복 설정과 태그 지정도 가능합니다.',
    emoji: '🗓️',
  },
  {
    to: '/schedule',
    title: '시간표 보기',
    desc: '주간/월간 시간표로 일정을 한눈에 확인하고 계획을 세울 수 있습니다.',
    emoji: '📆',
  },
  {
    to: null,
    title: '이메일 인증',
    desc: '안전한 사용을 위해 회원가입 시 이메일 인증을 거칩니다.',
    emoji: '✉️',
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
  >
    <!-- Hero -->
    <section class="relative flex items-center justify-center px-6 py-24 overflow-hidden">
      <img :src="heroBg" alt="hero" class="absolute inset-0 h-full w-full object-cover" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-indigo-700/40 to-transparent dark:from-black/70 dark:via-black/50 dark:to-transparent"
      />
      <div class="pointer-events-none absolute inset-0 mix-blend-overlay opacity-10"></div>

      <!-- Transition은 자식이 1개여야 함 -->
      <Transition
        appear
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          class="relative z-10 w-full max-w-3xl rounded-3xl border border-white/20 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60"
        >
          <h1 class="mb-4 text-4xl font-extrabold tracking-tight text-indigo-900 sm:text-5xl dark:text-white">
            ⏰ TimePlanner
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-700 dark:text-slate-300">
            당신의 하루를 계획하세요. 일정 관리와 시간표 기능을 하나의 앱에서 제공합니다.
          </p>

          <div class="mt-8 flex items-center justify-center gap-3">
            <router-link
              to="/schedule"
              class="rounded-xl bg-indigo-600 px-5 py-3 text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              지금 시작하기
            </router-link>
            <a
              href="#features"
              class="rounded-xl bg-white/80 px-5 py-3 text-indigo-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              기능 살펴보기
            </a>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Features -->
    <section id="features" class="bg-white px-6 py-16 dark:bg-slate-950">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-center text-2xl font-bold text-slate-800 dark:text-slate-100">🔍 주요 기능 소개</h2>

        <!-- 리스트 애니메이션은 TransitionGroup 사용 -->
        <TransitionGroup
          appear
          tag="div"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <component
            v-for="(f, idx) in features"
            :key="idx"
            :is="f.to ? 'router-link' : 'div'"
            :to="f.to || undefined"
            class="group rounded-2xl border border-slate-200 bg-gradient-to-b from-indigo-50/70 to-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-900"
          >
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl dark:bg-indigo-900/60"
            >
              {{ f.emoji }}
            </div>
            <h3 class="mt-4 text-center text-lg font-semibold text-indigo-800 dark:text-indigo-300">
              {{ f.title }}
            </h3>
            <p class="mt-2 text-center text-slate-600 dark:text-slate-300">
              {{ f.desc }}
            </p>

            <div
              class="pointer-events-none mt-4 h-1 w-0 rounded bg-indigo-500 transition-all group-hover:w-full dark:bg-indigo-400"
            />
          </component>
        </TransitionGroup>
      </div>
    </section>

    <!-- CTA / Footer -->
    <section class="bg-gradient-to-b from-white to-indigo-50 dark:from-slate-950 dark:to-slate-950">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <div
          class="rounded-2xl border border-indigo-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <p class="text-slate-700 dark:text-slate-200">
            팀 일정 공유가 필요하신가요?
            <span class="font-semibold text-indigo-700 dark:text-indigo-300">공유 캘린더</span>로 빠르게 협업을
            시작하세요.
          </p>
          <div class="mt-6">
            <router-link
              to="/schedule"
              class="inline-block rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow hover:bg-indigo-500"
            >
              공유 캘린더 열기
            </router-link>
          </div>
        </div>
      </div>

      <footer class="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
        © 2025 TimePlanner. All rights reserved.
      </footer>
    </section>
  </div>
</template>
