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
  },
  css: [
    "vuetify/lib/styles/main.sass"
  ],
  build: {
      transpile: ["vuetify"]
  },
  vite: {
    define: {
        "process.env.DEBUG": false
    },
    // for HMR
    server: {
        watch: {
            usePolling: true
        }
    },
  }
})
