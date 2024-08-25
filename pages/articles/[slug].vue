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
import { ref, onMounted, watchEffect } from 'vue'

import type { TocItem } from '~/types/tocItem'
import type { Article } from '~/types/article'

import hljs from 'highlight.js'
import 'highlight.js/styles/rainbow.css' // 好みのテーマをインポート

const route = useRoute()

// ===========================
//  ◆Newtからデータ取得処理
// ===========================
const { slug } = route.params

const { data } = await useAsyncData(`article-${slug}`, async () => {
  const { $newtClient } = useNuxtApp()
  return await $newtClient.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      slug
    }
  })
})
const article = data.value

// ===========================
//  ◆スクロールアニメーションcss適用
// ===========================
const isFixed = ref(false); // maxWidthを動的に設定するためのref

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

// ===========================
//  ◆v-htmlにcss適用
// ===========================
const contentRef = ref(null) 

// コードタグにhighlight.jsを適用
function applyHighlight() {
  const contentElement = contentRef.value as HTMLElement | null
  if (contentElement) {
    const codeBlocks = contentElement.querySelectorAll('pre code')
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement) // 型キャストを行う
    })
  }
}

// <目次>作成処理
const toc = ref<TocItem[]>([]);

function generateToc() {
  const contentElement = contentRef.value as HTMLElement | null;
  if (contentElement) {
    const headers = contentElement.querySelectorAll('h1, h2, h3, h4');
    const tocItems: TocItem[] = [];

    headers.forEach((header) => {
      let text = header.textContent?.trim() || ''; // nullの可能性を考慮して初期値を設定
      const id = header.getAttribute('id') || text.toLowerCase().replace(/\s+/g, '-');
      const tagName = header.tagName.toLowerCase(); // タグ名を取得

      header.setAttribute('id', id);
      
      tocItems.push({
        id,
        text,
        tagName
      });
    });

    toc.value = tocItems;
  }
}

// 目次インデント追加処理
function getPadding(tagName: string | null) {
  if (tagName === 'h2') return '20px';
  if (tagName === 'h3') return '40px';
  if (tagName === 'h4') return '60px';
  return '0px';
}

// マウント時にスクロールイベントを追加
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  applyHighlight();
  generateToc();
});

// コンポーネントが破棄されるときにイベントを削除
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// v-htmlで描画される内容が動的に変わる場合を考慮して、watchEffectを使って内容が更新された際にハイライトを適用しています.
watchEffect(() => {
  applyHighlight()
});

// ===========================
//  ◆HEAD情報
// ===========================
useHead({
  title: article?.title,
  meta: [
    { name: 'description', content: '投稿詳細ページです' }
  ]
})
</script>

<template>
  <v-main class="bg-grey-lighten-4">
    <!-- ===HP名称・メイン画像================================ -->
    <v-container class="d-flex pa-0 header-v-container">
      <v-row class="ma-0">
        <v-col class="pa-1 h-100-minw960" cols="12" sm="12" md="6" lg="6">
          <v-container class="d-flex flex-column rounded-xl justify-center bg-grey-lighten-3 pa-16 h-100" hover>
            <span class="font-weight-black text-h4 text-md-h2">{{ article?.title }}</span>
          </v-container>
        </v-col>
        <v-col class="pa-1 h-100-minw960" cols="12" sm="12" md="6" lg="6">
            <v-img v-bind:src="article?.coverImage.src" class="rounded-xl h-100" cover></v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- ===ヘッダーリンク================================ -->
    <v-container ref="stickyHeader" class="pa-0 wide-v-container rounded-xl sticky-header fixed-header" :class="{ 'fixed-header-top': isFixed }">
      <v-row class="ma-0">
        <v-col class="pa-0">
          <NuxtLink to="/" class="text-decoration-none">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain" color="black">
              <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
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
    <v-spacer class="py-10"></v-spacer>
    <v-container class="py-16 wide-v-container">
      <v-row class="d-flex justify-center align-stretch">
        <v-spacer></v-spacer>
        <v-col cols="12" sm="12" md="8" lg="6">
          <span class="font-weight-black text-h4">{{ article?.title }}</span>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="article?.body" class="py-16 markdown-content" ref="contentRef"/>
        </v-col>
        <v-col class="px-10 position-sticky" cols="12" sm="12" md="3" lg="3">
          <v-container class="py-0 pl-6 position-sticky">
            <div class="border-s-md">
              <v-list class="ml-4 bg-grey-lighten-4" variant="text">
                <v-list-item class="font-weight-black">もくじ</v-list-item>
                <v-divider thickness="3"></v-divider>
                <NuxtLink v-for="(item, index) in toc" :key="index" :to="`/articles/${article?.slug}/#${item.id || ''}`" class="text-decoration-none">
                  <v-list-item class="py-0 mt-1 text-black rounded-xl" hover
                    style="min-height: 36px;" :style="{ paddingLeft: getPadding(item.tagName) }">{{ item.text }}</v-list-item>
                </NuxtLink>
              </v-list>
            </div>
          </v-container>
        </v-col>
      </v-row>
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
  max-width: 900px;
  background-color: #424242; /* hover時の背景色 */
  color: white;
}
.fixed-color {
  color: white;
}
.toc :hover {
  border-width: 2px !important;
  border-style: solid !important;
  border-color: #BCAAA4 !important;
}
html {
  scroll-padding-top: 100px; /* 固定されたヘッダーの高さ分を設定 */
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
/* マークダウンで生成された本文の行間を調整 */
/* 深いセレクタを使用して、v-htmlで挿入されたHTMLにスタイルを適用 */

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3),
:deep(.markdown-content h4),
:deep(.markdown-content h5),
:deep(.markdown-content h6),
:deep(.markdown-content hr) {
  margin-bottom: 1em;
}
:deep(.markdown-content p) {
  line-height: 2.3;
  margin-bottom: 1em;
}
:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 1.5em; /* 段落間のスペースを広げる */
}
:deep(.markdown-content li) {
  list-style-position: inside;
}
/* highlight.js のスタイルに合わせた調整 */
:deep(.markdown-content pre) {
  padding: 10px;
  background-color: #474949;
  border-radius: 5px;
  margin-top: 2em;
  margin-bottom: 2em;
}

</style>