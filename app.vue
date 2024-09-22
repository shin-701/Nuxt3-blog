<script lang="ts" setup>
import type { Tag } from '~/types/tag'

// ===========================
//  ◆Newtからデータ取得処理
// ===========================
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

// 全タグデータ
const tags = tagData.value?.items;
</script>

<template>
  <v-app>
    <!-- ===ヘッダー================================ -->
    <v-app-bar :elevation="0" class="bg-grey-darken-3">
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none font-weight-black text-white">Tonari no Nakayama ブログ</NuxtLink>
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-heart"></v-btn>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <!-- ===メイン表示================================ -->
    <NuxtPage />
    <!-- ===フッター================================ -->
    <v-footer class="bg-grey-darken-3">
      <v-container class="pa-0" style="max-width: none;">
        <v-container class="mx-0 pa-3 d-flex flex-column">
          <div class="pa-2 d-flex flex-column">
            <span class="font-weight-black text-h5 pa-1">
              <NuxtLink to="/" class="text-decoration-none text-white">Tonari no Nakayama ブログ</NuxtLink>
            </span>
            <span class="text-body-2 px-1">エンジニアとしての日々の学びを投稿するブログです.</span>
          </div>
          <div class="py-2">
            <NuxtLink v-for="tag in tags" :key="tag._id" 
              :to="{ path: `/articlesList`, query: { searchWords: `${tag.slug}` } }" class="text-decoration-none">
              <v-chip class="ma-1 custom-card" color="grey-lighten-2" size="default" variant="flat">#{{ tag.name }}</v-chip>
            </NuxtLink>
          </div>
        </v-container>
        <v-divider></v-divider>
        <v-container class="pa-3 pb-6 d-flex justify-center align-center">
          <NuxtLink to="/" class="text-decoration-none d-flex justify-center align-center">
            <v-btn class="rounded-xl px-8 text-white font-weight-black" variant="text">ホーム</v-btn>
          </NuxtLink>
          <v-divider vertical></v-divider> <!-- 縦方向の区切り線 -->
          <NuxtLink to="/articlesList" class="text-decoration-none d-flex justify-center align-center">
            <v-btn class="rounded-xl px-8 text-white font-weight-black" variant="text">記事一覧</v-btn>
          </NuxtLink>
          <v-divider vertical></v-divider> <!-- 縦方向の区切り線 -->
          <NuxtLink to="/contact" class="text-decoration-none">
            <v-btn class="rounded-xl px-8 text-white font-weight-black" variant="text">お問い合わせ</v-btn>
          </NuxtLink>
        </v-container>
      </v-container>
      </v-footer>
    <v-footer class="pa-0 bg-grey-lighten-2">
      <v-container class="pa-0">
        <div class="d-flex flex-column align-center justify-center text-body-2">© 2024 shin-701</div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style>
.v-container {
  max-width: 1280px;
}
html {
  scroll-padding-top: 80px;
}
</style>