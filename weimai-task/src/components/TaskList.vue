<template>
    <div>
        <div class="display-box line1" v-if="status == 0" v-bind:jump="jump" v-on:click="toView(jump)">
            <section class="t1"><span class="icon1"></span></section>
            <section class="flex">
                <p class="p1">{{title}}（{{hadNum}}/{{needNum}}）</p>
                <p class="p2">{{desc}}</p>
            </section>
            <section class="t2">+{{awardNum}}{{awardType == 2 ? '分钟免费视频' : '金豆'}}</section>
			<section class="t5"><span class="arrow1"></span></section>
        </div>
        <div class="display-box line1" v-else-if="status == 1">
            <section class="t1"><span class="icon1"></span></section>
            <section class="flex">
                <p class="p1">{{title}}（{{hadNum}}/{{needNum}}）</p>
                <p class="p2">{{desc}}</p>
            </section>
            <section class="t2">+{{awardNum}}{{awardType == 2 ? '分钟免费视频' : '金豆'}}</section>
            <section class="t3"><span class="rec_btn1" taskid="{{taskId}}"></span></section>
        </div>
        <div class="display-box line1" v-else-if="status == 2">
            <section class="t1"><span class="icon1"></span></section>
            <section class="flex">
                <p class="p1">{{title}}（{{hadNum}}/{{needNum}}）</p>
                <p class="p2">{{desc}}</p>
            </section>
            <section class="t4">已完成</section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'list',
    data() {
        return {
            
        }
    },
    props: {
        taskId: null,
        title: null,
        hadNum: null,
        needNum: null,
        desc: null,
        status: null,
        awardNum: null,
        awardType: null,
        jump: null
    },
    mounted() {
        console.log(this.title);
    },
    methods: {
        toView(jump) {
            // var jump = e.target.getAttribute("jump");
            console.log(jump)
        } 
    },
}
</script>