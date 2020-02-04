import Vue from 'vue';
import Router from 'vue-router';
import Picture from './views/Picture.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Figure.vue'),
    },
    {
      path: '/figure',
      name: 'figure',
      component: () => import('./views/Figure.vue'),
    },
    {
      path: '/picture/:id',
      name: 'picture',
      component: Picture,
    },
  ],
});
