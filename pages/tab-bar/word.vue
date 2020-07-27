<template>
	<view>
        <uni-nav-bar class="uni_nav_bar" :fixed="true" :backgroundColor="navBgColor" color="#333333" :status-bar="true" :border="false" :title="navTitle" :shadow="false" :transparent="true" right-icon="more-filled"  @click-right="isShowMore=!isShowMore">
        </uni-nav-bar>
        <!-- <uni-nav-bar class="nav-bar" :title="navTitle" fixed=true status-bar=true shadow=false right-icon="more-filled"></uni-nav-bar> -->
<!--        <uni-nav-bar>
            <view class="nav-title">单词汇</view>
            <view slot="right">right</view>
        </uni-nav-bar>
 -->
         <view class="selectAccount" v-if="isShowMore" @click="isShowMore=false">
         </view>
         <view class="accountBoxOrder" v-if="isShowMore">
            <view class="selIcon"></view>
            <view class="selAcc">
                <view class="uni-product-list">
                     <view class="g-pl-8 g-pr-8 g-pt-8 g-pb-8 g-ml-12 g-mr-12 accountName uni-flex uni-row row2" v-for="(item, k) in configData" :key="k" @click.stop="setOptionCache(k)">
                        <view>{{item.title}}</view>
                        <view v-if="item.value" class="uni-icon uni-icon-checkmarkempty"></view>
                     </view>
                </view>
            </view>
         </view>
		<view>
			<!-- <uni-indexed-list :options="list" :show-select="false" @click="bindClick" /> -->
            <m-indexed-list :options="wordList" :configData="configData" :show-select="false" @click="bindClick" v-on:clickMenu="clickMenu" v-on:loadMore="loadMore"/>
		</view>
	</view>
</template>

<script>
    import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
    import uniIcons from "@/components/uni-icons/uni-icons.vue"
	// import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
    import mIndexedList from '@/components/m-indexed-list/m-indexed-list.vue'
    
    import wordData from "../../static/_data/word.js"
    
	export default {
		components: {
            uniNavBar,
            uniIcons,
			mIndexedList
		},
        created() {
            this.getWord();
        },
        onLoad() {
            // this.wordList = wordData;
            this.getOptionCache();
            uni.showLoading({
                title:'加载中...'
            });
        },
        onShow() {
            let bgColor = uni.getStorageSync('nav-bg-color');
            if(bgColor){
                this.navBgColor = bgColor;
            }
        },
		data() {
			return {
                isShowMore: false,//是否显示选项
                navBgColor: '#f9f9f9',
                navTitle: '单词汇',
                isShowMark: 0,
                configData: [
                    {
                        key: 'isShowMark',
                        title: '我标记的',
                        value: 0,
                        blank: 1
                    },
                    {
                        key: 'isShowPron',
                        title: '显示发音',
                        value: 0
                    },
                    {
                        key: 'isShowMean',
                        title: '显示释义',
                        value: 0
                    }
                ],
                wordList: [],
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
                uni.navigateTo({
                    url:"/pages/word/view-one?id=" + e.item.id
                })
			},
            clickMenu(item){//{index: 3, key: "D"}
                console.log(item);
            },
            loadMore(item){
                let curr = this.wordList[item.index];
                this.$DB.selectWordByCase(curr.letter, curr.page+1, this.isShowMark).then(data => {
                    console.log(data);
                    this.wordList[item.index].loadOver = data.loadOver;
                    this.wordList[item.index].data = this.wordList[item.index].data.concat(data.data);
                    this.wordList[item.index].page = curr.page+1;
                });
            },
            getWord(){
                let _this = this;
                this.isShowMark = uni.getStorageSync('isShowMark');
                
                this.$DB.selectWordByCase("", 1, this.isShowMark||0).then(function(data){
                    uni.hideLoading();
                    _this.wordList = data;
                });
            },
            showMore(){
                
            },
            getOptionCache(){
                let _this = this;
                for(let i in this.configData){
                    uni.getStorage({
                        key: _this.configData[i]['key'],
                        success: function(res){
                            _this.configData[i]['value'] = res.data;
                        }
                    })
                }
            },
            setOptionCache(index){
                let item = this.configData[index];
                
                this.configData[index]['value'] = (item['value'] + 1) % 2;
                
                uni.setStorage({
                    key: item['key'],
                    data: this.configData[index]['value']
                });
                
                if(item.key=='isShowMark'){
                    this.isShowMark = this.configData[index]['value'];
                    this.getWord();
                }
            }
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
    
    .nav-bar{
        margin-top: 50upx;
    }
	
	view {
		font-size: 28upx;
		line-height: inherit
	}
    
    .menu {
    	/* font-size: 12px; */
    	line-height: 44px;
    }
    .selectAccount{
    	background: rgba(0, 0, 0, 0.2);
          text-align: left;
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 998;
    }
    .selAcc{
    	width: 360upx;
    	background-color: #fff;
    	border-radius: 10px;
    }
    .selIcon{
    	width:0;
    	height:0;
    	border-style: solid;
    	border-width: 10px;
    	border-color: transparent transparent #fff transparent;
    	font-szie:0;
    	line-height: 0;
    	margin-left: 260upx;
    }
    .accountBoxOrder{
    	position: absolute;
    	right: 10upx;
    	top: 100upx;
    	z-index:1000;
    }
    .accountName{
        width: 100%;
    }
    .uni-icon-checkmarkempty{
        font-size: 40upx;
    }
</style>
