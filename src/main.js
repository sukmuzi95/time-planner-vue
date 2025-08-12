import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { useAuthStore } from '@/stores/auth';

import App from './App.vue';
import router from './router';

// import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();
auth.initializeFromStorage();

app.mount('#app');
