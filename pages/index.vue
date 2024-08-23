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

import type { Article } from '~/types/article'
import type { Tag } from '~/types/tag'

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
// おすすめの投稿データ
const recommendArticles = articles?.filter(article => article.recommendation === true);
// 全タグデータ
const tags = tagData.value?.items;


// ===========================
//  ◆呼び出し関数
// ===========================
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
};

// maxWidthを動的に設定するためのref
const isFixed = ref(false);

// スクロールイベントを監視
const handleScroll = () => {
  const stickyHeader = document.querySelector('.sticky-header');

  if (stickyHeader) {
    const stickyPoint = stickyHeader.getBoundingClientRect().top;

    // 固定されたタイミングを検知してmaxWidthを変更
    if (stickyPoint <= 0) {
      isFixed.value = true;
    } else {
      isFixed.value = false;
    }
  }
};

// マウント時にスクロールイベントを追加
onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  $(".raindrops").raindrops({
    color:'#D7CCC8',//水の色を指定
    canvasHeight:470, //canvasの高さを指定。初期値は親の高さの50%。
    waveLength: 100,//波の長さ(広がり)を指定。数値が大きいほど長さは小さくなる。初期値は340。
    waveHeight:200,//波の高さを指定。数値が大きいほど高さは高くなる。初期値は100。
    rippleSpeed: 0.05, //波紋のスピードを指定。数値が大きいほど波紋は速くなる。初期値は0.1。
    density: 0.04,//水の波紋の量を指定。数値が大きいほど波紋は小さくなる。初期値は0.02。
    frequency:5//雨粒の落ちる頻度を指定。数値が大きいほど頻度は多くなる。初期値は
  });
});

// コンポーネントが破棄されるときにイベントを削除
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <v-main class="bg-grey-lighten-4">
    <!-- ===Raindrops================================ -->
    <!-- ===HP名称・メイン画像================================ -->
    <v-container class="pb-0 header-v-container">
      <v-card class="raindrops fill-height rounded-xl bg-grey-lighten-3 d-flex flex-column" variant="text">
        <v-row class="ma-0 align-end">
          <v-col class="d-flex align-center" style="z-index:1;" cols="12" sm="12" md="12" lg="12">
            <span class="font-weight-black text-h1 d-flex justify-center">Tonari no Nakayama</span>
          </v-col>
        </v-row>
        <v-row class="ma-0">
          <v-col style="z-index:1;">
            <v-card-subtitle ><span class="text-h5 mt-8">Engineering blog powered by shin-701</span></v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-container style="max-width: 100%;">
      <!-- ===ヘッダーリンク================================ -->
      <v-container ref="stickyHeader" class="pa-0 wide-v-container rounded-xl sticky-header fixed-header" :class="{ 'fixed-header-top': isFixed }">
        <v-row class="ma-0">
          <v-col class="pa-0">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
              <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">HOME</v-card-title>
            </v-card>
          </v-col>
          <v-col class="pa-0">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
              <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">ABOUT ME</v-card-title>
            </v-card>
          </v-col>
          <v-col class="pa-0">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
              <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">SITE MAP</v-card-title>
            </v-card>
          </v-col>
          <v-col class="pa-0">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
              <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">CONTACT</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ===新着記事======================================== -->
      <v-container class="mt-15 px-0 wide-v-container">
        <div class="text-h3 ma-3 font-weight-black d-flex align-center justify-center">N E W S</div>
      </v-container>
      <v-container class="pa-0">
        <v-row class="ma-0">
          <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4" lg="4" class="pa-0 my-5">
            <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
              <v-card class="mx-1 d-flex flex-column h-100 bg-grey-lighten-3 rounded-xl" hover>
                <v-img v-bind:src="article.coverImage.src" alt="Card Header Image" height="200px" class="rounded-xl" style="flex: none;" cover></v-img>
                <v-card-title class="font-weight-black text-subtitle-1" style="white-space: normal;">
                  {{ article.title }}
                </v-card-title>
                <v-spacer></v-spacer>
                <v-card-subtitle  class="text-caption">
                  <time :datetime="article._sys.raw.firstPublishedAt">{{ formatDate(article._sys.raw.firstPublishedAt) }}</time>
                </v-card-subtitle>
                <v-card-actions>
                  <v-chip v-for="tag in article.tags" :key="tag._id" density="compact" size="default">
                    #{{ tag.name }}
                  </v-chip>
                </v-card-actions>
              </v-card>
            </NuxtLink>
          </v-col>
        </v-row>
      </v-container>
      <!-- ===おすすめの投稿=======================¬========= -->
      <v-container class="mt-15 px-0">
        <div class="text-h3 ma-3 font-weight-black d-flex align-center justify-center">R E C O M M E N D</div>
      </v-container>
      <v-container class="px-0">
        <v-row class="ma-0">
          <v-col class="pa-0" cols="12" sm="12" md="9" lg="9">
            <v-row class="ma-0">
              <v-col class="pa-1" cols="12" sm="12" md="9" lg="9">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
              <v-col class="pa-1" cols="12" sm="12" md="3" lg="3">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-1" cols="12" sm="12" md="4" lg="4">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
              <v-col class="pa-1" cols="12" sm="12" md="4" lg="4">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
              <v-col class="pa-1" cols="12" sm="12" md="4" lg="4">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pa-0" cols="12" sm="12" md="3" lg="3">
            <v-row class="mx-0 my-1 d-flex flex-column h-100-minw960">
              <v-col class="pa-1 maxw-100-minw960" cols="12" sm="12" md="4" lg="4">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
              <v-col class="pa-1 maxw-100-minw960" cols="12" sm="12" md="8" lg="8">
                <v-card class="d-flex flex-column h-100 rounded-xl" variant="plain" hover>
                  <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" cover></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <div class="py-10"></div> <!-- 空白調整 -->

      <!-- ===タグ・検索================================ -->
      <v-container class="my-15 px-0">
        <v-divider class="pa-6"></v-divider>
        <v-row class="mx-0 d-flex justify-center align-stretch">
          <v-col cols="12" sm="12" md="6" lg="6">
            <span class="text-h5 pb-2 font-weight-black border-b-lg">TAG</span>
            <div class="my-5 flex-grow-0">
              <NuxtLink v-for="tag in tags" :key="tag._id" :to="`/search/${tag.slug}`" class="text-decoration-none">
                <v-chip class="ma-1 custom-card" color="black" density="compact" size="large">#{{ tag.name }}</v-chip>
              </NuxtLink>
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <span class="text-h5 pb-2 font-weight-black border-b-lg">SEARCH</span>
            <v-text-field class="my-5" hide-details clearable label="検索ワードを入力して記事を探します" prepend-icon="mdi-magnify" variant="solo"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-main>

</template>

<style scoped>
.v-container {
  max-width: 1280px;
}
.header-v-container {
  max-width: 1760px;
  height: 554px;
}
.wide-v-container {
  max-width: 1760px;
}
.custom-card {
  transition: background-color 0.5s ease;
}
.custom-card:hover {
  background-color: #BCAAA4; /* hover時の背景色 */
}
.fixed-header {
  /* 画面トップまでスクロールした際に固定する */
  position: sticky;
  top: 0;
  z-index: 9999;
  transition: max-width 0.5s ease;
  background-color: #EEEEEE;
}
.fixed-header-top {
  /* 画面トップまでスクロール時に反映するcss */
  max-width: 1280px;
  background-color: #424242; /* hover時の背景色 */
  color: white;
}
@media (max-width: 959px) {
  .v-container .wide-v-container{
    max-width: 100%;
    padding: 20px;
  }
  .header-v-container {
    height: auto;
  }
}
@media (min-width: 960px) {
  .h-100-minw960 {
    height: 100% !important;
  }
  .maxw-100-minw960 {
    max-width: 100%;
  }
}

.raindrops {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
.box {
  padding: 20px;
  text-align: center;
  z-index:1;
}
a {
  color: #0bd;
}

</style>