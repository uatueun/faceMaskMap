<template>
  <div id="app">
    <header class="hd">
      <div class="hd_left">
        <img src="~@/assets/img/logo.png" alt="">
        <a href="#">口罩即時查</a>
      </div>
      <div class="hd_right"></div>
    </header>
    <div class="row no-gutters">
      <div class="col-sm-3">
        <div class="toolbox">
          <div class="sticky-top bg-white shadow-sm p-2">
            <div class="form-group d-flex">
              <label for="cityName" class="mr-2 col-form-label text-right">縣市</label>
              <div class="flex-fill">
                <select id="cityName" class="form-control"
                v-model="select.city" @change="removeMarker(); updateMap()">
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
      city: '高雄市',
    },
  }),
  methods: {
    // 更新圖標
    updateMap() {
      const pharmacies = this.data.filter((pharmacy) => (
        pharmacy.properties.county === this.select.city));
      pharmacies.forEach((pharmacy) => {
        const { properties, geometry } = pharmacy;
        L.marker([
          geometry.coordinates[1],
          geometry.coordinates[0],
          // 寫入圖標內容
        ]).addTo(osmMap).bindPopup(`
        <h5>${properties.name}</h5> <br>
        口罩剩餘：成人-${properties.mask_adult}｜兒童-${properties.mask_child}<br>
        地址：<a href="https://www.google.com/maps/place/${properties.address}">${properties.address}</a><br>
        電話：${properties.phone}<br>
        備註：${properties.note}<br>
        <small>最後更新時間：${properties.updated}</small>`);
        console.log(properties);
      });
      this.penTo(pharmacies[0]);
    },
    removeMarker() {
      osmMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          osmMap.removeLayer(layer);
        }
      });
    },
    penTo(item) {
      const { properties, geometry } = item;
      console.log(properties);
      osmMap.panTo([geometry.coordinates[1], geometry.coordinates[0]]);
    },
  },
  mounted() {
    // 聲明藥局口罩資料變數
    const url = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    // 取得遠端資料
    this.$http.get(url).then((response) => {
      this.data = response.data.features;
      this.updateMap();
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
  background-color: #fafafa;
  a {
  cursor: pointer;
  }
}
.hd {
  height: 110px;
  width: 100%;
  position: relative;
  .hd_left{
    position: absolute;
    left: 0px;
    width: 50%;
    font-family: 'MElle HK Xbold';
    font-size: 22pt;
    line-height: 110px;
    img {
      margin-left: 55px;
      margin-bottom: 10px;
      width: 10%;
    }
    a {
      margin-left: 20px;
      color: #34495e;
      text-decoration:none
    }
  }
}
</style>
