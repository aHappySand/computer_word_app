<template>
	<view class="page">
		<uni-collapse :accordion="true" v-on:change="changeOpen">
			<uni-collapse-item v-for="(item, index) in wordData" :key="item.id" :title="item.spell" :fav="item.mark" :show-animation="item.animation">
				<block>
				    <view class="uni-list-cell" hover-class="uni-list-cell-hover">
				        <view class="uni-triplex-row">
							<view @click="changeFav(index)">
								<view class="iconfont" :class="{'icon-fav': item.mark, 'icon-unfav': !item.mark}"></view>
							</view>
				            <view class="uni-triplex-left">
								<text class="uni-text">{{item.phonetics}}</text>
								<text class="uni-text">{{item.translation}}</text>
				            </view>
				            <view class="uni-triplex-right uni-flex uni-column row2" @click="showDetail(item.word_id)">
				                <view><text class="uni-h5">{{getDate(item.latest_time)}}</text></view>
                                <view>详情</view>
				            </view>
				        </view>
				    </view>
				</block>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
		},
        props:{
            wordData:Array
        },
		data() {
			return {
				extraIcon: {
					color: '#4cd964',
					size: '26',
					type: 'image'
				},
				id: 2
			}
		},
		methods: {
			changeFav(index) {
				this.$emit('changeFav', index);
			},
            showDetail(id){
                this.$emit('showDetail', id);
            },
            changeOpen(index){
                this.$emit('open', index);
            },
            getDate(time){
                let dat = new Date(time*1000);
                return (dat.getMonth()+1) + "-" + dat.getDate();
            },
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
    .uni-triplex-left {
        padding-left: 5px;
    }
	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}

	.example-title__after {
		position: relative;
		color: #031e3c
	}

	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 30upx;
		background: #fff
	}

	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}

	.content {
		padding: 30upx;
		background: #f9f9f9;
		color: #666;
	}

	.button {
		font-size: 26upx;
		line-height: 90upx;
	}
	
	.iconfont{
		position: absolute;
		top: 40%;
		left: 6px;
	}
    
    .uni-triplex-left .uni-text{
        margin-top: 18upx;
    }
</style>