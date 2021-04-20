<template>
  <a-layout>
    <a-layout-header style="background-color: #e6e6e6">
      <a-page-header
        :title="pageTitle"
        :sub-title="appTitle"
        :back-icon="backLink ? undefined : false"
        @back="goBack"
      ></a-page-header>
    </a-layout-header>
    <a-layout-content>
      <Nuxt ref="content" />
    </a-layout-content>
    <a-layout-footer>Spryker (c) {{ year }}</a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    pageUpdated: 0,
    year: new Date().getFullYear(),
    backLink: '',
  }),
  computed: {
    appTitle() {
      return 'Picking App Demo'
    },
    pageTitle() {
      return (
        (!this.$isServer &&
          this.pageUpdated &&
          this.$root.$meta().refresh().metaInfo.titleChunk) ||
        ''
      )
    },
  },
  mounted() {
    this.pageUpdated++

    this.$router.afterEach(() => {
      // HACK: Double timer to pickup new page
      setTimeout(() => setTimeout(() => this.pageUpdated++))
    })
  },
  updated() {
    // HACK: Wait 3 ticks until content child ref is rendered
    setTimeout(() => setTimeout(() => setTimeout(() => this.pageRendered())))
  },
  methods: {
    goBack() {
      if (!this.backLink) return
      this.$router.push({ path: this.backLink })
    },
    pageRendered() {
      const contentComp = this.$refs.content as Vue
      const pageComp = contentComp.$children[0] as any
      this.backLink = pageComp?.backLink
      this.pageUpdated++
    },
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
#__layout,
.ant-layout {
  display: flex;
  min-height: 100%;
  min-width: 100%;
}

.ant-layout-content {
  padding: 8px 16px;
}

.ant-layout-footer {
  text-align: center;
}
</style>
