<template>
  <v-app>
    <div>
      <NuxtPage />
    </div>
    <!-- ===フッター================================ -->
    <v-footer class="bg-grey-darken-3">
      <v-container class="mt-10 pa-0 wide-v-container">
        <v-row class="mx-3">
          <v-col class="pa-0 d-flex justify-center align-center"><v-btn class="custom-card rounded-xl px-8" variant="text">HOME</v-btn></v-col>
          <v-divider vertical></v-divider> <!-- 縦方向の区切り線 -->
          <v-col class="pa-0 d-flex justify-center align-center"><v-btn class="custom-card rounded-xl px-8" variant="text">ABOUT ME</v-btn></v-col>
          <v-divider vertical></v-divider> <!-- 縦方向の区切り線 -->
          <v-col class="pa-0 d-flex justify-center align-center"><v-btn class="custom-card rounded-xl px-8" variant="text">SITE MAP</v-btn></v-col>
          <v-divider vertical></v-divider> <!-- 縦方向の区切り線 -->
          <v-col class="pa-0 d-flex justify-center align-center"><v-btn class="custom-card rounded-xl px-8" variant="text">CONTACT</v-btn></v-col>
        </v-row>
        <v-row class="mt-10 mb-3">
          <v-col class="d-flex flex-column align-center pa-0">
            <span class="font-weight-black text-h4">Tonari no Nakayama</span>
            <span class="text-body-2 mt-1">Engineering blog powered by shin-701</span>
            <div class="mt-5">
              <v-icon class="mx-4 rounded-xl" icon="mdi-twitter" size="x-large" href="https://x.com" target="_blank"></v-icon>
              <v-icon class="mx-4 rounded-xl" icon="mdi-github" size="x-large" href="https://github.com" target="_blank"></v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
    <v-footer class="pa-0 bg-grey-lighten-2">
      <v-container class="pa-0 wide-v-container">
        <div class="d-flex flex-column align-center justify-center text-body-2">© 2024 shin-701</div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.wide-v-container {
  max-width: 1280px;
}

</style>