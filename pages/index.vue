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
     =====================================-->
<script lang="ts" setup>
import type { Article } from '~/types/article'

const { data } = await useAsyncData('articles', async () => {
  const { $newtClient } = useNuxtApp()
  return await $newtClient.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    // query: {
    //   select: ['_id', 'title', 'slug', 'body', 'coverImage']
    // }
  })
})
const articles = data.value?.items;

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
        <v-container>
          <v-row justify="center">
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >.v-col-auto</v-sheet></v-col>
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >.v-col-auto</v-sheet></v-col>
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >.v-col-auto</v-sheet></v-col>
            <v-col cols="auto" class="pa-1"><v-sheet class="pa-2 mt-2 mb-3" align="center" >.v-col-auto</v-sheet></v-col>
          </v-row>
        </v-container>
        <!-- ===HP名称・メイン画像================================ -->
        <v-parallax v-bind:src="articles[0].coverImage.src" max-height="600" cover>
          <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h2 class="text-h2 font-weight-thin mb-4">となりの仲山</h2>
            <h4 class="subheading">Build your application today!</h4>
          </div>
        </v-parallax>

        <!-- ===メインコンポーネント================================ -->
        <v-container style="max-width: 1280px;" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="6" md="9" lg="9">
              <!-- ===最新の投稿================================ -->
              <v-container class="bg-white rounded-lg">
                <h2 align="center" justify="center" class="ma-10">最新の投稿</h2>
                <v-row align="stretch" justify="center">
                  <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4" lg="4">
                    <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
                      <v-card variant="text" color="grey-darken-4">
                        <v-img class="h-auto"v-bind:src="article.coverImage.src" cover></v-img>
                        <v-card-item>
                          <v-card-title class="font-weight-black text-subtitle-2" 
                            style="white-space: normal; word-wrap: break-word; word-break: break-word;" 
                            v-text="article.title">
                          </v-card-title>
                          <v-spacer />
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

              <!-- ===おすすめの投稿======================================== -->
              <v-container class="bg-white rounded-lg mt-5">
                <h2 align="center" justify="center" class="ma-10">おすすめの投稿</h2>
                <v-row align="stretch" justify="center">
                  <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4" lg="4">
                    <NuxtLink :to="`/articles/${article.slug}`" class="text-decoration-none">
                      <v-card variant="text" color="grey-darken-4">
                        <v-img class="h-auto"v-bind:src="article.coverImage.src" cover></v-img>
                        <v-card-item>
                          <v-card-title class="font-weight-black text-subtitle-2" 
                            style="white-space: normal; word-wrap: break-word; word-break: break-word;" 
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
            </v-col>
            <!-- ===プロフィールカード================================ -->
            <v-col>
              <v-card>
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

              <!-- ===カテゴリ一覧================================ -->
              <v-container class="bg-white rounded-lg mt-5 pa-0">
                <v-list density="compact">
                  <v-list-subheader class="font-weight-black text-subtitle-1">カテゴリ</v-list-subheader>
                  <v-list-item append-icon="mdi-arrow-right-bold" class="mr-4 ml-4 pa-0 border-b-sm">
                    <v-list-item-title class="font-weight-black text-body-2">ガジェット</v-list-item-title>
                  </v-list-item>
                  <v-list-item append-icon="mdi-arrow-right-bold" class="mr-4 ml-4 pa-0 border-b-sm">
                    <v-list-item-title class="font-weight-black text-body-2">トラベル</v-list-item-title>
                  </v-list-item>
                  <v-list-item append-icon="mdi-arrow-right-bold" class="mr-4 ml-4 pa-0 border-b-sm">
                    <v-list-item-title class="font-weight-black text-body-2">インテリア</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-container>
            </v-col>
          </v-row>
        </v-container>

        <!-- ===フッター================================ -->
        <v-sheet class="bg-grey-lighten-3 pt-16 pb-16">
            <v-card
              class="mx-auto bg-white rounded-lg"
            >
              <v-img
                class="align-end text-white"
                height="200"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                cover
              >
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>

              <v-card-subtitle class="pt-4">
                Number 10
              </v-card-subtitle>

              <v-card-text>
                <div>Whitehaven Beach</div>

                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="orange" text="Share"></v-btn>

                <v-btn color="orange" text="Explore"></v-btn>
              </v-card-actions>
            </v-card>
        </v-sheet>
      </v-sheet>
    </v-main>
  </v-layout>
</template>

