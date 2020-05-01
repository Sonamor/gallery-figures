import Vue from 'vue';
import VeeValidate from 'vee-validate';

import ElementUI from 'element-ui';
import { ElementTiptapPlugin } from 'element-tiptap';
// import ElementUI's styles
import 'element-ui/lib/theme-chalk/index.css';
// import this package's styles
import 'element-tiptap/lib/index.css';
// Now you register `'el-tiptap'` component globally.

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import '@/assets/css/tailwind.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  VeeValidate,
  ElementUI,
  ElementTiptapPlugin,
  data: {},
  render: h => h(App),
}).$mount('#app');
