import Vue from 'vue';
import Router from 'vue-router';
import Picture from './views/Picture.vue';
import Gallery from './views/Gallery.vue';
import Login from './views/Login.vue';
import PageNotFound from './views/PageNotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      // Homepage
      path: '/',
      name: 'home',
      component: Gallery,
    },
    {
      // Homepage
      path: '/home',
      component: Gallery,
    },
    {
      // Gallery
      path: '/gallery',
      name: 'gallery',
      component: Gallery,
    },
    {
      // Selected picture
      path: '/picture/:id',
      name: 'picture',
      component: Picture,
    },
    {
      // Adding picture page
      path: '/picture/add',
      name: 'picture_add',
      component: Picture,
    },
    {
      // Login page
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '*',
      name: 'page_not_found',
      component: PageNotFound,
    },
  ],
});

// Before routing, check if the page requires a login
router.beforeEach((to, from, next) => {
  const privatePages = ['/picture/add'];
  const authRequired = (privatePages.includes(to.path) || to.hash === '#edit');
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page and check if logged in
  // if false redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
