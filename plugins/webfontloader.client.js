// plugins/webfontloader.js

import WebFont from 'webfontloader'

export default defineNuxtPlugin(() => {
  WebFont.load({
    google: {
      families: ['Inter:300,400,500,600,700']
    }
  })
})