<template>
  <Layout>
    <div v-html="$page.webPage.content" />
  </Layout>
</template>

<script>
import { BListGroup, BListGroupItem } from 'bootstrap-vue';
import Benchmark from '../components/Benchmark.vue'

export default {
  metaInfo: {
    title: 'Documentation'
  },
  components: {
    BListGroup,
    BListGroupItem,
  },
}
</script>


<page-query>
query {
  webPage(path: "/content/pages/about/") {
    path
    content
  }
}
</page-query>

<style lang="scss">
.description p {
  margin-bottom: 2px;
}
</style>
