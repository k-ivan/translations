<template>
  <div>
    <backdrop v-if="showModal"/>
    <modal v-if="showModal" @close="showModal = false">

      <form action="#0" @submit.prevent="addTranslation">
        <div class="form-group">
          <label for="name">Имя</label>
          <input class="form-input" type="text" v-model.trim="name" id="name" placeholder="Имя" required>
        </div>
        <div class="form-group">
          <label for="snippet">Сниппет</label>
          <input class="form-input" type="text" v-model.trim="snippet" id="snippet" placeholder="Сниппет" required>
        </div>

        <div class="text-right">
          <button type="button" class="btn btn--clear" @click="showModal = false">Отмена</button>
          <button class="btn btn--primary" :class="{'is-loading': this.loading}">Добавить</button>
        </div>
      </form>

    </modal>

    <div class="translation">

      <div class="translation__control">
        <button class="btn btn--primary" @click="showModal = true">Добавить перевод</button>
      </div>

      <div class="translation__content tbl-responsive">
        <table v-if="translations.length" class="tbl tbl--horizontal-bordered">
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>snippet</th>
                <th>created</th>
                <th>updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in translations" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td class="snippet" :class="{'snippet--editing': item == snippetEdited}">
                  <div class="snippet__value">{{ item.snippet }}</div>
                  <button class="snippet__btn" @click="editTranslation(item)">
                    <svg version="1.1" width="16" height="16"  viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"></path><path class="clr-i-solid clr-i-solid-path-2" d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"></path>
                    </svg>
                  </button>
                  <input class="snippet__edit" type="text"
                    v-model="item.snippet"
                    v-snippet-focus="item == snippetEdited"
                    @blur="cancelTranslation(item)"
                    @keyup.enter="updateTranslation(item)"
                    @keyup.esc="cancelTranslation(item)">
                </td>
                <td>{{ item.created | dateFormat(lang) }}</td>
                <td>{{ item.updated | dateFormat(lang) }}</td>
              </tr>
            </tbody>
          </table>
      </div>

    </div>

  </div>
</template>

<script>
import Modal from '../components/Modal'
import Backdrop from '../components/Backdrop'

export default {
  name: 'Translations',
  components: {
    Modal,
    Backdrop
  },
  props: {
    lang: {
      type: String,
      default: 'ru'
    }
  },
  data () {
    return {
      showModal        : false,
      snippet          : null,
      snippetEdited    : null,
      snippetBeforeEdit: null,
      name             : null,
      loading          : false,
      evtStream        : null,
      translations     : []
    }
  },
  filters: {
    dateFormat (value, lang) {
      const options = { year: 'numeric', month: 'numeric',  day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Intl.DateTimeFormat(lang, options)
      .format(value * 1000);
    }
  },
  directives: {
    'snippet-focus' (el) {
      el.focus()
    }
  },
  watch: {
    lang () {
      this.fetchTranslations()
    }
  },
  created () {
    this.fetchTranslations()
  },
  mounted () {
    const url = `${this.$http.defaults.baseURL}/stream`;

    this.evtStream = new EventSource( url, { withCredentials: true } );
    this.evtStream.addEventListener('translations', this.stream);
  },
  beforeDestroy () {
    this.evtStream.removeEventListener('translations', this.stream);
    this.evtStream.close();
  },
  methods: {
    fetchTranslations () {
      this.$http.get('translations', {
        withCredentials: true,
        headers: {
          'Accept-Language': this.lang,
        }
      })
      .then(response => {
        this.translations = response.data
      })
      .catch(console.error)
    },
    stream (e) {
      // const translation = JSON.parse(e.data);

      // const isCreate = this.translations.every(item => {
      //   return item.id !== translation.id;
      // })

      // isCreate && this.translations.push(translation)
      this.fetchTranslations()
    },
    editTranslation (item) {
      this.snippetBeforeEdit = item.snippet
      this.snippetEdited = item
    },
    updateTranslation (item) {
      if (!this.snippetEdited) {
        return;
      }
      this.snippetEdited = null
      this.snippetBeforeEdit = null

      this.$http.put(`translation/${item.id}`, JSON.stringify({ snippet: item.snippet }), {
        withCredentials: true,
        crossDomain: true,
        headers: {
          'Accept-Language': this.lang,
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(response => {
        })
        .catch(err => {
          console.error(err)
        })
    },
    cancelTranslation (item) {
      this.snippetEdited = null
      this.snippetBeforeEdit && (item.snippet = this.snippetBeforeEdit)
    },
    addTranslation () {

      this.loading = true

      const json = {
        name: this.name,
        snippet: this.snippet
      }

      this.$http.post('translation', JSON.stringify(json), {
        withCredentials: true,
        headers: {
          'Accept-Language': this.lang,
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(response => {
          this.loading = false

          this.name = ''
          this.snippet = ''
          this.showModal = false
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss">
  .translation {
    &__content {
      margin-top: 2rem;
    }
  }
  .snippet {
    position: relative;

    &:hover &__btn {
      opacity: 1;
    }

    &--editing &__edit {
      display: block;
    }

    &__value {
      padding-right: 40px;
    }

    &__btn {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      height: 28px;
      margin: auto;
      display: flex;
      align-items: center;
      border: 0;
      border-radius: 50%;
      background-color: transparent;
      transition: all .3s;
      opacity: 0;
      cursor: pointer;
      outline: 0;

      &:hover {
        background-color: #f1f1f1;
      }

      &:focus {
        box-shadow: 0 2px 8px rgba(0,0,0,.1)
      }

      &:active {
        background-color: #ddd;
      }

      svg {
        opacity: 0.7;
      }
    }

    &__edit {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding: 0.35rem 0.875rem;
      font-size: inherit;
      font-family: inherit;
    }
  }
</style>
