<template>
  <div>
    <div class="w-full text-center py-32 text-indigo-300">
      <p class="text-6xl font-bold">404</p>
      <p class="text-xl">Oups, cette page n'existe pas !</p>
      <router-link class="underline text-blue-500" to="/">Retourner à l'accueil</router-link>
    </div>
  </div>
</template>
<script>

export default {
  name: 'page_not_found',
};
</script>
