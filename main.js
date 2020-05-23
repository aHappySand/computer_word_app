import Vue from 'vue'
import App from './App'

import store from './store'

import api from '@/common/http/index';


// import DB from '@/common/js/db';

import showToast from '@/common/js/common';

Vue.config.productionTip = false

Vue.prototype.$showToast=showToast;  
Vue.prototype.$store = store
Vue.prototype.$api = api
// Vue.prototype.$DB = DB;

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
