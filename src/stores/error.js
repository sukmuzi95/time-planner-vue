import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
  state: () => ({
    message: '',
  }),
  actions: {
    set(msg) {
      this.message = msg;
    },
    clear() {
      this.message = '';
    },
  },
});
