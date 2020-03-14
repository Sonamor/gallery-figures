<template>
  <div class="lightbox fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0" @mousedown.self="closeLightbox">
    <div class="lb-container w-full h-full flex lg:flex-row flex-col justify-center">
      <div class="overflow-x-auto flex-1 flex-grow max-w-full max-h-full bg-white rounded relative text-center relative" v-if="(typeof this.picture === 'undefined')">
        <div class="absolute top30 w-full">
          <span class="w-full text-6xl text-blue-500 font-bold inline-block">404</span>
          <span class="w-full inline-block">Oups ! L'image recherchée est introuvable</span>
          <span class="w-full inline-block text-xs">Elle a surement été volée par un Blood Raven...</span>
        </div>
      </div>
      <div class="overflow-x-auto flex-1 flex-grow max-w-full max-h-full bg-white rounded-l relative" v-if="(typeof this.picture !== 'undefined')">
        <div class="bg-white" v-if="['edit', 'add'].includes(mode)">
          <FileUpload @uploadedFile="getUploadedFile"/>
        </div>
        <div class="overflow-hidden bg-gray-300 bg-contain bg-no-repeat lb-picture w-full" v-if="['edit', 'show'].includes(mode)" v-bind:style="{ height: (mode === 'edit' ? '82%' : '100%'), backgroundImage: 'url(' + (picture ? pictureUrl(picture.filename) : '') + ')' }">
          <div class="w-full font-bold m-1 text-gray-900 mx-2" v-if="mode === 'edit'">Image remplacée</div>
        </div>
      </div>
      <div v-bind:class="['lb-information flex-1 xl:max-w-md lg:max-w-xs w-full border border-solid border-gray-300 text-center p-4 overflow-auto rounded-r relative', (picture.active === false ? 'bg-red-300': 'bg-white')]" v-if="(typeof this.picture !== 'undefined')">
        <button class="py-1 px-2 text-xs absolute top-0 right-0 hover:text-blue-700" v-if="loggedIn && mode === 'show' && picture" @click="editPicture(picture.id)">
          Modifier
        </button>
        <span class="lightbox-title font-bold text-4xl" v-if="mode === 'show' && picture && picture.title">{{ picture.title }}</span>
        <p class="mt-4" v-if="picture && picture.information && mode === 'show'" v-html="picture.information"></p>
        <form v-if="['edit', 'add'].includes(mode)" class="relative min-h-full" @submit.prevent="onSubmit">
          <input type="hidden" v-model="pic_filename">
          <input type="text" v-model="pic_title" class="w-full font-bold text-4xl border-0 border-b border-gray-300" placeholder="Saisir un titre">
          <textarea v-model="pic_information" class="w-full mt-5 border-0 border-b border-gray-300" placeholder="Saisir des informations"></textarea>
          <div class="text-left text-gray-500">
            <label for="pic-size">Taille de la miniature</label>
            <select id="pic-size" v-model="pic_size" class="border-0 border-b border-gray-300 ml-8">
              <option value="small">Petite</option>
              <option value="medium">Moyenne</option>
              <option value="large">Grande</option>
            </select>
          </div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute bottom-0 right-0">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
    <div class="lb-chevron-left" @click.self="showPicture(picture.id, -1)" v-if="mode === 'show' && (typeof this.picture !== 'undefined')"></div>
    <div class="lb-chevron-right" @click.self="showPicture(picture.id, 1)" v-if="mode === 'show' && (typeof this.picture !== 'undefined')"></div>
    <div class="lb-cross" @click.self="closeLightbox"></div>
  </div>
</template>

<script>
import axios from 'axios';
import FileUpload from './FileUpload.vue';
import authHeader from '../services/auth-header';

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
    this.setMode();
    if (this.mode !== 'add') { this.fetchPictures(); }
  },
  methods: {
    // Display pictures from the upload directory
    pictureUrl(filename) {
      if (filename) {
        try {
          const images = require.context('../../../server/uploads/', false, /\.jpg|.png|.jpeg$/);
          return images(`./${filename}`);
        } catch (e) {
          if (e.name !== 'ModuleNotFoundError') throw e; // handle false-positives
          return require('../assets/logo.png');
        }
      }
      return require('../assets/logo.png');
    },

    // Navigate to the gallery
    closeLightbox() {
      this.$router.push('/gallery');
    },

    // Navigate to the same layout but in edit mode
    editPicture(currentPicId) {
      this.mode = 'edit';
      this.$router.push(`/picture/${currentPicId}#edit`);
    },

    // Navigate to next or previous picture
    showPicture(currentPicId, increment) {
      currentPicId = Number(currentPicId);

      const maxPicId = this.pictures[this.pictures.length - 1].id;
      const minPicId = this.pictures[0].id;

      let nextPicId = 0;

      // If a picture is missing (eg : has been deleted completely in db) or is disabled and user is not logged in, skip to the n+1/-1 next picture
      if (currentPicId < minPicId) {
        nextPicId = maxPicId;
      } else if (currentPicId > maxPicId) {
        nextPicId = minPicId;
      } else {
        const nextPic = this.pictures.find(picture => picture.id === Number(currentPicId + increment));

        if (typeof nextPic === 'undefined' || (typeof nextPic !== 'undefined' && !this.loggedIn && nextPic.active === false)) {
          this.showPicture(currentPicId + increment, increment);
          return;
        }
        nextPicId = nextPic.id;
      }

      this.$router.push(`/picture/${nextPicId}`);
    },

    // Set the mode of the layout
    setMode() {
      if (this.$route.params.id === 'add') {
        this.mode = 'add';
      } else if (this.$route.hash === '#edit') {
        this.mode = 'edit';
      } else {
        this.mode = 'show';
      }
    },

    // Fetch pictures from the database
    fetchPictures() {
      const options = (!this.loggedIn) ? { active: true } : {};
      axios.get('http://localhost:3000/api/pictures', {
        params: options,
      }).then((response) => {
        this.pictures = response.data;

        this.picture = this.pictures.find(picture => (this.loggedIn && picture.id === Number(this.$route.params.id))
          || (!this.loggedIn && picture.active === true && picture.id === Number(this.$route.params.id)));

        if (typeof this.picture !== 'undefined') {
          this.pic_filename = this.picture.filename;
          this.pic_title = this.picture.title;
          this.pic_information = this.picture.information;
          this.pic_size = this.picture.size;
        } else if (this.mode !== 'add') {
          // Display 404
        } else if (typeof this.picture !== 'undefined' && !this.loggedIn && this.picture.active === false) {
          this.showPicture(this.picture.id + 1, 1);
        }
      });
    },

    // display the uploaded file
    getUploadedFile(value) {
      this.pic_filename = value;
    },

    // Add or edit a picture
    async onSubmit() {
      try {
        await axios.post('http://localhost:3000/api/pictures', {
          id: (this.mode === 'edit' ? this.picture.id : null), title: this.pic_title, filename: this.pic_filename, information: this.pic_information, size: this.pic_size, mode: this.mode,
        }, { headers: authHeader() }).then((response) => {
          if (response.data.success) {
            this.$router.push('/gallery');
          }
        });
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

  .top30{
    top:30%;
  }
</style>
