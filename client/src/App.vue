<template>
  <div id="app">
    <nav id="nav" class="text-right pr-2 text-white text-sm">
      <div>
        <li v-if="showAdminBoard">
          <router-link to="/admin">Admin Board</router-link>
        </li>
        <li v-if="showModeratorBoard">
          <router-link to="/mod">Moderator Board</router-link>
        </li>
        <li v-if="currentUser">
          <router-link to="/user">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser">
        <li>
          <router-link to="/login" class="text-xs hover:text-blue-700 ml-4 cursor-pointer">
            Connexion
          </router-link>
        </li>
      </div>

      <div v-if="currentUser">
        <li>
          <router-link to="/profile" class="text-xs">
            Bienvenue {{ currentUser.username }}
          </router-link>
        </li>
        <li>
          <a class="text-xs hover:text-blue-700 ml-4 cursor-pointer" href @click.prevent="logOut">
            Déconnexion
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      user: this.$root.user,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>
