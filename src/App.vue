<template>
	<router-view />
</template>

<script>
	export default {
		// 钩子函数，通常组件是页面渲染前操作，这里根组件APP创建之后；
		created() {
			// 步骤1 存 
			// 在刷新页面之前，先将store保存会话存储区域
			// 刷新页面将vue保存在sessionStoragee中
			// 第一个参数 'beforeunload' 在刷新之前；
			// 第二个参数是匿名函数，在匿名函数中实现存储；
			window.addEventListener('beforeunload', () => {
				// 不是store所有都保存 只保存store.state
				// state是对象 要转化成JSON字符串
				// 本地、浏览器会话存储，只能接受字符串传参
				sessionStorage.setItem('messageStore', JSON.stringify(this.$store.state));
			});

			// 步骤2  取变量接收。 
			// 在页面加载显示之前，可以从浏览器会话存储区域取出store
			const storeData = sessionStorage.getItem('messageStore');

			// 步骤3 判断解析 再 覆盖store对象
			// 判断如果不为空
			// 点了刷新storeData才会有值，从登录一步步操作的则无值；
			if (storeData) {
				// store不能直接通过=等号赋值修改，所以用以下方式修改替换；
				// $store.replaceState 是 Vuex 中的一个方法，用于替换整个 Vuex store 的状态。
				this.$store.replaceState(
					// Object.assign(目标，源) 是一个 JavaScript 方法，用于将一个或多个源对象的属性复制到目标对象中。
					//    它将源对象的属性合并到目标对象中，并返回目标对象。
					// JSON.parse(storeData) 将 JSON 字符串解析为 JavaScript 对象；
					Object.assign(this.$store.state, JSON.parse(storeData))
				);
			}
		}
	}
</script>


<style></style>