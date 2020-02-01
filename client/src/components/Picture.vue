<template>
  <div class="lightbox" @click.self="closeLightbox">
    <div class="nav-img" @click.self="showPicture(picture.id, -1)"><</div>
    <img v-if="picture.filename" :src="pictureUrl(picture.filename)">
    <div class="nav-img" @click.self="showPicture(picture.id, 1)">></div>
    <div class="lightbox-info">
      <div class="lightbox-info-inner">
        <span class="lightbox-title" v-if="picture.title">{{ picture.title }}</span>
        <p v-if="picture.information" v-html="picture.information"></p>
      </div>
    </div>
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: grid;
    grid-template-columns: 5px 20fr 5px 10fr;
    grid-gap: 4rem;
    padding: 0px 4rem;
  }

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
  }
</style>
