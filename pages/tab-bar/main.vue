<template>
	<view class="content">
		<view class="navbar">
			<uni-nav-bar class="uni_nav_bar" :fixed="false" backgroundColor="#f9f9f9" color="#333333" :status-bar="true" :border="false" :shadow="false" :transparent="true"
			  right-icon="search" @click-left="showCity" @click-right="scan">
				<block slot="left">
					<view class="transfer">
						<view>{{ transfer }}</view>
						<uni-icons type="arrowdown" color="#333333" size="22" />
					</view>
				</block>
				<view class="input-view">
					<!-- <uni-icons type="search" size="22" color="#666666" /> -->
					<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" @confirm="confirm">
				</view>
			</uni-nav-bar>
		</view>
		
		<view class="word-history">
			<m-collapse></m-collapse>
		</view>
	</view>
</template>

<script>
	
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import mCollapse from '@/components/m-collapse/m-collapse.vue'
	
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		components: {
			uniIcons,
			uniNavBar,
			mCollapse
		},
		data() {
			return {
				transfer: '有道',
				content: '',
			}
		},
		onLoad() {
			
		},
		methods:{
			search(){
				
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
						alert( "Resolve file URL failed: " + e.message );
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
				// 		alert( "Resolve file URL failed: " + e.message );
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
					console.log(res);
					let data = JSON.parse(res);
					if(data.errorCode == "0"){//成功
						// _this.saveYouDao(q, data);
					}else{
						_this.$showToast('查询失败');
					}
				});
			},
			saveYouDao(q, data){
				let basic = data.basic;
				if(!basic || basic == "null"){
				var word = 
					{
						spell:q,
						phonetic: basic['phonetic']||"",
						us_phonetic: basic['us-phonetic']||"",
						uk_phonetic: basic['uk-phonetic']||"",
						translation: data.translation.join("；"),
					};
					this.$DB.insertWord(word);
					return ;
				}
				
				var word = 
					{
						spell:q,
						phonetic: basic['phonetic']||"''",
						us_phonetic: basic['us-phonetic']||"''",
						uk_phonetic: basic['uk-phonetic']||"''",
						translation: data.translation.join("；"),
					}
				;
				
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
				
				let webDetails = [];
				for(let k in data['web']){
					let item = data['web'][k];
					webDetails.push({
						spell: item['key'],
						translation: item['value'].join("；"),
					});
				}
				
				let _this = this;
				this.$DB.insertWord(word).then(function(res){
					
					_this.$DB.getLatestWordId((id) => {
						for(let k in details){
							let detail = details[k];
							detail['word_id'] = id;
							_this.$DB.insertDetail(detail);
						}
						
						for(let k in webDetails){
							let detail = webDetails[k];
							detail['word_id'] = id;
							_this.$DB.insertWebDetail(detail);
						}
					});
				}).catch(function(e){
					console.log(e);
				});
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

<style lang="scss" scoped>
	.content{
		background: #FFFFFF;
		position: relative;
		padding: 0upx;
		.navbar{
			width: 100%;
			background: #f9f9f9;
			position: fixed;
			z-index: 2;
			.uni_nav_bar{
				margin-top: 20upx;
			}
		}
		
		.word-history{
			padding-top: 160upx;
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
		
		
	}
</style>
