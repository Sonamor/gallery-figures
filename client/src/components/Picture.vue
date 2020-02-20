<template>
  <div class="lightbox fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0" @click.self="closeLightbox">
    <div class="lb-container w-full h-full flex lg:flex-row flex-col justify-center">
      <div class="overflow-hidden flex-1 flex-grow max-w-full max-h-full bg-gray-300 bg-contain bg-no-repeat lb-picture rounded-l" v-if="['edit', 'show'].includes(mode)" v-bind:style="{ backgroundImage: 'url(' + (picture ? pictureUrl(picture.filename) : '') + ')' }">
      </div>
      <div class="overflow-hidden flex-1 flex-grow max-w-full max-h-full bg-white bg-contain bg-no-repeat rounded-l relative" v-else-if="mode === 'add'">
        <FileUpload @uploadedFile="getUploadedFile"/>
      </div>
      <div class="lb-information bg-white flex-1 xl:max-w-md lg:max-w-xs w-full border border-solid border-gray-300 text-center p-4 overflow-auto rounded-r">
        <span class="lightbox-title font-bold text-4xl" v-if="mode === 'show' && picture && picture.title">{{ picture.title }}</span>
        <p class="mt-4" v-if="picture && picture.information && mode === 'show'" v-html="picture.information"></p>
        <form v-if="['edit', 'add'].includes(mode)" class="relative min-h-full" @submit.prevent="onSubmit">
          <input type="hidden" v-model="pic_filename">
          <input type="text" v-model="pic_title" class="w-full font-bold text-4xl border-0 border-b border-gray-300" placeholder="Saisir un titre">
          <textarea v-model="pic_information" class="w-full mt-5 border-0 border-b border-gray-300" placeholder="Saisir des informations"></textarea>
          <label for>Importance de l'image</label>
          <select v-model="pic_size">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute bottom-0 right-0">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
    <div class="lb-chevron-left" @click.self="showPicture(picture.id, -1)" v-if="mode === 'show'"></div>
    <div class="lb-chevron-right" @click.self="showPicture(picture.id, 1)" v-if="mode === 'show'"></div>
    <div class="lb-cross" @click.self="closeLightbox"></div>
  </div>
</template>

<script>
import axios from 'axios';
import FileUpload from './FileUpload.vue';

export default {
  name: 'Picture',
  components: {
    FileUpload,
  },
  data() {
    return {
      pictures: [],
      picture: {
        id: '', title: '', filename: '', information: '',
      },
      mode: 'add',
      pic_filename: '',
      pic_title: '',
      pic_information: '',
      pic_size: 'small',
    };
  },
  watch: {
    $route() {
      const self = this;
      self.fetchPictures();
    },
  },
  created() {
    this.setMode();
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
    setMode() {
      if (this.$route.params.id === 'add') {
        this.mode = 'add';
      } else if (this.$route.query.edit === null) {
        this.mode = 'edit';
      } else {
        this.mode = 'show';
      }
    },
    fetchPictures() {
      axios.get('http://localhost:3000/api/pictures').then((response) => {
        this.pictures = response.data;
        console.log(this.picture);
        this.picture = this.pictures.find(picture => picture.id === Number(this.$route.params.id));
        console.log(this.picture);
      });
    },
    getUploadedFile(value) {
      this.pic_filename = value;
    },
    async onSubmit() {
      try {
        await axios.post('http://localhost:3000/api/pictures', {
          title: this.pic_title, filename: this.pic_filename, information: this.pic_information, size: this.pic_size,
        }).then((response) => {
          console.log(response);
        });
        // this.message = 'Image sauvegardée';
      } catch (err) {
        /* this.message = err.response.data.error;
        this.hasError = true; */
      }
    },
  },
};
</script>

<style>
  .lightbox {
    background-color: rgba(0, 0, 0, 0.5);
  }

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

  textarea{
    min-height:150px;
  }
</style>
