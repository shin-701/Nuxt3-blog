<script lang="ts" setup>
// マウント時にスクロールイベントを追加
onMounted(() => {
  $(".raindrops").raindrops({
    color:'#CFD8DC',//水の色を指定
    canvasHeight:220, //canvasの高さを指定。初期値は親の高さの50%。
    waveLength: 100,//波の長さ(広がり)を指定。数値が大きいほど長さは小さくなる。初期値は340。
    waveHeight:150,//波の高さを指定。数値が大きいほど高さは高くなる。初期値は100。
    rippleSpeed: 0.05, //波紋のスピードを指定。数値が大きいほど波紋は速くなる。初期値は0.1。
    density: 0.04,//水の波紋の量を指定。数値が大きいほど波紋は小さくなる。初期値は0.02。
    frequency:5//雨粒の落ちる頻度を指定。数値が大きいほど頻度は多くなる。初期値は
  });

});

// ===========================
//  ◆Head情報
// ===========================
useHead({
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
  ]
})
</script>

<template>
    <v-container class="pa-0" style="height: 250px; max-width: none;">
      <v-card class="raindrops fill-height bg-grey-lighten-3" variant="text">
        <div style="z-index:1;" class="d-flex flex-column">
          <span class="font-weight-black px-16 py-3 text-h3 text-center">
            <NuxtLink to="/" class="text-decoration-none text-black">Tonari no Nakayama</NuxtLink>
          </span>
          <span class="d-flex justify-center text-grey-darken-2 text-sm-h6 text-subtitle-1">Engineering blog powered by shin-701</span>
        </div>
      </v-card>
    </v-container>
    <div class="py-8 hidden-xs"></div> <!-- 空白調整 -->
</template>

<style scoped>
.v-container {
  max-width: 1280px;
}

.raindrops {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>