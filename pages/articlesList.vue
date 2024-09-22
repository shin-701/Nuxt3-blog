<!-- =====================================
 index.vue
    ここではトップページ（パス: /）で投稿一覧を表示したいので、pages ディレクトリを作成し、その中に index.vue というファイルを作成します。
    
    まず、script タグに以下の内容を記載します。
    useAsyncData を利用してNewtから投稿一覧を取得し、articles という変数で定義することで、template の中で参照できるようにしています。
    また、useHead を利用して、タイトルとディスクリプションを設定しています。 
 ------------
 ◆データの取得方法
    データの取得について詳細を説明します。
    まず、useNuxtApp を利用して、3-3で登録した newtClient を利用できるようにします。
    次に、SDKが提供している getContents メソッドを利用して、投稿一覧を取得します。getContentsのパラメータに Article の型を渡すことで、返却される items の型として Article[] が指定されます。
    また、selectパラメータを利用して、取得するフィールドを _id・title・slug・body のみに制限します。
    最後に articles として data.value?.items を定義することで、getContentsで返却されたオブジェクトの items 要素を articles として参照できるようにします。
 ------------
 ◆フィールドID
    タイトル： title
    スラッグ： slug
    メタ情報： meta
    本文： body
    カバー画像： coverImage
    著者： author
    タグ： tags
    firstPublishedAt
    git commit -m "【ブログデザイン作成】vutifyインストール[in progress]"
========================================== -->

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

import type { Article } from '~/types/article'
import type { Tag } from '~/types/tag'

// ===========================
//  ◆Newtからデータ取得処理
// ===========================
const route = useRoute();
const searchWords = Array.isArray(route.query.searchWords) ? route.query.searchWords.join(' ') : route.query.searchWords || '';

// 投稿(article)取得
const { data } = await useAsyncData('articles', async () => {
  const { $newtClient } = useNuxtApp()
  // 検索ワードの指定がある場合は、抽出条件を指定してAPIを実行する
  if (searchWords) {
    // タグの取得結果をPromiseから取り出すためにawaitを使用
    const tagsTemp = await $newtClient.getContents<Tag>({
      appUid: 'blog',
      modelUid: 'tag',
      query: {
        slug: searchWords,
        select: ['_id']
      }
    });

    // tagsTempからIDリストを抽出
    const tagIds = tagsTemp.items.map(tag => tag._id);

    return await $newtClient.getContents<Article>({
      appUid: 'blog',
      modelUid: 'article',
      query: {
        tags: { in: tagIds},
        // 「-」をつけることで最新の投稿から降順で取得する
        order: ['-_sys.createdAt']
      }
    })
  }
  return await $newtClient.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      // 「-」をつけることで最新の投稿から降順で取得する
      order: ['-_sys.createdAt']
    }
  })
})

// タグ(tags)取得
const { data: tagData } = await useAsyncData('tags', async () => {
  const { $newtClient } = useNuxtApp()
  return await $newtClient.getContents<Tag>({
    appUid: 'blog',
    modelUid: 'tag',
    query: {
      // 「-」をつけることで最新の投稿から降順で取得する
      order: ['name']
    }
  })
})

// 全投稿データ
const articles = data.value?.items;

// 全タグデータ
const tags = tagData.value?.items;
// ===========================
//  ◆呼び出し関数
// ===========================
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
};

const htmlToString = (html: string) => {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }
  return html; // SSR時にはそのままHTML文字列を返す
};

// ===========================
//  ◆Head情報
// ===========================
useHead({
  title: 'Newt・Nuxtブログ',
  meta: [
    { name: 'description', content: 'NewtとNuxtを利用したブログです' }
  ]
})
</script>

<template>
  <v-main class="bg-grey-lighten-4">
    <raindropsHeader />

    <!-- ===記事一覧================================ -->
    <v-container>
      <span class="text-h5 pb-2 font-weight-black border-b-lg">記事一覧</span>
    </v-container>
    <!-- searchWordsが連携された場合のみ表示する -->
    <v-container v-if=searchWords class="py-2">
      <span class="text-h6 pa-2">タグ「{{ searchWords }}」に関する記事一覧</span>
    </v-container>

    <v-container>
      <v-row class="ma-0">
        <v-spacer></v-spacer>
        <v-col cols="12" xm="12" sm="12" md="8" lg="9">
          <v-row class="ma-0">
            <v-col v-for="article in articles" :key="article._id" cols="12" xm="12" sm="6" md="6" lg="4" class="pa-2">
              <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
                <v-card class="mx-0 pa-2 d-flex flex-column bg-white rounded-xl" hover>
                  <v-card-title class="font-weight-black"
                    style="display: -webkit-box; -webkit-box-orient: vertical; line-clamp: 3; white-space: normal;">
                    {{ article.title }}
                  </v-card-title>
                  <v-card-text class="mx-4 pa-0 h-auto"
                    style="display: -webkit-box; -webkit-box-orient: vertical; line-clamp: 3; white-space: normal; overflow: hidden;">
                    {{ htmlToString(article.body) }}
                  </v-card-text>
                  <v-card-item class="pb-0">
                    <v-chip v-for="tag in article.tags" :key="tag._id" density="compact" size="small">
                      #{{ tag.name }}
                    </v-chip>
                  </v-card-item>
                  <v-card-item class="text-caption text-grey-darken-1 pl-4 pr-6">
                    <div class="d-flex flex-row justify-space-between">
                      <time :datetime="article._sys.raw.firstPublishedAt">{{ formatDate(article._sys.raw.firstPublishedAt) }}</time>
                      <div class="d-flex flex-row">
                        <v-icon icon="mdi-account-edit pr-3"></v-icon>
                        <div>{{ article.author.fullName }}</div>
                      </div>
                    </div>
                  </v-card-item>
                </v-card>
              </NuxtLink>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3">
          <v-container class="py-0">
            <span class="text-h6 pb-2 font-weight-black border-b-lg">タグ一覧</span>
          </v-container>
          <v-container>
            <div class="py-2">
              <NuxtLink v-for="tag in tags" :key="tag._id" 
                :to="{ path: `/articlesList`, query: { searchWords: `${tag.slug}` } }" class="text-decoration-none">
                <v-chip class="ma-1 custom-card" color="grey-lighten-2" size="default" variant="flat">#{{ tag.name }}</v-chip>
              </NuxtLink>
            </div>
          </v-container>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    <div class="py-8 hidden-xs"></div> <!-- 空白調整 -->
  </v-main>

</template>

<style scoped>
.v-container {
  max-width: 1280px;
}
</style>