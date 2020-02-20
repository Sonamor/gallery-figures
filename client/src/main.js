import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import '@/assets/css/tailwind.css';

Vue.config.productionTip = false;

const isLoggedMixin = {
  methods: {
    checkIfLogged() {
      return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/api/sessionStatus')
          .then((response) => {
            resolve(response.data.user);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
  },
};

new Vue({
  router,
  store,
  i18n,
  mixins: [isLoggedMixin],
  data: {
    user: {},
  },
  created() {
    this.checkIfLogged()
      .then((response) => {
        Vue.set(this.user, 'username', response.username);
        Vue.set(this.user, 'password', response.password);
      })
      .catch(error => console.log(error));
  },
  render: h => h(App),
}).$mount('#app');
