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
const articles = data.value?.items

useHead({
  title: 'Newt・Nuxtブログ',
  meta: [
    { name: 'description', content: 'NewtとNuxtを利用したブログです' }
  ]
})
</script>

<template>
  <div v-for="article in articles" :key="article._id">
    <NuxtLink :to="`/articles/${article.slug}`" class="Article">
      <div class="Article_Eyecatch">
        <img alt="" loading="lazy" width="1000" height="667" decoding="async" data-nimg="1" v-bind:src="article.coverImage.src" style="color: transparent;">
      </div>
      <div class="Article_Data">
        <h3 class="Article_Title">{{ article.title }}</h3>
        <ul class="Article_Tags">
          <li v-for="tag in article.tags" :key="tag._id">
              #{{ tag.name }}
          </li>
        </ul>
        <div class="Article_Author">
          <div class="Article_AuthorEmpty">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="#CCCCCC">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </div>
          <div class="Article_AuthorData">
            <span>Donna Thomason</span>
            <time datetime="12/9/2021">12/9/2021</time>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.Article {
  display: block;
  align-items: center;
  color: #333;
  text-decoration: none;
  overflow: hidden;
  padding: 0;
  margin: 0 0 40px 0;
}
.Article:last-child {
  margin: 0 0 28px 0;
}
.Article_Eyecatch {
  width: 100%;
  height: 0;
  padding: 52.5% 0 0 0;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  margin: 0 0 12px 0;
  position: relative;
}
.Article_Eyecatch > img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.Article_EyecatchEmpty {
  background: #f8f8f8;
  width: 280px;
  height: 147px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Article_Data {
  flex: 1;
}
.Article_Title {
  font-size: 1.8rem;
  line-height: 1.5;
  margin: 0 0 10px;
  padding: 0;
  display: -webkit-box;
  overflow: hidden;
  -line-clamp: 2;
  -webkit-box-orient: vertical;
}
.Article_Tags {
  margin: 0 0 8px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
.Article_Tags li {
  margin: 0 4px 4px 0;
  padding: 0 4px;
  list-style: none;
  font-size: 1.2rem;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
.Article_Author {
  display: flex;
  align-items: center;
}
.Article_Author > img {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin: 0 12px 0 0;
  flex-shrink: 0;
}
.Article_Author img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  font-family: 'object-fit: cover'; /* IE11 */
}
.Article_AuthorEmpty {
  width: 32px;
  height: 32px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  margin: 0 12px 0 0;
  flex-shrink: 0;
}
.Article_AuthorData {
  flex: 1;
}
.Article_AuthorData span {
  font-size: 1.2rem;
  font-weight: 700;
  display: block;
  line-height: 1.5;
}
.Article_AuthorData time {
  font-size: 1.2rem;
  display: block;
  color: #666;
  line-height: 1.5;
}
@media (min-width: 600px) {
  .Article {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 0 36px;
    margin: 0 0 36px;
  }
  .Article:hover .Article_Title {
    text-decoration: underline;
  }
  .Article:last-child {
    border-bottom: none;
    padding: 0 0 20px 0;
  }
  .Article_Eyecatch {
    width: 280px;
    height: 147px;
    margin: 0 28px 0 0;
    padding: 0;
  }
  .Article_Eyecatch img {
    width: 280px;
    height: 147px;
  }
  .Article_Title {
    margin: 0 0 12px;
  }
  .Article_Tags {
    margin: 0 0 16px;
  }
}
</style>