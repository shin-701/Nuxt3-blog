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
//  ◆Newtから記事データ取得
// ===========================
const { slug } = route.params

const { data } = await useAsyncData(async () => {
  const { $newtClient } = useNuxtApp()
  return await $newtClient.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      slug: slug,
      depth: 2
    }
  })
})
const article = data.value

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

// ===========================
// <目次>作成処理
// ===========================
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
  if (tagName === 'h2') return '10px';
  if (tagName === 'h3') return '20px';
  if (tagName === 'h4') return '30px';
  return '0px';
}

// ===========================
//  ◆呼び出し関数
// ===========================
const formatDate = (dateString: string | undefined = '') => {
  return new Date(dateString).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
};

// マウント時にスクロールイベントを追加
onMounted(() => {
  applyHighlight();
  generateToc();
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
    <!-- ===ヘッダー画像================================ -->
    <raindropsHeader />
  
    <!-- ===記事================================ -->
    <v-container class="pa-0">
      <v-row class="ma-0 d-flex justify-center">
        <v-col cols="16" sm="12" md="8" lg="8">
          <v-container class="pa-8 bg-white rounded-xl">
            <h1 class="font-weight-black" style="font-size: 1.7rem;">{{ article?.title }}</h1>
            <v-container class="px-0 py-3 d-flex justify-between align-center">
              <v-container class="pa-0 d-flex flex-row text-grey-darken-1 text-body-2">
                <div>
                  公開日：{{ formatDate(article?._sys.createdAt) }}
                </div>
                <div class="pl-3">
                  最終更新日：{{ formatDate(article?._sys.updatedAt) }}
                </div>
              </v-container>
              <div>
                <v-chip class="ma-2" color="blue-grey-lighten-2">
                  <div class="d-flex gc-1 align-center">
                    <div>{{ article?.author.fullName }}</div> 
                    <v-avatar>
                      <v-img v-bind:src= article?.author.profileImage?.src></v-img>
                    </v-avatar>
                  </div>
                </v-chip>
              </div>

            </v-container>
            <v-img v-bind:src="article?.coverImage.src" alt="articleHeader Image" class="ma-auto my-3" :aspect-ratio="16 / 9" cover></v-img>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="article?.body" class="pt-9 markdown-content text-body-2" ref="contentRef"/>
          </v-container>
        </v-col>
        <v-col class="pr-12 hidden-sm hidden-xs" cols="12" sm="12" md="4" lg="4">
          <v-container class="py-0 bg-white rounded-xl" style="position: sticky; top: 75px;">
            <v-list class="px-2" variant="text" density="compact">
              <v-list-subheader class="font-weight-black text-body-2" >目次</v-list-subheader>
              <v-divider thickness="1"></v-divider>
              <NuxtLink v-for="(item, index) in toc" :key="index" :to="`#${item.id || ''}`" class="text-decoration-none">
                <v-list-item class="py-0 mt-1 text-black rounded-xl text-subtitle-2 font-weight-black toc" hover
                  style="min-height: 15px;" :style="{ paddingLeft: getPadding(item.tagName) }">{{ item.text }}</v-list-item>
              </NuxtLink>
            </v-list>
          </v-container>
        </v-col>
      </v-row>
      <div class="py-8 hidden-xs"></div> <!-- 空白調整 -->
    </v-container>
  </v-main>
</template>

<style scoped>
.toc :hover {
  background-color: #ECEFF1; /* hover時の背景色 */
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
  margin-bottom: 1rem;
}

:deep(.markdown-content p) {
  line-height: 1.75rem;
  margin-bottom: 1rem;
}
:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 1.5rem; /* 段落間のスペースを広げる */
}
:deep(.markdown-content li) {
  list-style-position: inside;
}
/* highlight.js のスタイルに合わせた調整 */
:deep(.markdown-content pre) {
  padding: 10px;
  background-color: #474949;
  border-radius: 5px;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>