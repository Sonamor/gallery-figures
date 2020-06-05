<template>
  <div id="app">
    <div class="mb-24 container">
      <router-link to="/">
        <div class="main_logo"></div>
      </router-link>
    </div>
    <div class="px-4 mt-4 absolute top-0 left-0 w-screen z-50" ref="container"></div>
    <nav class="text-right absolute pr-2 text-white text-sm navigation">
      <div v-if="!currentUser">
        <router-link to="/login" class="text-xs hover:text-blue-700 ml-4 cursor-pointer">
          Connexion
        </router-link>
      </div>
      <div v-if="currentUser">
        Bienvenue {{ currentUser.username }}
        <a class="text-xs hover:text-blue-700 ml-4 cursor-pointer" href @click.prevent="logOut">
          Déconnexion
        </a>
      </div>
    </nav>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import Alerts from '@/components/Alerts.vue';

const ComponentAlerts = Vue.extend(Alerts);

export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    // Get current logged user
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  watch: {

  },
  mounted() {
    this.initAlerts([]);
  },
  methods: {
    // To log out from the app
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
    },

    initAlerts(newAlerts) {
      const instance = new ComponentAlerts({
        propsData: { alerts: newAlerts },
      });
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);
    },
  },
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  html { font-size: 22px; }
  body {
    font-family: 'Roboto', sans-serif;
    background: #2d3748;
    background-image: url('assets/bg.jpg');
    background-size: cover;
  }
  a {
    color: #0094FF;
    text-decoration: none;
  }
  a:hover { color: #0074C6; }

  .main_logo{
    position: absolute;
    height:62px;
    width:100vw;
    background: url('./assets/logo.png');
    background-size:cover;
    cursor:pointer;
  }

  .main_logo{
    left:0px;
    top: 10px;
  }

  @media screen and (max-width: 320px) {
    .main_logo{
      height: 35px;
    }
  }

  @media screen and (min-width: 321px) and (max-width: 375px) {
    .main_logo{
      height: 41px;
    }
  }

  @media screen and (min-width: 376px) and (max-width: 425px) {
    .main_logo{
      height: 46px;
    }
  }

  @media screen and (min-width: 640px) {
    .main_logo{
      max-width: 565px;
      left:20px;
      top: 35px;
    }
  }

  @media screen and (max-width: 640px) {

    .navigation{
      right:0px !important;
      top: 50px !important;
    }

    .container {
      margin-bottom: 90px !important;
    }
  }

  .navigation{
    right:25px;
    top: 5px;
  }

</style>
