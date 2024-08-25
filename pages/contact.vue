<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import type { Article } from '~/types/article'

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


// マウント時にスクロールイベントを追加
onMounted(() => {
window.addEventListener('scroll', handleScroll);
});

// コンポーネントが破棄されるときにイベントを削除
onBeforeUnmount(() => {
window.removeEventListener('scroll', handleScroll);
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
    <v-container ref="stickyHeader" class="pa-0 wide-v-container rounded-xl fixed-header" :class="{ 'fixed-header-top': isFixed }">
    <v-row class="ma-0">
        <v-col class="pa-0">
        <NuxtLink to="/aboutMe" class="text-decoration-none">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
            <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                :class="{ 'fixed-color': isFixed }">ABOUT ME</v-card-title>
            </v-card>
        </NuxtLink>
        </v-col>
        <v-col class="pa-0">
        <NuxtLink to="/articles/articlesList" class="text-decoration-none">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
                <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                :class="{ 'fixed-color': isFixed }">ARTICLES</v-card-title>
            </v-card>
        </NuxtLink>
        </v-col>
        <v-col class="pa-0">
        <NuxtLink to="/siteMap" class="text-decoration-none">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
            <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md"
                :class="{ 'fixed-color': isFixed }">SITE MAP</v-card-title>
            </v-card>
        </NuxtLink>
        </v-col>
        <v-col class="pa-0">
        <NuxtLink to="/contact" class="text-decoration-none">
            <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
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
    max-width: 900px;
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