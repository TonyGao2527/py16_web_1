<!--  
项目页 右侧 顶部 标签
-->

<template>
	<h1>项目页 右侧 顶部 标签</h1>
	<div class="tags">
		<!-- 如何使用state中数据 src/store/index.js -->
		<!-- 使用 state 方式一：$store.state.全局数据名称 -->
		<br />使用 state 方式一：
		<el-tag> {{ $store.state.tags }} </el-tag>
		<el-tag> {{ $store.state.username }} </el-tag>
		<el-tag> {{ $store.state.age }} </el-tag>

		<!-- 使用 state 方式三：创建方法，再引用 -->
		<br />使用 state 方式二：
		<el-tag> {{ username1 }} </el-tag>
		<el-tag> {{ age1 }} </el-tag>

		<!-- 使用 state 方式二：...mapState方法映射 -->
		<br />使用 state 方式三
		<el-tag> {{ username }} </el-tag>
		<el-tag> {{ age }} </el-tag>
		
		<!-- 修改state 方式一 --> <br />
		<el-button type="primary" @click="changUsername('xiuyu002')">修改名字 方式一</el-button>
		<el-button type="primary" @click="changeAge('18')">修改年龄 方式一</el-button>
	
	
		<!-- 修改state 方式二 --> <br />
		<el-button type="primary" @click="updateTags(['apple','dogs'])">修改标签 方式二</el-button>
		<el-button type="primary" @click="updateUsername('xiuyu003')">修改年龄 方式二</el-button>
		<el-button type="primary" @click="updateAge('100')">修改年龄 方式二</el-button>
	</div>

</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';

	export default {
		computed: {
			// 使用 state 方式三：
			username1() {
				return this.$store.state.username;
			},
			age1() {
				return this.$store.state.age;
			},

			// 使用 state 方式二 ...mapState  将stone.state与method方法一对一映射
			...mapState(['username', 'age'])
		},
		
		methods:{
			// 修改 state 方式一（不推荐）： this.$store.commit('mutations中的方法名称', 参数)
			changUsername(newName){
				this.$store.commit('updateUsername', newName);
			},
			changeAge(newAge){
				this.$store.commit('updateAge', newAge);
			},
			// 修改 state 方式二（更好用）：...mapMutations 将stone.mutations与method方法一对一映射
			...mapMutations(['updateTags','updateUsername','updateAge'])
		}
	}
</script>

<style>
	
</style>