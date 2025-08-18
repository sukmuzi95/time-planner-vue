<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import api from '../../api/axios';
import ScheduleForm from '../../components/schedule/ScheduleForm.vue';

// React의 ScheduleData와 동일한 형태를 사용
// { id, title, start, end, color, ownerId, ownerName }

const schedules = ref([]); // 원본 데이터
const showForm = ref(false);
const selected = ref(null); // 현재 선택된 일정(등록/수정용)

// 사용자별 색상 고정
const getColorForUser = (userId) => {
  const colors = [
    '#6366F1', // indigo
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
  ];
  return colors[userId % colors.length];
};

// FullCalendar에서 사용할 events로 변환
const calendarEvents = computed(() =>
  schedules.value.map((s) => ({
    id: String(s.id),
    title: `${s.title} (${s.ownerName})`,
    start: s.start, // ISO 문자열 허용
    end: s.end,
    allDay: false,
    backgroundColor: getColorForUser(s.ownerId),
    borderColor: getColorForUser(s.ownerId),
    textColor: '#ffffff',
    extendedProps: {
      ownerId: s.ownerId,
      raw: s, // 원본 접근 필요하면 사용
    },
  }))
);

const fetchSchedules = async () => {
  const res = await api.get('/schedules/shared');
  schedules.value = res.data || [];
};

const handleSubmit = async () => {
  showForm.value = false;
  await fetchSchedules();
};

const handleDelete = async () => {
  if (selected.value?.id) {
    await api.delete(`/schedules/shared/${selected.value.id}`);
    showForm.value = false;
    await fetchSchedules();
  }
};

// 빈 영역 드래그/클릭 선택하여 새 일정 기본값 생성
const onSelect = (selectInfo) => {
  // selectInfo: { start, end, allDay, ... }
  const start = selectInfo.startStr; // ISO 문자열
  const end = selectInfo.endStr;

  selected.value = {
    id: 0,
    title: '',
    start, // 'YYYY-MM-DDTHH:mm' 형태면 그대로 사용 가능
    end,
    color: '#6366F1',
    ownerId: 0,
    ownerName: '',
  };
  showForm.value = true;
};

// 이벤트 클릭 → 수정 모달 오픈
const onEventClick = (clickInfo) => {
  const id = Number(clickInfo.event.id);
  const found = schedules.value.find((s) => s.id === id);
  if (found) {
    selected.value = { ...found };
    showForm.value = true;
  }
};

// FullCalendar 옵션
const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  },
  initialView: 'dayGridMonth',
  selectable: true,
  selectMirror: true,
  // 한국어 등 로케일이 필요하면 locale 옵션 추가 가능 (패키지 별도 설치)
  // locale: 'ko',
  events: calendarEvents,
  select: onSelect,
  eventClick: onEventClick,
  // 클릭 후 선택 영역 자동 해제
  unselectAuto: true,
  height: 700,
});

onMounted(() => {
  fetchSchedules();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📅 공유 캘린더</h1>

    <FullCalendar :options="calendarOptions" />

    <div
      v-if="showForm && selected"
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <!-- ScheduleForm.vue는 Vue 버전으로 준비되어 있다고 가정 -->
        <ScheduleForm
          :defaultValues="selected"
          @submit="handleSubmit"
          @cancel="() => (showForm = false)"
          :onDelete="selected.id !== 0 ? handleDelete : undefined"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 필요시 커스텀 스타일 */
</style>
