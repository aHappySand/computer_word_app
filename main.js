import Vue from 'vue'
import App from './App'

import store from './store'

import api from '@/common/http/index';
console.log(api);


// import DB from '@/common/js/table';
// var DB = table();

import {showToast, saveWordDetail} from '@/common/js/common';

Vue.config.productionTip = false

Vue.prototype.$showToast=showToast;
Vue.prototype.$saveWordDetail = saveWordDetail;
Vue.prototype.$store = store
Vue.prototype.$api = api
// Vue.prototype.$DB = DB;

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
