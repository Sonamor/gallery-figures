<template>
  <div>
    <div class="w-full text-center text-blue-300" v-show="pictures.length <= 0 && loggedIn == false">
      <p class="text-3xl font-bold">Aucune image pour le moment, revenez plus tard !</p>
    </div>
    <div class="gallery">
      <div class="rounded overflow-hidden shadow-lg" v-show="loggedIn != false">
        <router-link to="/picture/add" @click.self="addPicture">
          <div class="bg-white p-12 md:p-16 hover:bg-gray-400">
            <img src="../assets/icons/xl-plus.png" title="Ajouter une image" alt="Ajouter une image">
          </div>
        </router-link>
      </div>
      <div
            v-bind:class="['gallery__item', picture.size, 'rounded overflow-hidden shadow-lg']"
            v-for="picture in pictures"
            :key="picture.id"
            v-show="(loggedIn) || (picture.active && !loggedIn)"
            @mouseover="picture.hover = true"
            @mouseleave="picture.hover = false">
        <a class="cursor-pointer" @click.stop="showPicture(picture.id)">
          <div class="flex flex-col h-full bg-white relative">
            <div class="gallery__actions"
              v-show="loggedIn != false && picture.hover === true" >
              <img class="action__edit" src="../assets/icons/edit.png" @click.stop="editPicture(picture.id)">
              <img class="action__hide" src="../assets/icons/hide.png" @click.stop="hidePicture(picture.id, picture)">
              <img class="action__cross" src="../assets/icons/cross.png" @click.stop="deletePicture(picture.id)">
            </div>
            <img :src="thumbUrl(picture.filename)" class="gallery__img w-full" :title="picture.title" :alt="picture.title" @error="imageLoadError">
            <div v-bind:class="['px-4 py-2', (picture.active === false ? 'bg-red-300': 'bg-white')]">
              <div class="font-bold text-base mb-1">{{ picture.title }}</div>
              <p class="text-gray-700 text-xs truncate">
                {{ picture.subtitle }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import bus from '../../bus';
import authHeader from '../services/authHeader';

export default {
  name: 'Gallery',
  data() {
    return {
      pictures: [],
      doneLoading: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
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
    // Get full path of picture
    thumbUrl(filename) {
      return `${process.env.VUE_APP_S3_EXTERNAL_BASE_URL}/pictures/thumbnails/${filename}`;
    },

    // If the image link is broken, show placeholder
    imageLoadError(event) {
      event.target.src = require('../assets/icons/img-404.png');
    },

    // Fetch all the pictures from the db to display them
    fetchPictures() {
      axios.get(`${process.env.VUE_APP_API_ENTRY_URL}/pictures`).then((response) => {
        this.pictures = response.data;
        this.pictures.forEach((picture) => {
          this.$set(picture, 'hover', 'false');
          picture.hover = 'false';
        });
      });
    },

    // Update the pictures in the grid after receiving an event refreshPicture
    listenToEvents() {
      bus.$on('refreshPicture', () => {
        this.fetchPictures();
      });
    },

    // Navigate to the picture clicked
    showPicture(pictureId) {
      this.$router.push(`/picture/${pictureId}`);
    },

    // Navigate to the picture clicked in edit mode
    editPicture(pictureId) {
      this.$router.push(`/picture/${pictureId}#edit`);
    },

    // Disable a picture
    async hidePicture(pictureId, picture) {
      picture.active = !picture.active;
      try {
        await axios.put(`${process.env.VUE_APP_API_ENTRY_URL}/picture/${pictureId}`, picture, { headers: authHeader() }).then((response) => {
          if (response.status === 200) {
            this.alerts.push({ message: response.message, hasError: false });
          } else {
            this.alerts.push({ message: response.message, hasError: true });
          }
        });
      } catch (err) {
        this.alerts.push({ message: err.response.data.message, hasError: true });
      }
    },

    // Delete picture after confirmation
    async deletePicture(pictureId) {
      if (confirm('Etes-vous sûr de vouloir supprimer cette image ?')) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_ENTRY_URL}/picture/${pictureId}`, { headers: authHeader() }).then((response) => {
            if (response.status === 200) {
              this.pictures = this.pictures.filter(obj => obj.id !== pictureId);
              this.alerts.push({ message: response.message, hasError: false });
            } else {
              this.alerts.push({ message: response.message, hasError: true });
            }
          });
        } catch (err) {
          this.alerts.push({ message: err.response.data.message, hasError: true });
        }
      }
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

@media (max-width: 600px){
  .gallery{
    display: block;
  }
}

@media (max-width: 600px){
  .gallery__item{
    margin-top:1em;
  }
}

.gallery__img {
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

.gallery__actions{
  position:absolute;
  background:white;
  top:0px;
  right:0px;
  padding:5px 5px;
  border-bottom-left-radius: 0.25rem;
  border:1px solid #b3b3b3;
  border-top:0px;
  border-right:0px;
}

.action__edit, .action__hide, .action__cross{
  width:16px;
  height:16px;
  margin-top:10px;
  margin-bottom:10px;
  cursor:pointer;
}
.action__edit:hover, .action__hide:hover, .action__cross:hover{
  background: rgba(0, 119, 255, 0.2);
}
</style>
