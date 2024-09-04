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
          <span class="font-weight-black d-flex justify-center" style="font-size: 11rem;">Tonari no</span>
          <span class="d-flex justify-center" style="font-size: 1.6rem;">Engineering blog powered by shin-701</span>
          <span class="font-weight-black d-flex justify-center" style="font-size: 13rem;">Nakayama</span>
        </div>
      </v-card>
    </v-container>

    <v-container style="max-width: 100%;">
      <!-- ===ヘッダーリンク================================ -->
      <v-container ref="stickyHeader" class="pa-0 wide-v-container rounded-xl sticky-header fixed-header" :class="{ 'fixed-header-top': isFixed }">
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

      <!-- ===新着記事======================================== -->
      <v-container class="mt-15 px-0">
        <div class="text-h3 ma-10 font-weight-black d-flex align-center justify-center">A R T I C L E L I S T</div>
        <div class="py-3"></div> <!-- 空白調整 -->
        <v-text-field class="my-10" hide-details clearable label="検索ワードを入力して記事を探します" prepend-icon="mdi-magnify" variant="solo"></v-text-field>
      </v-container>

      <v-container class="pa-0">
        <v-row class="ma-0">
          <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4" lg="4" class="pa-0 my-1">
            <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
              <v-card class="mx-1 d-flex flex-column h-100 bg-white rounded-xl" hover>
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
          <v-spacer></v-spacer>
        </v-row>
      </v-container>

      
      <!-- ===検索================================ -->
      <v-container class="my-10 px-0">
        <v-divider class="pa-6"></v-divider>
        <span class="text-h5 pb-2 font-weight-black border-b-lg">TAG</span>
        <div class="my-5 flex-grow-0">
          <NuxtLink v-for="tag in tags" :key="tag._id" 
            :to="{ path: `/articles/articlesList`, query: { searchWords: `${tag.slug}` } }" class="text-decoration-none">
            <v-chip class="ma-1 custom-card" color="black" density="compact" size="large">#{{ tag.name }}</v-chip>
          </NuxtLink>
        </div>
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