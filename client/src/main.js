import Vue from 'vue';
import VeeValidate from 'vee-validate';
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
  data: {},
  render: h => h(App),
}).$mount('#app');
