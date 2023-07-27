<template>
  <div class="main">
    <div class="banner"><img src="style/img/banner.jpg" /></div>
    <div>
      <div class="title1">
        <p>新手任务{{ kk }}</p>
      </div>
      <List></List>
    </div>
    <div style="padding: 10px 0 40px">
      <div class="title1"><p>每日任务</p></div>
      <List></List>
    </div>
    <div v-if="kk == 1">
      <GoodsList :goodsId="1"></GoodsList>
    </div>
    <div v-else-if="kk == 2">
      <GoodsList :goodsId="2"></GoodsList>
    </div>
    <div v-else>
      <GoodsList :goodsId="0"></GoodsList>
    </div>
  </div>
</template>

<style scoped>
.activity_panel_common {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
}

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-color: #000;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}

.blank_tips1 {
  padding: 24px 0 0;
  text-align: center;
}

.main {
  width: 750px;
  font: 24px/36px normal;
}

.banner img {
  width: 100%;
  vertical-align: top;
}

.title1 {
  padding: 10px 16px 16px;
  font-weight: bold;
}
</style>

<script>
import List from "@/components/List.vue";
import Msg from "@/components/msg.js";
import GoodsList from "@/components/goodsList.vue";

export default {
  data() {
    return {
      kk: 0,
    };
  },
  components: {
    List,
    GoodsList,
  },
  mounted() {
    var _this = this;
    Msg.$on("val", function (m) {
      _this.kk = m;
    });
  },
};
</script>
