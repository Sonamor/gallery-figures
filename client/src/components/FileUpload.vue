<template>
  <div class="px-4 py-2">
    <form enctype="multipart/form-data" @submit.prevent="onSubmit">
      <div class="fields">
          <div class="w-full font-bold">Nouvelle image</div>
          <!--<input type="file" ref="file" @change="onSelect" class="mt-2">-->
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
      <div class="fields" v-if="imgSrc !== ''">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded focus:outline-none focus:shadow-outline mt-4">Valider</button>
      </div>
      <div v-bind:class="getClass()" role="alert" v-if="message != ''">
        <span class="block sm:inline">{{ message }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg @click="message = ''" class="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import VueCropper from 'vue-cropperjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';

export default {
  name: 'FileUpload',
  components: { VueCropper },
  data() {
    return {
      file: '',
      message: '',
      hasError: false,
      imgSrc: '',
      cropImg: '',
      data: null,
    };
  },
  methods: {

    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute('data-scale', scale);
    },
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute('data-scale', scale);
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;
      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          // this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    onSelect() {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const file = this.$refs.file.files[0];
      this.file = file;

      if (!allowedTypes.includes(file.type)) {
        this.message = 'Seules les images sont acceptées';
        this.hasError = true;
      }
      if (file.size > 5000000) {
        this.message = 'L\'image dépasse 500 kb';
        this.hasError = true;
      }
    },
    async onSubmit() {
      await this.$refs.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        console.log(this.$refs);
        const file = this.$refs.input.files[0];
        this.file = file;
        if (!allowedTypes.includes(file.type)) {
          this.message = 'Seules les images sont acceptées';
          this.hasError = true;
        }
        if (file.size > 5000000) {
          this.message = 'L\'image dépasse 500 kb';
          this.hasError = true;
        }

        const formData = new FormData();

        // Pass the image file name as the third parameter if necessary.
        formData.append('file', blob, this.file.name);
        // formData.append('file', this.file);

        console.log(blob);
        try {
          await axios.post('http://localhost:3000/api/upload', formData);
          this.message = 'Image sauvegardée';
          this.$emit('uploadedFile', this.file.name);
        } catch (err) {
          this.message = err.response.data.error;
          this.hasError = true;
        }
        // Use `jQuery.ajax` method for example
        /* $.ajax('/path/to/upload', {
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success() {
            console.log('Upload success');
          },
          error() {
            console.log('Upload error');
          },
        }); */
      });

      /* const formData = new FormData();
      formData.append('file', this.file);

      try {
        await axios.post('http://localhost:3000/api/upload', formData);
        this.message = 'Image sauvegardée';
        this.$emit('uploadedFile', this.file.name);
      } catch (err) {
        this.message = err.response.data.error;
        this.hasError = true;
      } */
    },
    getClass() {
      return {
        'border px-4 py-3 rounded relative mt-4': true,
        'bg-red-100': this.hasError,
        'border-red-400': this.hasError,
        'text-red-700': this.hasError,
        'bg-green-100': !this.hasError,
        'border-green-400': !this.hasError,
        'text-green-700': !this.hasError,
      };
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
