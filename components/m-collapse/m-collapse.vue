<template>
	<view class="page">
		<uni-collapse :accordion="true">
			<uni-collapse-item v-for="(item, index) in accordion" :key="item.id" :title="item.title" :fav="item.fav" :show-animation="item.animation">
				<block>
				    <view class="uni-list-cell" hover-class="uni-list-cell-hover">
				        <view class="uni-triplex-row">
							<view @click="change(index)">
								<view class="iconfont" :class="{'icon-fav': item.fav, 'icon-unfav': !item.fav}"></view>
							</view>
				            <view class="uni-triplex-left">
								<text class="uni-text">列表内容文字,列表内容文字,列表内容文字,列表内容文字</text>
								<text class="uni-text">列表内容文字,列表内容文字,列表内容文字,列表内容文字</text>
								<text class="uni-text">列表内容文字,列表内容文字,列表内容文字,列表内容文字</text>
				                <!-- <text class="uni-title uni-ellipsis">列表主标题</text> -->
				                <!-- <text class="uni-text-small uni-ellipsis">列表内容文字,列表内容文字,列表内容文字,列表内容文字,列表内容文字,列表内容文字</text> -->
				                <text class="uni-text">列表副标题</text>
				            </view>
				            <view class="uni-triplex-right">
				                <text class="uni-h5">12:15</text>
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
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniList,
			uniListItem
		},
		data() {
			return {
				accordion: [{
						id: 0,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 1
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					},
					{
						id: 1,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav: 0
					},
					{
						id: 2,
						title: '标题文字',
						content: '手风琴效果',
						animation: true,
						fav:0
					}
				],
				extraIcon: {
					color: '#4cd964',
					size: '26',
					type: 'image'
				},
				id: 2
			}
		},
		methods: {
			change(index) {
				console.log(this.accordion[index]);
				this.accordion[index].fav = !this.accordion[index].fav;
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
</style>