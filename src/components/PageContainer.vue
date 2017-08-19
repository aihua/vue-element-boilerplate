<template>
  <div class="page-container">
    <transition name="page-wrapper" appear>
      <div class="page-wrapper">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  @import '../vue-material/core/stylesheets/variables.scss';

  .page-container {
    flex: 1;
    overflow: auto;
    background-color: #f4f5f6;
  }

  .page-wrapper {
    padding: 16px 16px 0;
  }

  .page-wrapper-enter-active {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    overflow: hidden;
    z-index: 0;
    transform: translate3D(-50%, 0, 0);
    transition: $swift-ease-out;
    transition-property: transform, opacity;
  }

  .page-wrapper-enter {
    opacity: 0;
    transform: translate3D(-50%, 15%, 0);
    z-index: 1;
  }
</style>

<script lang="babel">
  export default {
    name: 'page-container'
  };
</script>
