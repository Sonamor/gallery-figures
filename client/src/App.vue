<template>
  <div id="app">
    <nav class="text-right pr-2 text-white text-sm">
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
  methods: {
    // To log out from the app
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
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
  }
  a {
    color: #0094FF;
    text-decoration: none;
  }
  a:hover { color: #0074C6; }
</style>
