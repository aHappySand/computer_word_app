<template>
	<view >
        <uni-nav-bar class="uni_nav_bar" :fixed="true" :backgroundColor="navBgColor" :status-bar="true" :border="false" :shadow="false" :transparent="true"
          :right-icon="rightType" @click-left="showTransType" @click-right="addOrSearch(1)">
            <block slot="left">
                <view class="transfer">
                    <view>{{ transfer }}</view>
                    <view><uni-icons type="arrowdown" color="#333333" size="20" /></view>
                </view>
            </block>
            <view class="input-view search-input">
                <input confirm-type="search" v-model="searchWord" @input="onInputSearchWord" class="input" type="text" placeholder="输入搜索关键词" @confirm="addOrSearch(1)" >
                <view v-if="searchWord!=''" class="uni-icon uni-icon-clear" @click="searchWord=''"></view>
            </view>
        </uni-nav-bar>
		<view class="content">
            <view v-if="searchWord == ''" class="word-history">
            	<m-collapse :wordData="viewData" v-on:changeFav="changeFav" v-on:showDetail="showDetail" v-on:open="collapseOpen"></m-collapse>
                <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText" />    
            </view>
            <view v-else>
                <view v-if="!boolClickConfirm && selectData.length>0" class="uni-flex row-center">
                    <text class="g-col-gray">若无查找的内容，请点击搜索(图标)</text>
                </view>
                <uni-list>
                	<uni-list-item v-for="(item, key) in selectData" :key="key" @click="goDetail(item)"  :show-arrow="false" :title="item.spell" :note="item.translation" />
                </uni-list>
            </view>
            
        </view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import mCollapse from '@/components/m-collapse/m-collapse.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
    
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		components: {
            uniLoadMore,
			uniIcons,
			uniNavBar,
			mCollapse,
            uniList,
            uniListItem
		},
		data() {
			return {
                navBgColor: '#f9f9f9',
				transfer: '有道',
				content: '',
                page: 1,
                rightType: 'plus',
                searchWord: '',
                boolClickConfirm: 0,
                loadMoreText: {
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					},
                loadMoreStatus: 'more',
                selectData: [
                    {
                        'id': null,
                        'spell': 'sss',
                        'translation': '哈哈'
                    },
                    {
                        'id': null,
                        'spell': 'sss',
                        'translation': '哈哈'
                    }
                ],
                viewData: []
			}
		},
		onLoad() {
            // this.$DB.selectWord('test');
            // this.$api.get('http://www.baidu.com').then(function(res){
            //     console.log(res)
            // });
		},
        onShow() {
            let bgColor = uni.getStorageSync('nav-bg-color');
            if(bgColor){
                this.navBgColor = bgColor;
            }
            
            let isViewWord = uni.getStorageSync('isViewWord');
            if(this.viewData.length==0 || isViewWord !== 0){
                uni.setStorageSync('isViewWord', 0);
                this.loadData(true);
            }
            
            if(this.viewData.length > 0){
                this.loadMoreText.contentnomore = "没有更多数据了";
            }
        },
        onNavigationBarSearchInputConfirmed(e){
            console.log(e.text);
        },
        onReachBottom() {
            this.loadMoreStatus = 'more';
            this.loadData();
        },
		methods:{
            loadData(refresh){
                let _this = this;
                this.loadMoreStatus = "loading";
                if(refresh){
                    this.page = 1;
                }
                this.$DB.selectView(this.page).then(res => {
                    this.page++;
                    if(res.length!=20){
                        this.loadMoreStatus = "noMore";
                    }else{
                        this.loadMoreStatus = "more";
                    }
                    if(refresh){
                        this.viewData = res;
                    }else{
                        this.viewData = this.viewData.concat(res);
                    }
                    
                    if(this.viewData.length == 0){
                        this.loadMoreText.contentnomore = "暂无搜索记录";
                    }
                });
            },
            showCity(){},
            changeFav(index){
                this.$DB.markWord(this.viewData[index]);
                this.viewData[index].mark = !this.viewData[index].mark;
            },
            showDetail(id){
                uni.navigateTo({
                    url:"/pages/word/view-one?id=" + id
                })
            },
            collapseOpen(index){
                
            },
            showTransType(){
                
            },
            addOrSearch(boolYoudao){
                if(this.rightType == 'plus'){
                    uni.navigateTo({
                        url: '/pages/word/add'
                    });
                }else{
                    if(this.searchWord){
                        if(this.searchWord.match(/[\u4E00-\u9FA5]+/)){//中文
                            
                        }else{
                            if(boolYoudao){//是否查有道
                                this.boolClickConfirm = 1;
                                this.youdao(this.searchWord);
                            }else{
                                this.$DB.selectWordBySpell(this.searchWord).then(res => {
                                    if(res.length > 0){
                                        this.selectData = res;
                                    }else{
                                        this.selectData = [];
                                    }
                                });
                            }
                        }
                    }
                }
            },
            onInputSearchWord(e){
                if(this.searchWord){
                    this.rightType = 'search';
                    this.addOrSearch(0);
                }else{
                    this.rightType = 'plus';
                }
            },
			youdao(q){
				var _this = this;
				this.$api.youdao(q).then(function(res){
					let data = JSON.parse(res);
                    console.log(data);
					if(data.errorCode == "0"){//成功
						_this.saveYouDao(q, data);
					}else{
						_this.$showToast('查询失败');
					}
				});
			},
			saveYouDao(q, data){
                var word;
				let basic = data.basic;
                
				if(!basic || basic == "null"){
                    word = 
                        {
                            spell:q,
                            phonetic: basic['phonetic']||"",
                            us_phonetic: basic['us-phonetic']||"",
                            uk_phonetic: basic['uk-phonetic']||"",
                            translation: data.translation.join("；"),
                        };
				}else{
                    word =
                    	{
                    		spell:q,
                    		phonetic: basic['phonetic']||"''",
                    		us_phonetic: basic['us-phonetic']||"''",
                    		uk_phonetic: basic['uk-phonetic']||"''",
                    		translation: data.translation.join("；"),
                    	}
                    ;
                }
				
				let details = [];
                if(basic && basic != 'null'){
                    for(let k in basic['explains']){
                    	let matchExplain = basic['explains'][k].match(/^(\w+)[\.\s\t]+(.*)$/);
                    	if(matchExplain){
                    		details.push({
                    			word_type: matchExplain[1],
                    			translation: matchExplain[2],
                    		});
                    	}
                    }
                }
				
				let webDetails = [];
                if(data['web'] && data['web'].length > 0){
                    for(let k in data['web']){
                    	let item = data['web'][k];
                    	webDetails.push({
                    		spell: item['key'],
                    		translation: item['value'].join("；"),
                    	});
                    }
                }
                var dataTmp = {
                    word: word,
                    detail: details,
                    webDetail: webDetails
                };
                
				this.$saveWordDetail(dataTmp, res => {
                    res.id = res.word_id;
                    this.goDetail(res);
                });
                return;
                uni.getNetworkType({
                    success: function (res) {
                        if(res.networkType == 'none'){
                            data.word.is_sync = 0;
                        }else{//发送到服务器
                            data.word.is_sync = 1;
                            
                            let postData = {};
                            for(var k in data){
                                postData[k] = JSON.stringify(data[k]);
                            }
                            _this.$api.post();
                        }
                        _this.$DB.saveWord(data);
                    }
                });
			},
			selectWord(data){//对于汉字翻译，需要选择是那个单词，如果是1个，就默认查询
                
            },
            goDetail(item){
                this.searchWord = "";
                if(item.id){//说明
                    this.showDetail(item.id);
                }
            }
		}
	}
</script>

<style>
    .search-input{
        background: #FFFFFF;
        border-radius: 30upx;
        padding: 0 3%;
        margin-left: 2%;
        margin-right: 2%;
    }
    
    
    .transfer {
    	display: flex;
    	flex-direction: row;
    	align-items: center;
    	justify-content: center;
    	width: 100%;
    	margin-left: 16upx;
    	white-space: nowrap;
    }
    
	.content{
		background: #FFFFFF;
		// position: relative;
		padding: 0upx;
    }
       
    .input-view {
        width: 92%;
        display: flex;
        background-color: #e7e7e7;
        height: 60upx;
        border-radius: 30upx;
        padding: 0 4%;
        flex-wrap: nowrap;
        margin: 14upx 0;
        line-height: 60upx;
        background: #f5f5f5;
    }
    
    .input-view .uni-icon {
        line-height: 60upx !important;
    }
    
    .input-view .input {
        height: 60upx;
        line-height: 60upx;
        width: 94%;
        padding: 0 3%;
    }
    
    
    .uni-icon-clear {
    	width: 20px;
    	font-size: 20px;
    	line-height: 20px;
    	color: rgba(53, 53, 53, 0.6);
    }
</style>
