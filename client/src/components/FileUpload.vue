<template>
  <div class="px-4 py-2">
    <Alerts :alerts="alerts"/>
    <form enctype="multipart/form-data" @submit.prevent="onSubmit" ref="fileUploadForm">
      <div class="fields">
          <div class="w-full font-bold m-1 text-gray-500">Nouvelle image</div>
          <input
            ref="input"
            type="file"
            name="image"
            accept="image/*"
            @change="setImage"
            class="hidden"
          />
          <div class="inline-flex m-1">
            <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              href="#"
              role="button"
              @click.prevent="showFileChooser"
            >
              Choisir une image
            </a>
          </div>
          <div>
            <section class="w-full flex flex-row">
              <div class="img-cropper flex-1 m-1">
                <vue-cropper
                  ref="cropper"
                  v-if="imgSrc !== ''"
                  :aspect-ratio="16 / 9"
                  :src="imgSrc"
                  preview=".preview"
                />
              </div>
              <div class="flex-1 relative mt-1" v-if="imgSrc !== ''">
                <p class="preview-label">Preview</p>
                <div class="preview overflow-hidden w-full" />
              </div>
            </section>
            <section class="w-full" v-if="imgSrc !== ''">
              <div class="inline-flex m-1">
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  href="#"
                  role="button"
                  @click.prevent="zoom(0.2)">
                  Zoom +
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  href="#"
                  role="button"
                  @click.prevent="zoom(-0.2)">
                  Zoom -
                </a>
              </div>
              <div class="inline-flex m-1">
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  href="#"
                  role="button"
                  @click.prevent="move(-10, 0)"
                >
                  ◄
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
                  href="#"
                  role="button"
                  @click.prevent="move(10, 0)"
                >
                  ►
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
                  href="#"
                  role="button"
                  @click.prevent="move(0, -10)"
                >
                  ▲
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  href="#"
                  role="button"
                  @click.prevent="move(0, 10)"
                >
                  ▼
                </a>
              </div>
              <div class="inline-flex m-1">
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  href="#"
                  role="button"
                  @click.prevent="rotate(90)"
                >
                  +90°
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  href="#"
                  role="button"
                  @click.prevent="rotate(-90)"
                >
                  -90°
                </a>
              </div>
              <div class="inline-flex m-1">
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  ref="flipX"
                  href="#"
                  role="button"
                  @click.prevent="flipX"
                >
                  Flip X
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  ref="flipY"
                  href="#"
                  role="button"
                  @click.prevent="flipY"
                >
                  Flip Y
                </a>
              </div>
              <div class="inline-flex m-1">
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  href="#"
                  role="button"
                  @click.prevent="cropImage"
                >
                  Recadrer
                </a>
                <a class="bg-gray-300 text-xs hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  href="#"
                  role="button"
                  @click.prevent="reset"
                >
                  Reset
                </a>
              </div>
            </section>
          </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import VueCropper from 'vue-cropperjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import authHeader from '../services/authHeader';
import Alerts from '@/components/Alerts.vue';
import bus from '../../bus';

export default {
  name: 'FileUpload',
  components: { VueCropper, Alerts },
  data() {
    return {
      file: '',
      imgSrc: '',
      cropImg: '',
      data: null,
      alerts: [],
    };
  },
  created() {
    bus.$on('fileUploadSubmit', () => this.onSubmit());
  },
  methods: {
    // get image data for post processing, e.g. upload or setting image src
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },

    // Flip image on X axis
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute('data-scale', scale);
    },

    // Flip image on Y axis
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute('data-scale', scale);
    },

    // Move the image
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },

    // Reset the cropper mask
    reset() {
      this.$refs.cropper.reset();
    },

    // Rotate the image
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },

    // Set image in cropperjs
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          this.$refs.cropper.replace(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert('Désolé, FileReader API n\'est pas supporté');
      }
    },

    // Show the selected image
    showFileChooser() {
      this.$refs.input.click();
    },

    // Zoom on the image
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },

    // Submit the image and upload it on the server
    async onSubmit() {
      await this.$refs.cropper.getCroppedCanvas().toBlob(async (blob) => {
        // Image verfication : extension and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const file = this.$refs.input.files[0];
        this.file = file;
        if (!allowedTypes.includes(file.type)) {
          this.alerts.push({ message: 'Seules les images sont acceptées', hasError: true });
        }
        if (file.size > 5000000) {
          this.alerts.push({ message: 'L\'image dépasse 500 kb', hasError: true });
        }

        const formData = new FormData();

        // Pass the image file name as the third parameter if necessary.
        formData.append('file', blob, this.file.name);

        try {
          await axios.post('/api/upload', formData, { headers: authHeader() });
          this.alerts.push({ message: 'Image sauvegardée', hasError: false });
          this.$emit('uploadedFile', this.file.name);
        } catch (err) {
          this.alerts.push({ message: err.response.data.error, hasError: true });
        }
      });
    },
  },
};
</script>

<style>
.preview {
  height: calc(372px * (9 / 16));
}
.preview-label {
  position:absolute;
  font-weight:bold;
  background:#fff;
  opacity:0.5;
  z-index:9999;
  width:100%;
}
</style>
