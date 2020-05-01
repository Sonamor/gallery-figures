<template>
  <div v-if="alerts.length > 0" class="alerts w-full">
    <div v-for="alert in alerts" v-bind:key="alert" v-bind:class="setClass(alert)" role="alert">
      <span class="block sm:inline">{{ alert.message }}</span>
      <span class="absolute top-0 bottom-0 right-0">
        <svg @click="deleteAlert(alert)" class="fill-current h-6 w-6 cross-svg" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Alerts',
  props: ['alerts'],
  data() {
    return {
      hasError: false,
    };
  },
  methods: {
    // Set alert box class relatively to the hasError variable
    setClass(alert) {
      return {
        'border px-2 py-1 rounded relative my-2': true,
        'bg-red-100': alert.hasError,
        'border-red-400': alert.hasError,
        'text-red-700': alert.hasError,
        'bg-green-100': !alert.hasError,
        'border-green-400': !alert.hasError,
        'text-green-700': !alert.hasError,
      };
    },

    // Delete an alert on click on the x
    deleteAlert(alert) {
      this.alerts.splice(this.alerts.indexOf(alert), 1);
    },
  },
};
</script>

<style>
  .cross-svg{
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
</style>
