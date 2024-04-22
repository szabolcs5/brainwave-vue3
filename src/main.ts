import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import 'vue-rate/dist/vue-rate.css';
import rate from 'vue-rate';
import 'v3-infinite-loading/lib/style.css';
import V3InfiniteLoading from 'v3-infinite-loading';
import ToastService from 'primevue/toastservice';

import { createPinia } from 'pinia';

const pinia = createPinia();

const app = createApp(App);

app.component('InfiniteLoading', V3InfiniteLoading.default);
app.use(router).use(PrimeVue).use(pinia).use(rate).use(ToastService).mount('#app');
