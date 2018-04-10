<template>
  <transition name="fade">
    <div class="backdrop"></div>
  </transition>
</template>

<script>
  export default {
    name: 'Backdrop'
  }
</script>

<style lang="scss" scoped>
  .backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 999;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
