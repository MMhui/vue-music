import 'babel-polyfill';
import Fastclick from 'fastclick';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import VueLazyLoad from 'vue-lazyload';

import 'common/stylus/index.styl';

Fastclick.attach(document.body);
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
