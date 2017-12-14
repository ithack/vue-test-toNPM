import Vue from 'vue'
import App from './App.vue'
import Test from './components/index'

import Page from './components/page/page.vue'
Vue.use(Test);
console.log(Test)
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
