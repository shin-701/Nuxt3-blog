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
import { ref, onMounted } from 'vue';

import type { Article } from '~/types/article'
import type { Tag } from '~/types/tag'

// ===========================
//  ◆Newtからデータ取得処理
// ===========================
// 投稿(article)取得
const { data } = await useAsyncData('articles', async () => {
  const { $newtClient } = useNuxtApp()
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
// 直近の3投稿
const resentlyArticles = data.value?.items.slice(0,4);

// おすすめの投稿データ
const recommendArticles = computed(() => {
  return articles?.filter(article => article.recommendation === true).slice(0, 7) || [];
});

// BentoUIにはめる為、別変数に格納する
const recommendArticle1 = computed(() => recommendArticles.value[0]);
const recommendArticle2 = computed(() => recommendArticles.value[1]);
const recommendArticle3 = computed(() => recommendArticles.value[2]);
const recommendArticle4 = computed(() => recommendArticles.value[3]);
const recommendArticle5 = computed(() => recommendArticles.value[4]);
const recommendArticle6 = computed(() => recommendArticles.value[5]);
const recommendArticle7 = computed(() => recommendArticles.value[6]);


// 全タグデータ
const tags = tagData.value?.items;


// ===========================
//  ◆呼び出し関数
// ===========================
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
};

const htmlToString = (html: string) => {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }
  return html; // SSR時にはそのままHTML文字列を返す
};

// マウント時にスクロールイベントを追加
onMounted(() => {
  $(".raindrops").raindrops({
    color:'#CFD8DC',//水の色を指定
    canvasHeight:220, //canvasの高さを指定。初期値は親の高さの50%。
    waveLength: 100,//波の長さ(広がり)を指定。数値が大きいほど長さは小さくなる。初期値は340。
    waveHeight:150,//波の高さを指定。数値が大きいほど高さは高くなる。初期値は100。
    rippleSpeed: 0.05, //波紋のスピードを指定。数値が大きいほど波紋は速くなる。初期値は0.1。
    density: 0.04,//水の波紋の量を指定。数値が大きいほど波紋は小さくなる。初期値は0.02。
    frequency:5//雨粒の落ちる頻度を指定。数値が大きいほど頻度は多くなる。初期値は
  });

});

// ===========================
//  ◆Head情報
// ===========================
useHead({
  title: 'Newt・Nuxtブログ',
  meta: [
    { name: 'description', content: 'NewtとNuxtを利用したブログです' }
  ],
  script: [
    {
      src: 'https://code.jquery.com/jquery-3.4.1.min.js',
      // integrity: 'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=',
      // crossorigin: 'anonymous',
      // defer: true,
    },
    {
      src: 'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
      // integrity: 'sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=',
      // crossorigin: 'anonymous',
      // defer: true,
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/85188/raindrops.js',
      // type: 'text/javascript',
      // defer: true,
    },
  ],
})
</script>

<template>
  <v-main class="bg-grey-lighten-4">
    <v-app-bar :elevation="0" class="bg-grey-darken-3">
      <v-app-bar-title>Tonari no Nakayama</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-heart"></v-btn>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <!-- ===メイン画像================================ -->
    <v-container class="pa-0" style="height: 250px; max-width: none;">
      <v-card class="raindrops fill-height bg-grey-lighten-3 d-flex flex-column" variant="text">
        <div style="z-index:1;">
          <span class="font-weight-black d-flex justify-center px-16" style="font-size: 3.5rem;">Tonari no Nakayama</span>
          <span class="d-flex justify-center text-grey-darken-2" style="font-size: 1.3rem;">Engineering blog powered by shin-701</span>
        </div>
      </v-card>
    </v-container>

    <div class="py-8"></div> <!-- 空白調整 -->

    <!-- ===ピックアップ記事================================ -->
    <v-container>
      <span class="text-h5 pb-2 font-weight-black border-b-lg">ピックアップ記事</span>
    </v-container>

    <v-container>
      <v-row class="ma-0">
        <v-col v-for="article in resentlyArticles" :key="article._id" cols="12" sm="6" md="3" lg="3" class="pa-2">
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
                    <v-icon icon="mdi-twitter pr-3"></v-icon>
                    <div>仲山</div>
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>

    <div class="py-8"></div> <!-- 空白調整 -->
    <!-- ===新着記事================================ -->
    <v-container>
      <span class="text-h5 pb-2 font-weight-black border-b-lg">新着記事</span>
    </v-container>

    <v-container>
      <v-row class="ma-0">
        <v-col v-for="article in resentlyArticles" :key="article._id" cols="12" sm="6" md="3" lg="3" class="px-2">
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
                    <v-icon icon="mdi-twitter pr-3"></v-icon>
                    <div>仲山</div>
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>

    <div class="py-8"></div> <!-- 空白調整 -->
    <!-- ===ピックアップ記事================================ -->
    <v-container class="pa-0 bg-blue-grey-lighten-4" style="max-width: none;">
      <v-container class="d-flex flex-column justify-center align-center py-16">
        <v-row class="ma-0 d-flex">
          <span class="font-weight-black text-md-h4 text-h5 py-3">Tonari no Nakayama ブログとは</span>
        </v-row>
        <v-row class="ma-0 d-flex justify-center align-center">
          <v-col cols="12" sm="8" md="8" lg="8" class="px-2">
            <span class="text-body-1">
              現役エンジニアによる技術ブログです。<br>
              エンジニアとしての経験をもとに、最新の技術トレンドや実際の開発で得た知見をわかりやすく解説します。
              フロントエンド、バックエンド、インフラ構築まで幅広くカバーし、初心者から中級者まで役立つ情報を提供しています。
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <!-- ===タグ・検索================================ -->
    <v-container class="my-15">
      <span class="text-h5 pb-2 font-weight-black border-b-lg">検索</span>
      <v-text-field class="my-5" hide-details clearable label="検索ワードを入力して記事を探します" prepend-icon="mdi-magnify" variant="solo"></v-text-field>
    </v-container>
  </v-main>

</template>

<style scoped>
.v-container {
  max-width: 1280px;
}

.raindrops {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>