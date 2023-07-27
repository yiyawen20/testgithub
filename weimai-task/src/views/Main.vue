<template>
  <div class="main">
			<div class="banner"><img src="style/img/banner.jpg"></div>
			<div v-if="list.length > 0">
				<div class="title1"><p>新手任务</p></div>
				<div class="model_list">
					<TaskList
						v-for="task in list"
						:key="task.taskId"
						v-bind:title="task.title"
						v-bind:hadNum="task.hadNum"
						v-bind:needNum="task.needNum"
						v-bind:desc="task.desc"
						v-bind:status="task.status"
						v-bind:awardNum="task.awardNum"
						v-bind:awardType="task.awardType"
						v-bind:jump="task.jump"
					></TaskList>
				</div>
			</div>
			<div v-if="dailyList.length > 0" style="padding: 10px 0 40px;">
				<div class="title1"><p>每日任务</p></div>
				<div class="model_list">
					<TaskList
						v-for="task in dailyList"
						:key="task.taskId"
						v-bind:title="task.title"
						v-bind:hadNum="task.hadNum"
						v-bind:needNum="task.needNum"
						v-bind:desc="task.desc"
						v-bind:status="task.status"
						v-bind:awardNum="task.awardNum"
						v-bind:awardType="task.awardType"
						v-bind:jump="task.jump"
					></TaskList>
				</div>
			</div>
		</div>
</template>

<style>
.main{width: 750px; font: 24px/36px normal;}
.banner img{width: 100%; vertical-align: top;}
.title1{padding: 10px 16px 16px; font-weight: bold;}
.model_list{padding: 4px 0; margin: 0 16px; border-radius: 20px; background-color: #fff;}

.model_list .line1{padding: 24px 22px; border-bottom: 2px solid #F1F1F1;}
.model_list .line1:last-child{border: none;}
.model_list .t1{padding: 8px 16px 0 0;}
.icon1{display: inline-block; width: 40px; height: 40px; background: url(/style/img/icon1.png) no-repeat scroll 0 0 transparent; vertical-align: top;}
.model_list .p1{font: 24px/32px normal;}
.model_list .p2{font: 18px/24px normal; color: #6D7278;}
.model_list .t2{padding: 10px; color: #FF7BC0; white-space: nowrap;}
.model_list .t3{padding: 7px 0;}
.model_list .rec_btn1{display: inline-block; width: 92px; height: 42px; background: url(/style/img/rec_btn1.png) no-repeat scroll 0 0 transparent; background-size: 92px 42px; vertical-align: top;}
.model_list .t4{padding: 10px 0; color: #6D7278; white-space: nowrap;}
.model_list .t5{padding: 16px 0;}
.arrow1{display: block; width: 14px; height: 24px; background: url(/style/img/arrow1.png) no-repeat scroll 0 0 transparent; background-size: 14px 24px; vertical-align: top;}
</style>

<script>
// @ is an alias to /src
import TaskList from '@/components/TaskList.vue'
import {defineComponent, getCurrentInstance} from "vue"

export default defineComponent({
  name: 'Main',
  data() {
	  return {
		  dailyList: [],
		  list: []
	  };
  },
  components: {
    TaskList
  },
  mounted(){
	  var _this = this;
	  var query=_this.$route.query;
	  var {proxy} = getCurrentInstance();
      proxy.$http.get(proxy.$global.etpServer+"v1/task/getInfo?userId="+query.userId).then((res) => {
		  var data = res.data;
          _this.dailyList = data.data.dailyList;
          _this.list = data.data.list;
      });
  },
  setup(props, context) {}
})
</script>
