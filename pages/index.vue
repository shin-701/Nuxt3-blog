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

useHead({
  title: 'Newt・Nuxtブログ',
  meta: [
    { name: 'description', content: 'NewtとNuxtを利用したブログです' }
  ]
})
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-main class="align-center justify-center" style="min-height: 300px;">
      <v-sheet class="bg-grey-lighten-3">
        <!-- ===ヘッダー======================================== -->
        <v-container  class="d-flex mx-auto">
          <v-text class="text-auto font-weight-black">Tonari no Nakayama</v-text>
          <v-row justify="center">
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >ABOUT</v-sheet></v-col>
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >CONTACT</v-sheet></v-col>
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >.v-col-auto</v-sheet></v-col>
          </v-row>
        </v-container>
        <!-- ===HP名称・メイン画像================================ -->
        <v-parallax v-bind:src="articles[0].coverImage.src" max-height="600" cover>
          <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h2 class="text-h1 font-weight-black mb-4">Tonari no Nakayama</h2>
            <h4 class="text-h5">Engineering blog powered by shin-701</h4>
          </div>
        </v-parallax>

        <!-- ===メインコンポーネント================================ -->
        <v-container style="margin-top: -100px; position: relative;">
          <v-row>
            <v-col cols="12" lg="9">
              <!-- ===おすすめの投稿=======================¬========= -->
              <v-container class="bg-white rounded-lg pa-12">
                <v-row align="stretch" justify="center">
                  <h2 align="center" justify="center">おすすめの投稿</h2>
                </v-row>
                <v-row align="stretch" justify="start">
                  <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4" lg="4" class="pa-0">
                    <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
                      <v-card variant="text" color="grey-darken-4" class="mx-3 mt-6">
                        <v-img class="h-auto rounded-lg" v-bind:src="article.coverImage.src" cover></v-img>
                        <v-card-item class="pa-0 mt-3">
                          <v-card-title class="font-weight-black text-subtitle-2" 
                            style="white-space: normal; line-height: 1.4;" 
                            v-text="article.title">
                          </v-card-title>
                          <v-card-subtitle  class="mt-2 text-caption">
                            <time :datetime="article._sys.raw.firstPublishedAt">{{ formatDate(article._sys.raw.firstPublishedAt) }}</time>
                          </v-card-subtitle>
                          <v-chip v-for="tag in article.tags" :key="tag._id" density="compact" size="small">
                            #{{ tag.name }}
                          </v-chip>
                        </v-card-item>
                      </v-card>
                    </NuxtLink>
                  </v-col>
                </v-row>
              </v-container>
              <!-- ===新着記事======================================== -->
              <v-container class="bg-white rounded-lg pa-12 mt-12">
                <h2 align="center" justify="center">新着記事</h2>
                <div v-for="article in articles" :key="article._id">
                  <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
                    <v-card variant="text" color="grey-darken-4" class="mt-6">
                      <div class="d-flex d-flex-column">
                        <v-img class="h-auto rounded-lg" v-bind:src="article.coverImage.src" cover></v-img>
                        <v-card-item style="width: 65%;">
                          <v-card-title class="font-weight-black text-subtitle-1" 
                            style="white-space: normal; word-wrap: break-word; word-break: break-word; line-height: 1.4;" 
                            v-text="article.title">
                          </v-card-title>
                          <v-spacer />
                          <v-card-subtitle  class="mt-2 text-caption">
                            <time :datetime="article._sys.raw.firstPublishedAt">{{ formatDate(article._sys.raw.firstPublishedAt) }}</time>
                          </v-card-subtitle>
                          <v-chip v-for="tag in article.tags" :key="tag._id" density="compact" size="small">
                            #{{ tag.slug }}
                          </v-chip>
                        </v-card-item>
                      </div>
                    </v-card>
                  </NuxtLink>
                </div>
              </v-container>
            </v-col>
            <!-- ===プロフィールカード================================ -->
            <v-col>
              <v-container class="pa-0 mt-0">
                <v-card class="rounded-lg">
                  <!-- 背景画像 -->
                  <v-img v-bind:src="articles[2].coverImage.src" class="d-block">
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
                    <v-btn class="bg-grey-lighten-3 ma-2" color="purple" icon="mdi-twitter" href="https://x.com" target="_blank"></v-btn>
                    <v-btn class="bg-grey-lighten-3 ma-2" color="purple" icon="mdi-github" href="ttps://github.com" target="_blank"></v-btn>
                  </v-card-actions>
                </v-card>
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
            </v-col>
          </v-row>
          <!-- ===フッター================================ -->
          <v-container class="ma-0 mt-12 pa-0">
            <v-row align="center" justify="space-between">
              <!-- 左側: 会社情報 -->
              <v-col cols="12" md="6">
                <p class="white--text mb-0">&copy; 2024 Tonari no Nakayama. All rights reserved.</p>
              </v-col>

              <!-- 右側: ソーシャルメディアのアイコン -->
              <v-col cols="12" md="6" class="text-center text-md-right">
                <v-btn icon color="white">
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn icon color="white">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon color="white">
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
                <v-btn icon color="white">
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-sheet>
    </v-main>
  </v-layout>
</template>

<style scoped>
.v-container {
      max-width: 1380px;
  }

@media (max-width: 1280px) {
  .v-container {
      max-width: 100%;
  }
}

</style>