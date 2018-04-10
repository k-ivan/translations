<template>
  <div id="app" class="wrap">

    <header class="header">
      <div class="container">
        <div class="logo">
          Translations Backend
        </div>
      </div>
    </header>

    <div class="content">
      <div class="container">
        <div class="select-lang">
          <label for="lang">Выбор языка</label>
          <select name="lang" id="lang" v-model="code">
            <option v-for="locale in locales" :key="locale.id" :value="locale.code" :selected="locale.code === code">{{locale.name}}</option>
          </select>
        </div>
        <translations :lang="code" />
      </div>
    </div>

    <footer class="footer">
      {{ (new Date).getFullYear() }}
    </footer>
  </div>
</template>

<script>
  import Translations from './components/Translations'

  export default {
    name: 'App',
    components: {
      Translations
    },
    data () {
      return {
        code: localStorage.getItem('lang') || 'en',
        locales: []
      }
    },
    watch: {
      code () {
        localStorage.setItem('lang', this.code)
      }
    },
    created () {
      this.$http.get('languages')
      .then(response => {
        this.locales = response.data
      })
      .catch(console.error)
    }
  }
</script>

<style lang="scss">
  .select-lang {
    top: 0;
    position: sticky;
    margin-bottom: 2rem;
    background-color: #fff;
    z-index: 3;

    select {
      @media(min-width: 480px) {
        max-width: 200px;
      }
    }
  }
</style>
