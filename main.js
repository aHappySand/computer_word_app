import Vue from 'vue'
import App from './App'

import store from './store'

import api from '@/common/http/index';
console.log(api);

// #ifdef APP-PLUS
import DB from '@/common/js/table';
// #endif
// var DB = table();

import {showToast, saveWordDetail} from '@/common/js/common';

Vue.config.productionTip = false

Vue.prototype.$showToast=showToast;
Vue.prototype.$saveWordDetail = saveWordDetail;
Vue.prototype.$store = store
Vue.prototype.$api = api
// #ifdef APP-PLUS
Vue.prototype.$DB = DB;
// #endif

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
