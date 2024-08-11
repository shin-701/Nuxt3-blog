// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja'
      }
    }
  },
  // Runtime Confingは実行時にマッチする環境変数に自動的に置き換えられる
  runtimeConfig: {
    newt: {
      spaceUid: '',
      cdnApiToken: ''
    }
  },
  devtools: { enabled: true },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
