<template>
  <div class="model_list" id="once_task">
    <div class="display-box line1">
      <section class="t1">
        <span class="icon1" @click="recGold(1)"></span>
      </section>
      <section class="flex">
        <p class="p1">关注（3/3）</p>
        <p class="p2">关注3个感兴趣的人</p>
      </section>
      <section class="t2">+200金豆</section>
      <section class="t3">
        <span class="rec_btn1" @click="recGold(2)"></span>
      </section>
    </div>
    <div class="display-box line1">
      <section class="t1"><span class="icon1"></span></section>
      <section class="flex">
        <p class="p1">录语音签名（0/1）</p>
        <p class="p2">用户心录制一段你的语音签名</p>
      </section>
      <section class="t4">已完成</section>
    </div>
    <div class="display-box line1">
      <section class="t1"><span class="icon1"></span></section>
      <section class="flex">
        <p class="p1">拨打视频通话（0/1）</p>
        <p class="p2">用户心录制一段你的语音签名</p>
      </section>
      <section class="t2">+500金豆</section>
      <section class="t5"><span class="arrow1"></span></section>
    </div>
  </div>
</template>

<style scoped>
.model_list {
  padding: 4px 0;
  margin: 0 16px;
  border-radius: 20px;
  background-color: #fff;
}
.model_list .line1 {
  padding: 24px 22px;
  border-bottom: 2px solid #f1f1f1;
}
.model_list .line1:last-child {
  border: none;
}
.model_list .t1 {
  padding: 8px 16px 0 0;
}
.icon1 {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(/style/img/icon1.png) no-repeat scroll 0 0 transparent;
  vertical-align: top;
}
.model_list .p1 {
  font: 24px/32px normal;
}
.model_list .p2 {
  font: 18px/24px normal;
  color: #6d7278;
}
.model_list .t2 {
  padding: 10px;
  color: #ff7bc0;
  white-space: nowrap;
}
.model_list .t3 {
  padding: 7px 0;
}
.model_list .rec_btn1 {
  display: inline-block;
  width: 92px;
  height: 42px;
  background: url(/style/img/rec_btn1.png) no-repeat scroll 0 0 transparent;
  background-size: 92px 42px;
  vertical-align: top;
}
.model_list .t4 {
  padding: 10px 0;
  color: #6d7278;
  white-space: nowrap;
}
.model_list .t5 {
  padding: 16px 0;
}
.arrow1 {
  display: block;
  width: 14px;
  height: 24px;
  background: url(/style/img/arrow1.png) no-repeat scroll 0 0 transparent;
  background-size: 14px 24px;
}
</style>

<script>
import Msg from "@/components/msg.js";
export default {
  methods: {
    recGold: function (goodsId) {
      Msg.$emit("val", goodsId);
    },
  },
};
</script>
