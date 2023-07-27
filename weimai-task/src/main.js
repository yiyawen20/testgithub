import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import global from "./common/global.js";

const app = createApp(App);

app.use(router).mount('#app')
app.config.globalProperties.$http = axios;
app.config.globalProperties.$global = global;