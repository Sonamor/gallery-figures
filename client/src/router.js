import Vue from 'vue';
import Router from 'vue-router';
import Picture from './views/Picture.vue';
import Figure from './views/Figure.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Figure,
    },
    {
      path: '/figure',
      name: 'figure',
      component: Figure,
    },
    {
      path: '/picture/:id',
      name: 'picturea',
      component: Picture,
    },
    {
      path: '/picture/add',
      name: 'picture_add',
      component: Picture,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
  ],
});
