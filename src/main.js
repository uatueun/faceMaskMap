/* eslint-disable eol-last */
/* eslint-disable indent */
import Vue from 'vue';
// 載入 vue axios
// import * as Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
// 外部套件往前 自寫套件往後
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
    render: (h) => h(App),
}).$mount('#app');