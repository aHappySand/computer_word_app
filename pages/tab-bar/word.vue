<template>
	<view>
		<view>
			
		</view>
		<view>
			<uni-indexed-list :options="list" :show-select="false" @click="bindClick" />
		</view>
	</view>
</template>

<script>
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
	export default {
		components: {
			uniIndexedList
		},
		data() {
			return {
				list: [{
						"letter": "A",
						"data": [
							"阿克苏机场",
							"阿拉山口机场",
							"阿勒泰机场",
							"阿里昆莎机场",
							"安庆天柱山机场",
							"澳门国际机场"
						]
					}, {
						"letter": "B",
						"data": [
							"保山机场",
							"包头机场",
							"北海福成机场",
							"北京南苑机场",
							"北京首都国际机场"
						]
					}, {
						"letter": "C",
						"data": [
							"长白山机场",
							"长春龙嘉国际机场",
							"常德桃花源机场",
							"昌都邦达机场",
							"长沙黄花国际机场",
							"长治王村机场",
							"常州奔牛机场",
							"成都双流国际机场",
							"赤峰机场"
						]
					}]
			}
		},
		methods: {
			bindClick(e) {
				console.log('点击item，返回数据' + JSON.stringify(e))
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4
	}
	
	view {
		font-size: 28upx;
		line-height: inherit
	}
</style>
