<template>
  <div class="login fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0 flex justify-center">
    <div class="login-container w-full h-full max-w-2xl absolute">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" id="login" @submit="logIn"
        method="post">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Utilisateur
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Utilisateur" v-model="username">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" v-model="password">
          <p class="text-red-500 text-xs italic">Veuillez saisir un mot de passe</p>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 align-baseline hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Se connecter
          </button>
        </div>
      </form>
      <div v-if="output" v-bind:class="['px-4', 'py-3', 'rounded', 'relative', 'border', 'text-xs', `bg-${alertColor}-100`, `border-${alertColor}-400`, `text-${alertColor}-700`]" role="alert">
        <strong class="font-bold">Connexion impossible</strong>
        <span class="block">{{output}}</span>
        <span class="absolute top-0 bottom-0 right-0">
          <svg class="fill-current h-6 w-6 cross-svg" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" @click.self="closeAlert"/></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      output: '',
      alertColor: '',
    };
  },
  methods: {
    logIn(e) {
      e.preventDefault();
      const currentObj = this;
      axios.post('http://localhost:3000/api/login', {
        username: this.username, password: this.password, withCredentials: true,
      })
        .then((response) => {
          if (response.data.success) {
            this.$router.push('/Figure');
            currentObj.alertColor = 'green';
            /*
            if (response.status === 200 && 'token' in response.body) {
              this.$session.start();
              this.$session.set('jwt', response.body.token);
              Vue.http.headers.common.Authorization = `Bearer ${response.body.token}`;
              this.$router.push('/Figure');
            } */
          } else {
            currentObj.output = response.data.message;
            currentObj.alertColor = 'red';
          }
        })
        .catch((error) => {
          currentObj.output = error;
          currentObj.alertColor = 'red';
        });
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
</style>
