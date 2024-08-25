<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ===========================
//  ◆スクロールアニメーションcss適用
// ===========================
const isFixed = ref(false);
const stickyHeaderRef = ref<HTMLElement | null>(null); // stickyHeaderの型を明示

const handleScroll = () => {
  const stickyHeader = stickyHeaderRef.value;

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
  console.log(stickyHeaderRef.value); // これで stickyHeaderRef が正しく参照できているか確認する
  window.addEventListener('scroll', handleScroll);
});

// コンポーネントが破棄されるときにイベントを削除
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <!-- ===ヘッダーリンク================================ -->
  <v-container ref="stickyHeaderRef" class="pa-0 rounded-xl fixed-header" :class="{ 'fixed-header-top': isFixed }">
    <v-row class="ma-0">
      <v-col class="pa-0">
        <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
          <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">HOME</v-card-title>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
          <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">ABOUT ME</v-card-title>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
          <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">SITE MAP</v-card-title>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card class="custom-card d-flex flex-column w-100 align-center rounded-xl" variant="plain">
          <v-card-title class="pa-0 mx-4 my-4 font-weight-black border-b-md">CONTACT</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.custom-card {
  transition: background-color 0.5s ease;
}
.custom-card:hover {
  background-color: #BCAAA4; /* hover時の背景色 */
}
.fixed-header {
  /* 画面トップまでスクロールした際に固定する */
  max-width: 1760px !important;
  position: sticky;
  top: 0;
  z-index: 9999;
  transition: max-width 0.5s ease;
  background-color: #EEEEEE;
}
.fixed-header-top {
  /* 画面トップまでスクロール時に反映するcss */
  max-width: 1280px !important;
  background-color: #424242;
  color: white;
}
</style>
