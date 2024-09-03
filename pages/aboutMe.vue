<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

import type { Article } from '~/types/article'

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

// 全投稿データ
const articles = data.value?.items;

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
    canvasHeight:570, //canvasの高さを指定。初期値は親の高さの50%。
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
    <!-- ===Raindrops================================ -->
    <!-- ===HP名称・メイン画像================================ -->
    <v-container class="pa-0 header-v-container">
      <v-card class="raindrops fill-height rounded-xl bg-grey-lighten-3 d-flex flex-column" variant="text">
        <div style="z-index:1;">
          <span class="font-weight-black d-flex justify-center" style="font-size: 10rem;">Tonari no</span>
          <span class="d-flex justify-center" style="font-size: 1.6rem;">Engineering blog powered by shin-701</span>
          <span class="font-weight-black d-flex justify-center" style="font-size: 12rem;">Nakayama</span>
        </div>
      </v-card>
    </v-container>

    <!-- ===ヘッダーリンク================================ -->
    <v-container ref="stickyHeader" class="pa-0 my-3 wide-v-container rounded-xl sticky-header fixed-header" :class="{ 'fixed-header-top': isFixed }">
        <v-row class="ma-0">
            <v-col class="pa-0">
            <NuxtLink to="/" class="text-decoration-none">
                <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain" color="black">
                <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md" color="black"
                    :class="{ 'fixed-color': isFixed }">HOME</v-card-title>
                </v-card>
            </NuxtLink>
            </v-col>
            <v-col class="pa-0">
            <NuxtLink to="/articles/articlesList" class="text-decoration-none">
                <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain" color="black">
                    <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                    :class="{ 'fixed-color': isFixed }">ARTICLES</v-card-title>
                </v-card>
            </NuxtLink>
            </v-col>
            <v-col class="pa-0">
            <NuxtLink to="/siteMap" class="text-decoration-none">
                <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain" color="black">
                <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                    :class="{ 'fixed-color': isFixed }">SITE MAP</v-card-title>
                </v-card>
            </NuxtLink>
            </v-col>
            <v-col class="pa-0">
            <NuxtLink to="/contact" class="text-decoration-none">
                <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain" color="black">
                <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                    :class="{ 'fixed-color': isFixed }">CONTACT</v-card-title>
                </v-card>
            </NuxtLink>
            </v-col>
        </v-row>
    </v-container>

    <!-- ===記事================================ -->
    <v-container class="py-16 d-flex flex-column justify-cnter">
        <div class="d-flex flex-column align-center">
            <span>現在、システムメンテナンス中です。</span>
            <span>もうしばらくお待ち下さい</span>
            <NuxtLink to="/" class="text-decoration-none">
                <v-btn class="rounded-xl ma-5">ホームに戻る</v-btn>
            </NuxtLink>
        </div>
    </v-container>
</v-main>
</template>

<style scoped>
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
  max-width: 50%;
  background-color: #424242; /* hover時の背景色 */
  color: white;
}
.fixed-color {
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


</style>