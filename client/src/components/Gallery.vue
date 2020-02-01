<template>
  <div class="gallery">
    <div class="gallery-panel"
         v-for="picture in pictures"
         :key="picture.id">
      <router-link :to="`/picture/${picture.id}`">
        <img :src="thumbUrl(picture.filename)" :title="picture.title">
      </router-link>
    </div>
  </div>
</template>

<script>
// import pictures from '@/pictures.json';
import axios from 'axios';
// eslint-disable-next-line import/extensions
import bus from '../../bus.js';

export default {
  name: 'Gallery',
  data() {
    return {
      pictures: [],
      doneLoading: false,
    };
  },
  watch: {
    $route() {
      const self = this;
      self.fetchPictures();
    },
  },
  created() {
    this.fetchPictures();
    this.listenToEvents();
  },
  methods: {
    thumbUrl(filename) {
      return require(`../assets/thumbnails/${filename}`);
    },
    fetchPictures() {
      axios.get('/pictures.api').then((response) => {
        this.pictures = response.data;
      });
    },

    listenToEvents() {
      bus.$on('refreshPicture', () => {
        this.fetchPictures(); // update pictures
      });
    },
  },
};
</script>

<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-gap: 1rem;
    max-width: 80rem;
    margin: 5rem auto;
    padding: 0 5rem;
  }
  .gallery-panel img {
    width: 100%;
    object-fit: cover;
    border-radius: 0.75rem;
  }
</style>
