<script setup>
import { ref, watch, computed } from 'vue';
import api from '../../api/axios';

// Props/Emits
const props = defineProps({
  defaultValues: {
    type: Object,
    required: true, // { id, title, start, end, color, ownerId, ownerName }
  },
  onDelete: {
    type: Function,
    default: null, // 부모에서 삭제 핸들러 넘겨준 경우만 노출
  },
});
const emit = defineEmits(['submit', 'cancel']);

// 유틸: datetime-local용 포맷 (YYYY-MM-DDTHH:mm)
const toLocalInput = (v) => {
  if (!v) return '';
  // '2025-06-20T12:00:00Z' 같은 값이 와도 앞 16자리만
  const s = String(v);
  if (s.length >= 16) return s.slice(0, 16);
  return s;
};

// 로컬 폼 상태
const form = ref({
  id: 0,
  title: '',
  start: '',
  end: '',
  color: '#6366F1',
  ownerId: 0,
  ownerName: '',
});

// 오류 메시지
const errors = ref({ title: '', time: '' });

// props.defaultValues 변경 시 폼 동기화
watch(
  () => props.defaultValues,
  (v) => {
    form.value = {
      id: v?.id ?? 0,
      title: v?.title ?? '',
      start: toLocalInput(v?.start),
      end: toLocalInput(v?.end),
      color: v?.color ?? '#6366F1',
      ownerId: v?.ownerId ?? 0,
      ownerName: v?.ownerName ?? '',
    };
    errors.value = { title: '', time: '' };
  },
  { immediate: true, deep: true }
);

// 간단 검증
const isValid = () => {
  let ok = true;
  errors.value = { title: '', time: '' };

  if (!form.value.title.trim()) {
    errors.value.title = '제목을 입력하세요.';
    ok = false;
  }
  if (form.value.start && form.value.end) {
    const s = new Date(form.value.start);
    const e = new Date(form.value.end);
    if (!(s < e)) {
      errors.value.time = '시작 시간은 종료 시간보다 앞서야 합니다.';
      ok = false;
    }
  } else {
    errors.value.time = '시작/종료 시간을 모두 입력하세요.';
    ok = false;
  }
  return ok;
};

// 저장(등록/수정)
const saving = ref(false);
const handleSave = async () => {
  if (!isValid()) return;
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      start: form.value.start, // 서버가 ISO 문자열 처리한다고 가정
      end: form.value.end,
      color: form.value.color,
      ownerId: form.value.ownerId,
      ownerName: form.value.ownerName,
    };

    if (form.value.id && form.value.id !== 0) {
      await api.put(`/schedules/shared/${form.value.id}`, payload);
    } else {
      await api.post('/schedules/shared', payload);
    }
    emit('submit'); // 부모에서 모달 닫고 목록 새로고침
  } catch (e) {
    // 필요시 토스트/알럿 처리
    console.error(e);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    saving.value = false;
  }
};

// 삭제
const deleting = ref(false);
const handleDeleteClick = async () => {
  if (!props.onDelete) return;
  if (!form.value.id || form.value.id === 0) return;
  if (!confirm('이 일정을 삭제할까요?')) return;
  deleting.value = true;
  try {
    await props.onDelete(); // 부모에서 실제 삭제 + refetch 수행
  } finally {
    deleting.value = false;
  }
};

const isEdit = computed(() => !!form.value.id && form.value.id !== 0);
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">
      {{ isEdit ? '일정 수정' : '일정 등록' }}
    </h2>

    <div class="space-y-4">
      <!-- 제목 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          v-model="form.title"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
          placeholder="제목을 입력하세요"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
      </div>

      <!-- 소유자 이름(선택) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">소유자 이름(선택)</label>
        <input
          type="text"
          v-model="form.ownerName"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
          placeholder="예: 무지꿍"
        />
      </div>

      <!-- 시작/종료 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">시작</label>
          <input
            type="datetime-local"
            v-model="form.start"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">종료</label>
          <input
            type="datetime-local"
            v-model="form.end"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
          />
        </div>
      </div>
      <p v-if="errors.time" class="text-sm text-red-600">{{ errors.time }}</p>

      <!-- 색상(선택) -->
      <!-- <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">색상(선택)</label>
        <input type="color" v-model="form.color" class="h-10 w-16 p-0 border rounded" />
      </div> -->
    </div>

    <!-- 액션 -->
    <div class="mt-6 flex items-center justify-end gap-2">
      <button type="button" class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" @click="$emit('cancel')">
        취소
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        :disabled="saving"
        @click="handleSave"
      >
        {{ saving ? '저장 중...' : isEdit ? '수정하기' : '등록하기' }}
      </button>

      <button
        v-if="isEdit && onDelete"
        type="button"
        class="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        :disabled="deleting"
        @click="handleDeleteClick"
      >
        {{ deleting ? '삭제 중...' : '삭제' }}
      </button>
    </div>
  </div>
</template>
