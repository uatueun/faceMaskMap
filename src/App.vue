<template>
  <div id="app">
    <div class="row no-gutters">
      <div class="col-sm-3">
        <div class="toolbox">
          <div class="sticky-top bg-white shadow-sm p-2">
            <div class="form-group d-flex">
              <label for="cityName" class="mr-2 col-form-label text-right">縣市</label>
              <div class="flex-fill">
                <select id="cityName" class="form-control" v-model="select.city">
                  <option value="">--select One--</option>
                  <option :value="c.CityName" v-for="c in CityCountyData"
                  :key="c.CityName">
                    {{ c.CityName }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group d-flex">
              <label for="area" class="mr-2 col-form-label text-right">地區</label>
              <div class="flex-fill">
                <select id="area" class="form-control">
                  <option value="">-- Select One --</option>
                </select>
              </div>
            </div>
              <p class="mb-0 small text-muted text-right">請先選擇區域查看（綠色表示還有口罩）</p>
            </div>
            <ul class="list-group">
              <template>
                <a class="list-group-item text-left">
                  <h3>藥局名稱</h3>
                  <p class="mb-0">
                    成人口罩：1 | 兒童口罩：2
                  </p>
                  <p class="mb-0">地址：<a href="https://www.google.com.tw/maps/place/..."
                  target="_blank" title="Google Map">
                  地址</a>
                  </p>
                </a>
              </template>
            </ul>
          </div>
        </div>
        <div class="col-sm-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
// 載入鄉鎮資料json
import CityCountyData from './assets/CityCountyData.json';

let osmMap = {};
console.log(L);

export default {
  name: 'App',
  data: () => ({
    data: [],
    CityCountyData,
    select: {
      city: '臺北市',
    },
  }),
  methods: {
    // 更新圖標
    updateMap() {
      const pharmacies = this.data.filter((pharmacy) => console.log(pharmacy));
      console.log(pharmacies);
    },
  },
  mounted() {
    // 聲明藥局口罩資料變數
    const url = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    // 取得遠端資料
    this.$http.get(url).then((response) => {
      this.data = response.data.features;
    });

    osmMap = L.map('map', {
      center: [22.618, 120.317],
      zoom: 15,
    });
    // 圖磚網址 http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
    }).addTo(osmMap);

    // 加入圖標
    L.marker([22.618, 120.317]).addTo(osmMap);
  },
};
</script>

<style lang="scss">
//載入bootstrap.scss
@import 'bootstrap/scss/bootstrap';
#map {
  height: 100%;
}
.highlight {
  background: #e9ffe3;
}
.toolbox {
  height: 100vh;
  overflow-y: auto;
  a {
  cursor: pointer;
  }
}
</style>
