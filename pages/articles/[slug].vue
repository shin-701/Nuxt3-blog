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
    <!-- ===ヘッダー画像================================ -->
    <raindropsHeader />
  
    <!-- ===記事================================ -->
    <v-container>
      <v-row class="ma-0 d-flex justify-center">
        <v-spacer class="hidden-md" ></v-spacer>
        <v-col cols="12" sm="12" md="8" lg="7">
          <v-container class="pa-8 bg-white rounded-xl">
            <span class="font-weight-black" style="font-size: 1.6rem;">{{ article?.title }}</span>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="article?.body" class="pt-16 markdown-content text-body-2" ref="contentRef"/>
          </v-container>

        </v-col>
        <v-col class="px-5 hidden-sm" cols="12" sm="12" md="4" lg="3">
          <v-container class="py-0 bg-white rounded-xl" style="position: sticky; top: 75px;">
            <v-list class="px-4" variant="text" density="compact">
              <v-list-subheader class="font-weight-black text-body-2" >目次</v-list-subheader>
              <v-divider thickness="1"></v-divider>
              <NuxtLink v-for="(item, index) in toc" :key="index" :to="`/articles/${article?.slug}/#${item.id || ''}`" class="text-decoration-none">
                <v-list-item class="py-0 mt-1 text-black rounded-xl text-subtitle-2 font-weight-black toc" hover
                  style="min-height: 15px;" :style="{ paddingLeft: getPadding(item.tagName) }">{{ item.text }}</v-list-item>
              </NuxtLink>
            </v-list>
          </v-container>
        </v-col>
      </v-row>
      <div class="py-8"></div> <!-- 空白調整 -->
    </v-container>
  </v-main>
</template>

<style scoped>
.v-container {
  max-width: 1280px;
}

.toc :hover {
  border-width: 2px !important;
  border-style: solid !important;
  border-color: #BCAAA4 !important;
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