<template>
	<view class="content">
        <!-- 单词本意 -->
		<view class="input-group">
            <!-- 单词 -->
            <view class="uni-flex uni-row row2">
                <view>
                    <view class="m-spell"><text>{{word.spell}}</text></view>
                </view>
                <view class="uni-flex uni-row">
                    <view @click="markWord(word_id)">
                    	<view class="m-icon iconfont" :class="{'icon-fav': word.mark, 'icon-unfav': !word.mark}"></view>
                    </view>
                    <view class="m-icon uni-icon uni-icon-more-filled" @click="isShowMore=true"></view>
                </view>
            </view>
            <!-- 基本大义 -->
            <view class="uni-flex uni-row">
                <view><text>{{word.translation}}</text></view>
            </view>
            <!-- 发音 -->
            <view class="uni-flex uni-row m-phonetic">
                <view><text>{{word.phonetics}}</text></view>
            </view>
            <!-- 中文意思 -->
            <view class="uni-flex uni-column m-translation">
                <view v-for="(item, key) in arrDetail" :key="key" class="uni-flex uni-row">
                    <view class="m-word-type">{{item.word_type}}</view>
                    <view>{{item.translation}}</view>
                </view>
            </view>
        </view>
        <view class="blank"></view>
        <!-- 网络词解 -->
        <view v-if="webDetail.length>0" class="input-group uni-flex uni-column">
            <view class="uni-flex uni-row m-gray row-center"><text>网络释义</text></view>
            <view v-for="(item, key) in webDetail" :key="key" class="uni-flex uni-column m-translation">
                <view>{{item.spell}}</view>
                <view>{{item.translation}}</view>
            </view>
        </view>
        
        
        <view class="selectAccount" v-if="isShowMore" @click="isShowMore=false">
        </view>
        <view class="accountBoxOrder" v-if="isShowMore">
           <view class="selIcon"></view>
           <view class="selAcc">
               <view class="uni-product-list">
                    <view class="g-pl-8 g-pr-8 g-pt-8 g-pb-8 g-ml-12 g-mr-12 accountName uni-flex uni-row row2"  @click.stop="clearCache()">
                       <view>清除本地缓存</view>
                       <view class="uni-icon uni-icon-closeempty"></view>
                    </view>
                    
                    <view class="g-pl-8 g-pr-8 g-pt-8 g-pb-8 g-ml-12 g-mr-12 accountName uni-flex uni-row row2"  @click.stop="sendQuestion()">
                       <view>反馈问题</view>
                       <view class="uni-icon uni-icon-arrowthinright"></view>
                    </view>
               </view>
           </view>
        </view>
	</view>
</template>
<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
	export default {
        components: {
        	uniIcons
        },
		data() {
			return {
                isShowMore: false,//是否显示选项
                word_id: '',
                word:{
                    id: 1,
                    spell: 'sss',
                    mark: 0,
                    translation: '发射点发生',
                    phonetics: '[afes]',
                },
                arrDetail:[
                    
                ],
                webDetail:[
                   
                ],
			}
		},
        onLoad(options) {
            this.word_id = options.id;
            this.getWordDetail();
        },
		methods: {
			getWordDetail(){
                this.$DB.selectWordById(this.word_id).then((data) => {
                    this.word = data.word;
                    this.arrDetail = data.detail;
                    this.webDetail = data.webDetail;
                    
                    this.saveHistory();
                    return data;
                });
            },
            markWord(){
                this.$DB.markWord(this.word);
                this.word.mark = (this.word.mark + 1) % 2;
            },
            saveHistory(){//保存查看记录
                this.$DB.insertView(this.word).then(res => {
                    console.log(res)
                });
                uni.setStorageSync('isViewWord', 1);
            },
            clearCache(){
                this.isShowMore = false;
                this.$DB.delWord(this.word.id).then(res => {
                    uni.switchTab({
                        url: "/pages/tab-bar/main"
                    });
                });
            },
            sendQuestion(){
                this.isShowMore = false;
                uni.navigateTo({
                    url: "/pages/question/add?word_id=" + this.word_id
                })
            }
		}
	}
</script>

<style >
    .content{
        padding: 0px;
    }
    .m-spell{
        font-size: 32upx;
        font-weight: bold;
        color: #464E52;
    }
    .m-phonetic{
        color: #C8C7CC;
    }
    .m-word-type{
        padding-right: 30upx;
    }
    .m-translation{
        margin-top: 20upx;
    }
    .m-icon{
        margin-right: 20upx;
    }
    .input-group{
        margin-top: 0px;
        padding: 18upx;
    }
    .input-group:before,.input-group:after{
        background-color: #FFFFFF;
    }
    
    /* 弹窗样式 */
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
    	top: 50upx;
    	z-index:1000;
    }
    .accountName{
        width: 100%;
    }
    .uni-icon-checkmarkempty{
        font-size: 40upx;
    }
</style>
