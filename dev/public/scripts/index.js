import Vue from 'vue'
import Vuex from 'vuex'
import { mapState, mapGetters } from 'vuex'

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload()
  })
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    kanjiCount: '...'
  },
  mutations: {
    updateKanjiCount (state, count) {
      state.kanjiCount = count
    }
  },
  getters: {
    kanjiLeft (state) {
      return (state.kanjiCount === '...' ? '...' : Math.max(0, 2200 - state.kanjiCount))
    }
  },
  actions: {
    getData (context) {
      fetch('https://cors.io/?https://kanji.koohii.com/profile/inclu')
        .then(d => d.text())
        .then(d => {
          let kanjiNumberSelector = /<tr><th>Kanji Flashcards<\/th><td><strong>(\d+)<\/strong>/.exec(d)
          if (kanjiNumberSelector !== null && kanjiNumberSelector.length > 1) {
            context.commit('updateKanjiCount', Number(kanjiNumberSelector[1]))
          } else {
            context.commit('updateKanjiCount', 'beb')
          }
        })
        .catch(e => console.error(e))
    }
  }
})

const app = new Vue({
  el: '#app',
  store,
  computed: {
    ...mapState(['kanjiCount']),
    ...mapGetters(['kanjiLeft'])
  },
  methods: {
    startLoop () {
      let self = this
      this.$store.dispatch('getData')
        .then(function () {
          window.setInterval(function () {
            self.$store.dispatch('getData')
          }, 1000 * 30)
        })
    }
  },
  mounted: function () {
    this.startLoop()
  }
})
