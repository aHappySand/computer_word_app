<template>
	<view>
		<view v-show="show" :style="{ top: offsetTop + 'px' }" class="uni-mask" @click="hide" @touchmove.stop.prevent="moveHandle" />
		<view v-show="show" :class="'uni-popup-' + position + ' ' + 'uni-popup-' + mode" class="uni-popup">
			<view class="g-col-333 g-bg-white textBox">
				<view class="uni-center g-fz-16 g-p-12">{{title}}</view>
				<view >
					<view class="g-col-666 g-fz-14 g-pb-12">
						{{content}}
					</view>
				</view>
				<view class="g-col-red g-fz-16 g-tx-c g-mt-12 knowBtn" @click="hide">{{closeBtnMsg}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopup',
		props: {
			/**
			 * 页面显示
			 */
			show: {
				type: Boolean,
				default: false
			},
			/**
			 * 对齐方式
			 */
			position: {
				type: String,
				// top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			/**
			 * 显示模式
			 */
			mode: {
				type: String,
				default: 'fixed'
			},
			/**
			 * 标题
			 */
			title: {
				type: String,
				default: ''
			},
            /**
             * 内容
             */
            content: {
            	type: String,
            	default: ''
            },
            closeBtnMsg:{
                type: String,
                default: '关闭'
            },
			/**
			 * h5遮罩是否到顶
			 */
			h5Top: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				offsetTop: 0
			}
		},
		watch: {
			h5Top(newVal) {
				if (newVal) {
					this.offsetTop = 44
				} else {
					this.offsetTop = 0
				}
			}
		},
		created() {
			let offsetTop = 0
			// #ifdef H5
			if (!this.h5Top) {
				offsetTop = 44
			} else {
				offsetTop = 0
			}
			// #endif
			this.offsetTop = offsetTop
		},
		methods: {
			hide() {
				if (this.mode === 'insert' && this.position === 'middle') return
				this.$emit('hidePopup')
			},
			closeMask() {
				if (this.mode === 'insert') {
					this.$emit('hidePopup')
				}
			},
			moveHandle() {}
		}
	}
</script>
<style>
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.uni-popup {
		position: fixed;
		z-index: 999;
		background-color: #ffffff;
	}

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.uni-popup-middle.uni-popup-insert {
		min-width: 380upx;
		min-height: 380upx;
		max-width: 100%;
		max-height: 80%;
		transform: translate(-50%, -65%);
		background: none;
		box-shadow: none;
	}

	.uni-popup-middle.uni-popup-fixed {
		border-radius: 10upx;
		padding: 30upx;
	}

	.uni-close-bottom,
	.uni-close-right {
		position: absolute;
		bottom: -180upx;
		text-align: center;
		border-radius: 50%;
		color: #f5f5f5;
		font-size: 60upx;
		font-weight: bold;
		opacity: 0.8;
		z-index: -1;
	}

	.uni-close-bottom {
		margin: auto;
		left: 0;
		right: 0;
	}

	.uni-close-right {
		right: -60upx;
		top: -80upx;
	}

	.uni-close-bottom:after {
		content: '';
		position: absolute;
		width: 0px;
		border: 1px #f5f5f5 solid;
		top: -200upx;
		bottom: 56upx;
		left: 50%;
		transform: translate(-50%, -0%);
		opacity: 0.8;
	}

	.uni-popup-top,
	.uni-popup-bottom {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}

	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		min-height: 100upx;
		line-height: 100upx;
		text-align: center;
	}
    
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