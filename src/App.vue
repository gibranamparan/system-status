<template>
  <router-view />
</template>

<script setup lang="ts">
  import { THEME_NAMES, useTheme } from './services/vuestic-ui/themes'
  const { setTheme } = useTheme()
  setTheme(THEME_NAMES.SEMI_DARK as keyof typeof THEME_NAMES)
</script>

<style lang="scss">
  @import 'scss/main.scss';

  #app {
    font-family: 'Source Sans Pro', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    margin: 0;
    background: var(--va-background);
  }
</style>
