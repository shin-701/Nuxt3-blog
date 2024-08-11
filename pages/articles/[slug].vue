<!-- =====================================
 ◆データの取得方法
    投稿詳細を取得するメソッドとして、SDKが提供している getFirstContent を利用しています。
    このメソッドはクエリに該当するコンテンツのうち、最初の1件を返却するメソッドです。
    指定したスラッグのコンテンツを取得したい場合は、このメソッドを利用します。
◆NuxtLinkとは？
    Nuxt.js における「ナビゲーションリンク」を作成するためのコンポーネントです。
    これを使うことで、ユーザーがアプリケーション内の異なるページに移動できるリンクを簡単に作成することができます。

    <NuxtLink> を使用することで、リンクをクリックしてページ間を移動する際に、
    Nuxt.js が内部でルーティング（ページの切り替え）を管理し、ページの再読み込みを防ぎます。
    これにより、ユーザーは素早く、スムーズにページを移動できるようになります。
     =====================================-->
<script lang="ts" setup>
import type { Article } from '~/types/article'

const route = useRoute()
const { slug } = route.params

const { data } = await useAsyncData(`article-${slug}`, async () => {
  const { $newtClient } = useNuxtApp()
  return await $newtClient.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      slug,
      select: ['_id', 'title', 'slug', 'body']
    }
  })
})
const article = data.value

useHead({
  title: article?.title,
  meta: [
    { name: 'description', content: '投稿詳細ページです' }
  ]
})
</script>

<template>
    <main class="main">
      <h1>{{ article?.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article?.body" />
    </main>
</template>