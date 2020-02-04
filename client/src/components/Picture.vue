<template>
  <div class="lightbox fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0" @click.self="closeLightbox">
    <div class="lb-container w-full h-full flex lg:flex-row flex-col justify-center">
      <div class="overflow-hidden flex-1 flex-grow max-w-full max-h-full bg-gray-300 bg-contain bg-no-repeat lb-picture rounded-l" v-bind:style="{ backgroundImage: 'url(' + pictureUrl(picture.filename) + ')' }">
      </div>
      <div class="lb-information bg-white flex-1 xl:max-w-md lg:max-w-xs w-full border border-solid border-gray-300 text-center p-4 px-8 overflow-auto rounded-r">
        <span class="lightbox-title font-bold text-4xl" v-if="picture.title">{{ picture.title }}</span>
        <p class="mt-4" v-if="picture.information" v-html="picture.information"></p>
      </div>
    </div>
    <div class="lb-chevron-left" @click.self="showPicture(picture.id, -1)"></div>
    <div class="lb-chevron-right" @click.self="showPicture(picture.id, 1)"></div>
    <div class="lb-cross" @click.self="closeLightbox"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Picture',
  data() {
    return {
      pictures: [],
      picture: {
        id: '', title: '', filename: '', information: '',
      },
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
  },
  methods: {
    pictureUrl(filename) {
      const images = require.context('../assets/', false, /\.jpg$/);
      return images(`./${filename}`);
    },
    closeLightbox() {
      this.$router.push('/Figure');
    },
    showPicture(currentPicId, increment) {
      let nextPicId = 0;

      if ((currentPicId + increment) < 0) {
        nextPicId = this.pictures.length - 1;
      } else if ((currentPicId + increment) >= this.pictures.length) {
        nextPicId = 0;
      } else {
        nextPicId = currentPicId + increment;
      }

      this.$router.push(`/picture/${nextPicId}`);
    },
    fetchPictures() {
      axios.get('/pictures.api').then((response) => {
        this.pictures = response.data;
        this.picture = this.pictures.find(picture => picture.id === Number(this.$route.params.id));
      });
    },
  },
};
</script>

<style>
  .lightbox {
    background-color: rgba(0, 0, 0, 0.5);
  }
/*
  .lightbox img {
    margin: auto;
    width: 100%;
    grid-column-start: 2;
  }
  .lightbox-info {
    margin: auto 2rem auto 0;
  }
  .lightbox-info-inner {
    background-color: #FFFFFF;
    display: inline-block;
    padding: 2rem;
    overflow: auto;
    height: 100vh;
  }
  .nav-img{
    color:#fff;
    cursor: pointer;
    font-weight:bold;
    margin: auto 2rem auto 0;
  }
  .lightbox p{
    margin-top:10px;
  }
  .lightbox-title{
    font-size:30px;
    font-weight:bold;
    margin:15px;
  }*/
  .lb-picture{
    background-position: 50% 50%;
  }

  .lb-chevron-left{
    position:fixed;
    top: 50%;
    left:15px;
    height:32px;
    width:32px;
    background: url('../assets/icons/chevron-left.png');
    cursor:pointer;
  }

  .lb-chevron-right{
    position:fixed;
    top: 50%;
    right:15px;
    height:32px;
    width:32px;
    background: url('../assets/icons/chevron-right.png');
    cursor:pointer;
  }

  .lb-cross{
    position:fixed;
    top:15px;
    right:15px;
    height:32px;
    width:32px;
    background: url('../assets/icons/cross.png');
    cursor:pointer;
  }
</style>
