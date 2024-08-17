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
import type { Article } from '~/types/article'
import type { Tag } from '~/types/tag'
import { useDisplay } from 'vuetify'

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
const { mdAndUp } = useDisplay()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
};

useHead({
  title: 'Newt・Nuxtブログ',
  meta: [
    { name: 'description', content: 'NewtとNuxtを利用したブログです' }
  ]
})
</script>

<template>
  <v-layout>
    <v-main class="bg-grey-lighten-4">
      <v-container style="max-width: 100%;">
        <!-- ===HP名称・メイン画像================================ -->
        <v-container class="d-flex pa-0 header-v-container">
          <v-row class="ma-0">
            <v-col class="pa-1 header-v-col" cols="12" sm="12" md="auto">
              <v-container class="d-flex flex-column rounded-xl justify-center bg-grey-lighten-3 pa-16 h-100" hover>
                <v-text class="font-weight-black text-h1">Tonari</v-text>
                <v-text class="font-weight-black text-h1">no</v-text>
                <v-text class="font-weight-black text-h1">Nakayama</v-text>
                <v-text class="text-h5 mt-8">Engineering blog powered by shin-701</v-text> 
              </v-container>
            </v-col>
            <v-col class="pa-1 header-v-col">
                <v-img v-bind:src="articles[0].coverImage.src" class="rounded-xl h-100" cover></v-img>
            </v-col>
          </v-row>
        </v-container>
        <!-- ===新着記事======================================== -->
        <v-container class="my-10 pa-0">
          <div class="text-h3 ma-3 font-weight-black" justify="center">新着記事 PICK UP</div>
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
        <v-container class="my-10 pa-0 wide-v-container">
          <div class="text-h3 ma-3 font-weight-black" justify="center">おすすめ記事</div>
          <v-row class="ma-0">
            <v-col class="pa-0" cols="12" sm="12" md="9" lg="9">
              <v-row class="mx-0 my-1">
                <v-col class="pa-0" cols="12" sm="12" md="9" lg="9">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
                <v-col class="pa-0" cols="12" sm="12" md="3" lg="3">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mx-0 my-1">
                <v-col class="pa-0" cols="12" sm="12" md="4" lg="4">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
                <v-col class="pa-0" cols="12" sm="12" md="4" lg="4">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
                <v-col class="pa-0" cols="12" sm="12" md="4" lg="4">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="pa-0" cols="12" sm="12" md="3" lg="3">
              <v-row class="mx-0 my-1 d-flex flex-column fill-height">
                <v-col class="pa-0" style="max-width: 100%;" cols="12" sm="12" md="4" lg="4">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
                <v-col class="pa-0" style="max-width: 100%;" cols="12" sm="12" md="4" lg="8">
                  <v-card class="ma-1 d-flex flex-column h-100 rounded-xl" hover>
                    <v-img v-bind:src="articles[0].coverImage.src" alt="Card Header Image" class="rounded-xl h-100" style="flex: none;" cover></v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <!-- ===タグ一覧================================ -->
        <v-container class="mt-5 pa-0">
          <v-list density="compact" class="rounded-lg">
            <v-list-subheader class="font-weight-black text-subtitle-1">タグ</v-list-subheader>
            <div v-for="tag in tags" :key="tag._id">
              <v-list-item append-icon="mdi-arrow-right-bold" class="mr-4 ml-4 pa-0 border-b-thin">
                <v-list-item-title class="font-weight-black text-body-2" v-text="tag.name"></v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-container>
        <!-- ===フッター================================ -->
        <v-footer class="bg-grey-lighten-2 d-flex flex-column">
          <v-container>
            
            <v-row>
              <v-col>
                <v-card class="rounded-lg">
                  <!-- 背景画像 -->
                  <v-img v-bind:src="articles[2].coverImage.src" class="d-block" style="height: 180px;" cover>
                  </v-img>

                  <!-- アイコンが背景画像にかぶる -->
                  <div align="center" justify="center">
                    <v-avatar size="100" style="margin-top: -50px; border: 5px solid white;">
                      <img v-bind:src="articles[2].coverImage.src" alt="Profile Icon" />
                    </v-avatar>
                  </div>

                  <!-- 名前と説明文 -->
                  <v-card-title class="text-center font-weight-bold">John Doe</v-card-title>
                  <v-card-text class="text-center">A passionate developer with a love for coding and design.</v-card-text>

                  <!-- ソーシャルリンク -->
                  <v-card-actions class="justify-center">

                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col class="d-flex flex-columnjustify-center">
                <v-container class="d-flex flex-column rounded-xl justify-center bg-grey-lighten-3 pa-3" hover>
                  <v-text class="font-weight-black text-h5">Tonari</v-text>
                  <v-text class="font-weight-black text-h5">no</v-text>
                  <v-text class="font-weight-black text-h5">Nakayama</v-text>
                  <v-text class="text-h6 mt-8">Engineering blog powered by shin-701</v-text>
                  <v-btn class="bg-grey-lighten-3 ma-2" color="purple" icon="mdi-twitter" href="https://x.com" target="_blank"></v-btn>
                  <v-btn class="bg-grey-lighten-3 ma-2" color="purple" icon="mdi-github" href="ttps://github.com" target="_blank"></v-btn>
                </v-container>
              </v-col>
            </v-row>
          </v-container>

          <v-divider></v-divider>

          <div>
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
          </div>
        </v-footer>
      </v-container>
    </v-main>
  </v-layout>
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
  .header-v-col {
    height: 100% !important;
  }
}
</style>