<template>
  <div class="lightbox fixed w-screen h-screen xl:p-16 xl:px-48 lg:p-10 lg:px-24 md:p-6 md:px-20 p-4 px-16 top-0 left-0" @mousedown.self="closeLightbox">
    <Alerts :alerts="alerts"/>
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
          <FileUpload @uploadedFile="getUploadedFile" ref="fileUpload"/>
        </div>
        <div class="overflow-hidden bg-gray-300 bg-contain bg-no-repeat lb-picture w-full" v-if="['edit', 'show'].includes(mode)" v-bind:style="{ height: (mode === 'edit' ? '82%' : '100%'), backgroundImage: 'url(' + (picture ? pictureUrl(picture.filename) : '') + ')' }">
          <div class="w-full font-bold m-1 text-gray-900 mx-2" v-if="mode === 'edit'">Image remplacée</div>
        </div>
      </div>
      <div v-bind:class="['lb-information flex-1 xl:max-w-md lg:max-w-xs w-full border border-solid border-gray-300 md:p-4 p-1 pt-4 overflow-auto rounded-r relative', (picture.active === false ? 'bg-red-300': 'bg-white')]" v-if="(typeof this.picture !== 'undefined')">
        <button class="py-1 px-2 text-xs absolute top-0 right-0 hover:text-blue-700" v-if="loggedIn && mode === 'show' && picture" @click="editPicture(picture.id)">
          Modifier
        </button>
        <span class="lightbox-title block w-full text-center font-bold md:text-4xl sm:text-2xl" v-if="mode === 'show' && picture && picture.title">{{ picture.title }}</span>
        <p id="pic_information" class="mt-4" v-if="picture && picture.information && mode === 'show'" v-html="picture.information"></p>
        <form v-if="['edit', 'add'].includes(mode)" class="relative min-h-full" @submit.prevent="onSubmit" ref="pictureForm">
          <input type="hidden" v-model="pic_filename">
          <input type="text" v-model="pic_title" class="w-full font-bold text-4xl border-0 border-b border-gray-300" placeholder="Saisir un titre">
          <TextEditor v-model="pic_information" />
          <div class="text-left text-gray-500">
            <label for="pic-size">Taille de la miniature</label>
            <select id="pic-size" v-model="pic_size" class="border-0 border-b border-gray-300 ml-8">
              <option value="small">Petite</option>
              <option value="medium">Moyenne</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </form>
        <button v-if="['edit', 'add'].includes(mode)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute bottom-0 right-0 m-2" @click="initSubmit">
          Enregistrer
        </button>
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
import authHeader from '../services/authHeader';
import Alerts from '@/components/Alerts.vue';
import TextEditor from '@/components/TextEditor.vue';
import bus from '../../bus';

export default {
  name: 'Picture',
  components: {
    FileUpload, Alerts, TextEditor,
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
      alerts: [],
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
          return `${process.env.VUE_APP_S3_EXTERNAL_BASE_URL}/pictures/${filename}`;
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
    editPicture(currentPictureId) {
      this.mode = 'edit';
      this.$router.push(`/picture/${currentPictureId}#edit`);
    },

    // Navigate to next or previous picture
    showPicture(currentPictureId, increment) {
      currentPictureId = Number(currentPictureId);

      const maxPictureId = this.pictures[this.pictures.length - 1].id;
      const minPictureId = this.pictures[0].id;

      let nextPictureId = 0;

      // If a picture is missing (eg : has been deleted completely in db) or is disabled and user is not logged in, skip to the n+1/-1 next picture
      if (currentPictureId < minPictureId) {
        nextPictureId = maxPictureId;
      } else if (currentPictureId > maxPictureId) {
        nextPictureId = minPictureId;
      } else {
        const nextPic = this.pictures.find(picture => picture.id === Number(currentPictureId + increment));

        if (typeof nextPic === 'undefined' || (typeof nextPic !== 'undefined' && !this.loggedIn && nextPic.active === false)) {
          this.showPicture(currentPictureId + increment, increment);
          return;
        }
        nextPictureId = nextPic.id;
      }

      this.$router.push(`/picture/${nextPictureId}`);
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
      axios.get(`${process.env.VUE_APP_API_ENTRY_URL}/pictures`, {
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
      // If false, means the post is updated without uploading a new picture
      if (value !== false) {
        this.pic_filename = value;
      }
      this.onSubmit();
    },

    initSubmit() {
      bus.$emit('fileUploadSubmit');
    },

    // Add or edit a picture
    async onSubmit() {
      try {
        await axios.post(`${process.env.VUE_APP_API_ENTRY_URL}/pictures`, {
          id: (this.mode === 'edit' ? this.picture.id : null), title: this.pic_title, filename: this.pic_filename, information: this.pic_information, size: this.pic_size, mode: this.mode,
        }, { headers: authHeader() }).then((response) => {
          if (response.status === 200) {
            // eslint-disable-next-line func-names
            setTimeout(() => true, 1000);
            this.$router.push('/gallery');
          } else {
            this.alerts.push({ message: response.message, hasError: true });
          }
        });
      } catch (err) {
        this.alerts.push({ message: err.response.data.message, hasError: true });
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

/* TODO */
ul[data-type="todo_list"] {
  padding-left: 0;
}
li[data-type="todo_item"] {
  display: flex;
  flex-direction: row;
}
.todo-checkbox {
  border: 2px solid black;
  height: 0.9em;
  width: 0.9em;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: 0.3rem;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: 0.2em;
  background-color: transparent;
  transition: 0.4s background;
}
.todo-content {
  flex: 1;
}
.todo-content > p:last-of-type {
  margin-bottom: 0;
}
.todo-content > ul[data-type="todo_list"] {
  margin: .5rem 0;
}

li[data-done="true"] > .todo-content > p {
  text-decoration: line-through;
}

li[data-done="true"] > .todo-checkbox {
  background-color: black;
}
li[data-done="false"] {
  text-decoration: none;
}

/* indent */
p[data-indent="1"] {
  margin-left: 30px!important;
}

/* text align */
p[data-text-align="center"] {
  text-align:center;
}
p[data-text-align="right"] {
  text-align:right;
}
p[data-text-align="justify"] {
  text-align:justify;
}

ul{
  list-style:disc !important;
}

ol{
  list-style:decimal !important;
}

#pic_information h3{
  font-size:25px;
  font-weight: bold;
  margin-bottom:10px;
}

#pic_information p{
  margin-bottom: 5px;
}
</style>
