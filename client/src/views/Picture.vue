<template>
  <div>
    <Gallery />
    <Picture />
  </div>
</template>
<script>
import Gallery from '@/components/Gallery.vue';
import Picture from '@/components/Picture.vue';

export default {
  name: 'picture',
  components: {
    Gallery,
    Picture,
  },
};
</script>
