<template>
  <div class="about">
    <h1 class="test1">This is an about page</h1>
  </div>
</template>

<style scoped>
@import "../style/test1.css";
</style>

<script>
import { myfun } from "../js/test1.js";
// console.log(myfun())
export default {
  data() {
    return {
      testvalue: "",
    };
  },
  methods: {
    diyfun: function () {
      myfun();
    },
  },
};
</script>
