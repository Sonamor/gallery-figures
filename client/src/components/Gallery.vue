<template>
  <div class="gallery">
    <div
         v-bind:class="['gallery__item', picture.size, 'rounded overflow-hidden shadow-lg']"
         v-for="picture in pictures"
         :key="picture.id">
      <router-link :to="`/picture/${picture.id}`">
        <div class="flex flex-col h-full">
          <img :src="thumbUrl(picture.filename)" class="gallery__img w-full" :title="picture.title" :alt="picture.title">
          <div class="px-4 py-2">
            <div class="font-bold text-base mb-1">{{ picture.title }}</div>
            <p class="text-gray-700 text-xs truncate">
              {{ picture.information }}
            </p>
          </div>
        </div>
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
    gridElementClass(pictureSize) {
      let pictureSizeClass = '';
      switch (pictureSize) {
        case 'small':
          pictureSizeClass = 'w-1/6';
          break;
        case 'medium':
          pictureSizeClass = 'w-1/3';
          break;
        case 'large':
          pictureSizeClass = 'w-full';
          break;
        default:
          break;
      }
      pictureSizeClass = '';
      return pictureSizeClass;
    },
    gridElementClassBis(pictureId) {
      return `gallery__item--${pictureId + 1}`;
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 20px;
  grid-auto-flow: dense;
  margin: 1em auto;
  padding: 0;
  max-width: 80%;
}
.gallery__item img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.gallery__item.medium {
  grid-column-end: span 2;
  grid-row-end: span 2;
}
.gallery__item.large {
  grid-column-end: span 3;
  grid-row-end: span 3;
}

</style>
