<!--
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-12-05 14:24:51
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-05 14:26:30
 * @FilePath: src/Test.vue
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 -->

<!--
 * @Author: cuifan cuifan@isv-tech.com
 * @Date: 2024-11-11 11:55:06
 * @LastEditors: cuifan cuifan@isv-tech.com
 * @LastEditTime: 2024-12-05 14:26:30
 * @FilePath: src/Test.vue
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 -->
<script setup>

</script>

<template>
<div cuifan="Test1">
    <div cuifan="Test2">1</div>
    <div cuifan="Test3">2</div>
    <div v-for="item in 8" :key="item" :cuifan="'Test4_'+item">
        <span :cuifan="'Test5_'+item">{{item}}</span>
        <span :cuifan="'Test6_'+item">{{item}}</span>
    </div>
</div>


</template>

<style scoped>
</style>
