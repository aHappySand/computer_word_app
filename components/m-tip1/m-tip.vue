<template>
	<uni-popup show="true" position="middle" mode="fixed" :h5-top="true" >
		<view class="g-col-333 g-bg-white textBox">
			<view class="uni-center g-fz-16 g-p-12">{{title}}</view>
			<view >
				<view class="g-col-666 g-fz-12 g-pb-12">
					{{content}}
				</view>
			</view>
			<view class="g-col-red g-fz-16 g-tx-c g-mt-12 knowBtn" @click="show">{{closeBtnMsg}}</view>
		</view>
	</uni-popup>
</template>

<script>
    import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		name: 'mTip',
        components:{
          uniPopup
        }
		props: {
			title: {
				type: String,
				default: '关于'
			},
            content: {
            	type: String,
            	default: ''
            },
            closeBtnMsg: {
            	type: String,
            	default: '关闭'
            }
		},
		methods: {

		}
	}
</script>
<style>
	.textBox {
		width: 560upx;
		border-radius: 12upx;
	}
	
	.textBox view {
		line-height: 40upx;
	}
	.textBox1{
		margin:24upx!important;
	}
	.knowBtn{
		position: relative;
	}
	.knowBtn:after{
		position: absolute;
		left: -30upx;
		top: -24upx;
		content: '';
		width: calc(100% + 60upx);
		height: 1px;
		background-color: #ddd;
	}
</style>