<template>
  <div name="show">
    <ul>
      <li v-for="goods in list" :key="goods.goodName">
        <img v-bind:src="goods.img" />
        <p>{{ goods.goodName }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "show",
  data() {
    var _this = this;
    var url = "";
    if (_this.goodsId == 1) {
      url = "json/bjb.json";
    } else if (_this.goodsId == 2) {
      url = "json/sj.json";
    } else {
      url = "json/bjb.json";
    }
    _this.$http.get(url).then(function (res) {
      _this.list = res.data;
    });
    return {
      list: [],
    };
  },
  props: {
    goodsId: Number,
  },
  watch: {
    goodsId() {
      var _this = this;
      var url = "";
      if (_this.goodsId == 1) {
        url = "json/bjb.json";
      } else if (_this.goodsId == 2) {
        url = "json/sj.json";
      } else {
        url = "json/bjb.json";
      }

      _this.$http.get(url).then(function (res) {
        _this.list = res.data;
      });
      return {
        list: [],
      };
    },
  },
};
</script>
