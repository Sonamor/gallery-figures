<template>
  <div id="app">
    <div id="nav" class="text-right pr-2 text-white text-sm">
      <span class="text-xs" v-show="user != false">Bienvenue {{ user.username }}</span>
      <router-link to="/login" class="text-xs hover:text-blue-700 ml-4 cursor-pointer" v-show="user == false">Connexion</router-link>
      <a @click="logOut" class="text-xs hover:text-blue-700 ml-4 cursor-pointer" v-show="user != false">Déconnexion</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      user: this.$root.user,
    };
  },
  methods: {
    logOut() {
      axios.get('http://localhost:3000/api/logout', { withCredentials: true }).then(() => {
        this.$router.push('/');
      });
    },
  },
};
</script>
