<template>
  <div class="login fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0 flex justify-center">
    <div class="login-container w-full h-full max-w-2xl absolute">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="handleLogin" method="post">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Utilisateur
          </label>
          <input
            v-model="user.username"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="username"
            id="username"
            placeholder="Utilisateur"
          />
          <div
            v-if="errors.has('username')"
            class="text-red-500 text-xs italic"
            role="alert"
          >Veuillez saisir un utilisateur</div>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input
            v-model="user.password"
            type="password"
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            id="password"
            placeholder="******************"
          />
          <div
            v-if="errors.has('password')"
            class="text-red-500 text-xs italic"
            role="alert"
          >Veuillez saisir un mot de passe</div>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 align-baseline hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" :disabled="loading" type="submit">
            Se connecter
          </button>
        </div>
      </form>

      <Alerts :alerts="alerts" />
    </div>
  </div>
</template>


<script>
import User from '../models/user';
import Alerts from '@/components/Alerts.vue';

export default {
  name: 'Login',
  components: {
    Alerts,
  },
  data() {
    return {
      user: new User('', ''),
      loading: false,
      errors: new Map(),
      alerts: [],
    };
  },
  computed: {
    // Check if an user is logged in
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    // If any user is logged in, we redirect to the main page
    if (this.loggedIn) {
      this.$router.push('/gallery');
    }
  },
  methods: {
    // Log the user if he delivers the right credentials
    handleLogin() {
      this.loading = true;

      if (this.user.username && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
          () => {
            this.$router.push('/gallery');
          },
          (error) => {
            this.loading = false;
            this.alerts.push({
              message: (error.response && error.response.data.message)
              || error.message
              || error.toString(),
              hasError: true,
            });
          },
        );
      }
    },
    closeAlert() {
      this.output = '';
    },
  },
};
</script>
<style>
  .cross-svg{
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }

  .login-container{
    top: 130px;
  }
</style>
