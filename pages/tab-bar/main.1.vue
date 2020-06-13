<template>
	<view >
        <uni-nav-bar class="uni_nav_bar" :fixed="true" :backgroundColor="navBgColor" :status-bar="true" :border="false" :shadow="false" :transparent="true"
          :right-icon="rightType" @click-left="showTransType" @click-right="addOrSearch">
            <block slot="left">
                <view class="transfer">
                    <view>{{ transfer }}</view>
                    <view><uni-icons type="arrowdown" color="#333333" size="20" /></view>
                </view>
            </block>
            <view class="input-view search-input">
                <input confirm-type="search" v-model="searchWord" @focus="onSearchWord" @input="onSearchWord" class="input" type="text" placeholder="输入搜索关键词" @confirm="addOrSearch">
            </view>
        </uni-nav-bar>
		<view class="content">
            <view v-if="searchWord == ''" class="word-history">
            	<m-collapse :wordData="viewData" v-on:changeFav="changeFav" v-on:showDetail="showDetail" v-on:open="collapseOpen"></m-collapse>
            <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText" />    
            </view>
            <view v-else>
                <uni-list>
                	<uni-list-item v-for="(item, key) in selectData" :key="key" @click="goDetail(value)"  :show-arrow="false" :title="item.spell" :note="item.translation" />
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
                loadMoreText: {
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					},
                loadMoreStatus: 'more',
                selectData: [
                    {
                        'spell': 'sss',
                        'translation': '哈哈'
                    },
                    {
                        'spell': 'sss',
                        'translation': '哈哈'
                    },
                    {
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
                this.loadData();
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
            loadData(){
                let _this = this;
                this.loadMoreStatus = "loading";
                console.log(this.page)
                this.$DB.selectView(this.page).then(res => {
                    if(res.length!=20){
                        this.viewData = this.viewData.slice(0, (this.page-1)*20);
                        this.loadMoreStatus = "noMore";
                    }else{
                        this.page++;
                        this.loadMoreStatus = "more";
                    }
                    this.viewData = this.viewData.concat(res);
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
            addOrSearch(){
                console.log(this.rightType);
                if(this.rightType == 'plus'){
                    uni.navigateTo({
                        url: '/pages/word/add'
                    });
                }else{
                    if(this.searchWord){
                        if(this.searchWord.match(/[\u4E00-\u9FA5]+/)){//中文
                            
                        }else{
                            this.$DB.selectWord(q).then(function(res){
                                if(res){
                                    
                                }else{
                                    this.youdao(this.searchWord);
                                }
                            });
                        }
                    }
                }
            },
            onSearchWord(){
                console.log('search...');
                if(this.searchWord){
                    this.rightType = 'search';
                }else{
                    this.rightType = 'plus';
                }
                
                this.rightType = 'search';
            },
            moveData(){
                plus.io.requestFileSystem( plus.io.PRIVATE_WWW, function(fs){
                    fs.root.getDirectory("_data", {create:true,exclusive:false}, function(picDE){
                        plus.io.resolveLocalFileSystemURL('_www/static/_data/test.txt', function( fileEntry ) {
                            fileEntry.remove( function ( entry ) {
                                plus.console.log( "Remove succeeded" );
                            }, function ( e ) {
                                console.log( e.message );
                            } );
                             // fileEntry.moveTo(plus.io.PRIVATE_WWW, 'n.txt', function(fe){
                             //    console.info("---- -");
                             // }, function(error){
                             //     fileEntry.remove( function ( entry ) {
                             //        plus.console.log( "Remove succeeded" );
                             //    }, function ( e ) {
                             //        console.log( e.message );
                             //    } );
                                    
                             //    console.log(error);  
                             // });
                        }, function(error){  
                                console.info("error2:"+error.message);  
                        });  
                    }, function(error){
                        console.info("error2:"+error.message);  
                    })  
                });

                
                return ;
                plus.io.requestFileSystem( plus.io.PRIVATE_WWW, function( fs ) {
                    
                    fs.root.getFile('static/_data/word.db',{create:false}, function(fileEntry){
                        plus.io.resolveLocalFileSystemURL("_doc",  function(picDE1) {
                            picDE1.getDirectory("_data", {create:true,exclusive:false}, function(picDE){
                                 fileEntry.moveTo(plus.io.PRIVATE_DOC, fileEntry.name, function(fe){
                                    console.info("---- -");
                                 }, function(error){  
                                     console.log(error);  
                                 })  
                            }, function(error){  
                                console.info("error2:"+error.message);  
                            })  
                        }, function(error){  
                                console.info("error2:"+error.message);  
                        });  
                    }, function(e){
                        console.log(e);
                    });
                    return ;
                    

                    // fileEntry.moveTo(plus.io.PRIVATE_DOC, "word.db", function( entry ){
                    //     plus.console.log("New Path: " + entry.fullPath);
                    // }, function( e ){
                    //     console.log( e);
                    // } );
                });
            },
			searchLocalEnglish(q){
				
			},
			login(){
				if (!this.hasLogin) {
					uni.showModal({
						title: '未登录',
						content: '您未登录，需要登录后才能继续',
						/**
						 * 如果需要强制登录，不显示取消按钮
						 */
						showCancel: !this.forcedLogin,
						success: (res) => {
							if (res.confirm) {
								/**
								 * 如果需要强制登录，使用reLaunch方式
								 */
								if (this.forcedLogin) {
									uni.reLaunch({
										url: '../login/login'
									});
								} else {
									uni.navigateTo({
										url: '../login/login'
									});
								}
							}
						}
					});
				}
			},
			notTrans(){
				let self = this;
				let num = 1;
				function page(){
					self.$DB.selectWordByOther({translation: ''}, num).then(function(res){
						if(res.length){
							console.log(JSON.stringify(res));
							// self.intervalUpdate(res, 0);
						}else{
							clearInterval(int);
						}
						num++;
					});
				}
				page();
				var int = setInterval(page, 5000);
			},
			openRecord(func){
				plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fobject){
					// fs.root是根目录操作对象DirectoryEntry
					fobject.root.getFile('static/reword-word.txt',{create:true}, function(fileEntry){
						fileEntry.file( function(file){
							var fileReader = new plus.io.FileReader();
							// console.log("getFile:" , JSON.stringify(file));
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = function(evt) {
								// console.log("11" , evt);
								// console.log("evt.target" , evt.target);
								let txt = evt.target.result;
								let arrTxt = txt.split("\r\n");
								func(arrTxt);
							}
						} );
					});
				} );
			},
			
			openFile(existWord){
				let _this = this;
				plus.io.resolveLocalFileSystemURL( "_www/static/word.txt", function( entry ) {
						entry.file( function(file){
							var fileReader = new plus.io.FileReader();
							// console.log("getFile:" , JSON.stringify(file));
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = function(evt) {
								// console.log("11" , evt);
								// console.log("evt.target" , evt.target);
								let txt = evt.target.result;
								let arrTxt = txt.split("\n");
								// console.log(arrTxt);
								existWord = existWord || [];
								var indx = -1;
								for(let word of arrTxt){
									if(existWord.indexOf(word) >=0){
										indx++;
									}else{
										break;
									}
								}
								_this.interval(arrTxt, indx);
								// _this.writeFile(word);
							}
							console.log(file.size , '--' , file.name);
						} );
					}, function ( e ) {
						console.log(e.message);
						console.log(e);
					} );
			},
			
			interval(arrTxt, index){
				let _this = this;
				index = index == -1 ? 0:index;
				function inner(){
					let word = arrTxt[index];
					if(!word){
						clearInterval(it);
						return;
					}
					console.log(word);
					_this.youdao(word);
					_this.writeFile(word);
					index++;
				}
				var it = setInterval(inner, 10000);
			},
			intervalUpdate(arrTxt, index){
				let _this = this;
				index = index == -1 ? 0:index;
				function inner(){
					let word = arrTxt[index];
					
					if(!word){
						clearInterval(it);
						return;
					}
					let id = word.id;
					word = word.spell;
					_this.youdaoUpdate(word, id);
					index++;
				}
				var it = setInterval(inner, 10000);
			},
			writeFile(data){
				// plus.io.resolveLocalFileSystemURL( "_www/static/record-word.txt", function( entry ) {
				// 		fileEntry.createWriter( function ( writer ) {
				// 			// Write data to file.
				// 			writer.seek(writer.length)
				// 			console.log(data);
				// 			writer.write(data + "\r\n");
				// 		}, function ( e ) {
				// 			console.log(e);
				// 		} );
				// 	}, function ( e ) {
				// 		console.log(e.message);
				// 		console.log(e);
				// 	} );
					
					// return;
				const self = this;
				// 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
				plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fobject){
					// fs.root是根目录操作对象DirectoryEntry
					fobject.root.getFile('static/reword-word.txt',{create:true}, function(fileEntry){
						fileEntry.file( function(file){
							// create a FileWriter to write to the file
							fileEntry.createWriter( function ( writer ) {
								// Write data to file.
								writer.seek(file.size)
								writer.write(data + "\r\n");
							}, function ( e ) {
								console.log(e);
							} );
						} ); 
					});
				} );

			},
			trans(q){
				// this.youdao('DDB');
				// return;
				this.notTrans();
				return;
				this.openRecord(this.openFile);
				// plus.runtime.openURL('yddict://m.youdao.com/dict?le=eng&q=command', function(res) {
					
				// });
				
				
			},
			youdaoUpdate(q, id){
				var _this = this;
				this.$api.youdao(q).then(function(res){
					let data = JSON.parse(res);
					if(data.errorCode == "0"){//成功
						_this.updateYouDao(id, data);
					}else{
						_this.$showToast('查询失败');
					}
				});
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
                console.log(basic);
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
                
				this.$saveWordDetail(dataTmp);
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
            updateYouDao(id, data){
				let basic = data.basic;
				if((!basic || basic == "null") && data.translation.length){
					var word = 
						{
							phonetic: basic['phonetic']||"",
							us_phonetic: basic['us-phonetic']||"",
							uk_phonetic: basic['uk-phonetic']||"",
							translation: data.translation.join("；"),
						};
					this.$DB.updateWord(word, {id: id});
				}
				
				if(basic){
					let details = [];
					for(let k in basic['explains']){
						let matchExplain = basic['explains'][k].match(/^(\w+)[\.\s\t]+(.*)$/);
						if(matchExplain){
							details.push({
								word_type: matchExplain[1],
								translation: matchExplain[2],
							});
						}
					}
					
					for(let k in details){
						let detail = details[k];
						detail['word_id'] = id;
						this.$DB.insertDetail(detail);
					}
				}
				if(data.web){
					let webDetails = [];
					for(let k in data['web']){
						let item = data['web'][k];
						webDetails.push({
							spell: item['key'],
							translation: item['value'].join("；"),
						});
					}
					for(let k in webDetails){
						let detail = webDetails[k];
						detail['word_id'] = id;
						this.$DB.insertWebDetail(detail);
					}
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
</style>
