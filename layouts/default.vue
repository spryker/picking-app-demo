<template>
  <a-layout>
    <a-layout-header>
      <a-page-header :title="pageTitle" :sub-title="appTitle"></a-page-header>
    </a-layout-header>
    <a-layout-content>
      <Nuxt />
    </a-layout-content>
    <a-layout-footer>Spryker (c) {{ year }}</a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    updateTitle: 0,
    year: new Date().getFullYear(),
  }),
  computed: {
    appTitle() {
      return 'Picking App Demo'
    },
    pageTitle() {
      return (
        (!this.$isServer &&
          this.updateTitle &&
          this.$root.$meta().refresh().metaInfo.titleChunk) ||
        ''
      )
    },
  },
  mounted() {
    this.updateTitle++
  },
})
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#__nuxt,
#__layoutm .ant-layout {
  height: 100%;
}

.ant-layout-footer {
  text-align: center;
}
</style>
