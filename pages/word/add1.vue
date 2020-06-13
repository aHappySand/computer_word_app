<template>
	<view class="addPage">
		<view class="sub-title">添加中文释义</view>
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset">
                <view class="uni-form-item row">
                	<view class="title">中文</view>
                	<m-input class="uni-input m-input" :class="{'m-require':word.translation=='' && isShowRequire}" name="word.translation" v-model="word.translation" :clearable=false placeholder="中文名称" validate="chinese"></m-input>
                </view>
                <view class="uni-form-item row">
                	<view class="title">英文翻译</view>
                	<m-input class="uni-input" :class="{'m-require':word.spell=='' && isShowRequire}"  name="word.spell" v-model="word.spell" placeholder="英文单词"  :clearable="false" validate="english"></m-input>
                </view>
                <view class="uni-form-item row">
                	<view class="title">美式发音</view>
                	<m-input class="uni-input" name="word.us_phonetic" v-model="word.us_phonetic" placeholder="美式发音"  :clearable="false" validate="english"></m-input>
                </view>
                <view class="uni-form-item row">
                	<view class="title">英式发音</view>
                	<m-input class="uni-input" name="word.uk_phonetic" v-model="word.uk_phonetic" placeholder="英式发音"  :clearable="false" validate="english"></m-input>
                </view>
				<view class="uni-form-item row">
					<view class="title">日常发音</view>
					<m-input class="uni-input" name="word.phonetic" v-model="word.phonetic" placeholder="日常发音"  :clearable="false" validate="english"></m-input>
				</view>
			</form>
		</view>
        
        <view class="sub-title">其他意思详解</view>
        <view class="uni-padding-wrap uni-common-mt">
        	<!-- <form @submit="formSubmit" @reset="formReset"> -->
            <view  v-for="(item,key) in arrDetail" :key="key" class="uni-flex uni-column m-item">
                <view class="m-bradge" style="text-align: center;">
                    <uni-badge :text="key+1" type="primary" bgColor="#55aaff"/>
                </view>
                <view class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
                    <view style="width: 100%;">
                        <view class="uni-form-item row">
                            <view class="title">词性</view>
                            <view class="uni-list-cell-db">
                                <picker @change="bindPickerChange" v-model="arrDetail[key].type_index" :value="arrDetail[key].type_index" :range="wordProp" range-key="name">
                                    <view  @click="selectPicker(key)" class="uni-input m-uni-input">{{wordProp[item.type_index].name}}</view>
                                </picker>
                            </view>
                        </view>
                        <view class="uni-form-item row">
                            <view class="title">中文意思</view>
                            <m-input class="uni-input m-uni-input" name="arrDetail[key].translation" v-model="arrDetail[key].translation" :value="item.translation" placeholder="中文意思"  :clearable="false"></m-input>
                        </view>
                    </view>
                    <view class="uni-flex m-center uni-column">
                    <view v-if="key == arrDetail.length-1" class="icon-item m-op">
                        <uni-icons type="plus" color="#55aaff" size="20" @click="addDetail(key)" />
                    </view>
                    <view v-else class="icon-item m-op">
                        <uni-icons type="minus" size="20" @click="delDetail(key)" />
                    </view>
                </view>
                </view>
            </view>
        	<!-- </form> -->
        </view>
        
        <view class="sub-title">网络词组</view>
        <view class="uni-padding-wrap uni-common-mt">
        	<!-- <form @submit="formSubmit" @reset="formReset"> -->
            <view  v-for="(item,key) in webDetail" :key="key" class="uni-flex uni-column m-item">
                <view class="m-bradge" style="text-align: center;">
                    <uni-badge :text="key+1" type="primary" bgColor="#94f69f"/>
                </view>
                <view class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
                    <view style="width: 100%;">
                        <view class="uni-form-item row">
                            <view class="title">英文</view>
                            <m-input class="uni-input m-uni-input" name="webDetail[key].spell" v-model="webDetail[key].spell" :value="item.spell" placeholder="英文词组"  :clearable="false" validate="english"></m-input>
                        </view>
                        <view class="uni-form-item row">
                            <view class="title">中文意思</view>
                            <m-input class="uni-input m-uni-input" name="webDetail[key].translation" v-model="webDetail[key].translation" :value="item.translation" placeholder="中文意思"  :clearable="false"></m-input>
                        </view>
                    </view>
                    <view class="uni-flex m-center uni-column">
                    <view v-if="key == webDetail.length-1" class="icon-item m-op">
                        <uni-icons type="plus" color="#94f69f" size="20" @click="addWebDetail(key)" />
                    </view>
                    <view v-else class="icon-item m-op">
                        <uni-icons type="minus" size="20" @click="delWebDetail(key)" />
                    </view>
                </view>
                </view>
            </view>
        	<!-- </form> -->
        </view>
        
        <view class="uni-btn-v">
        	<button class="m-btn" @click="formSubmit" >提交</button>
        </view>
	</view>
</template>
<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    import uniBadge from '@/components/uni-badge/uni-badge.vue'
    import mInput from '@/components/m-input.vue'
	export default {
        components: {
        	uniIcons,
            uniBadge,
            mInput
        },
		data() {
			return {
                cacheKey: 'addWord',
                isShowRequire: false,
                wordProp: [
                    {name:'名词 noun', value: 'n'},
                    {name:'代词 pronoun', value: 'pron'},
                    {name:'形容词 adjective', value: 'adj'},
                    {name:'副词 adverb', value: 'adv'},
                    {name:'动词 verb', value: 'v'},
                    {name:'数词 numeral', value: 'num'},
                    {name:'冠词 article', value: 'art'},
                    {name:'介词 preposition', value: 'prep'},
                    {name:'连词 conjunction', value: 'conj'},
                    {name:'感叹词 interjection', value: 'interj'},
                    ],
                index: 0,
                word:{
                    spell: '',
                    translation: '',
                    phonetic: '',
                    us_phonetic: '',
                    uk_phonetic: ''
                },
                arrDetail:[
                    {
                        type_index: 0,
                        translation: ''
                    }
                ],
                webDetail:[
                    {
                        spell: '',
                        translation: ''
                    }
                ],
			}
		},
        onLoad() {
            this.getCache();
            this.setIntval();
        },
		methods: {
			formSubmit: function() {
                var data = this.setCache();
                let _this = this;
				this.$saveWordDetail(data);
			},
            setIntval:function(){
                var itv = setInterval(this.setCache, 3000);
                setTimeout(function(){
                    clearInterval(itv);
                }, 120000);
            },
            //设置本地缓存
            setStorage(key, data) {
            	uni.setStorage({
            		key: key,
            		data: data,
            		success: (res) => {}
            	})
            },
            setCache:function(){
                var detail = [];
                for(var k in this.arrDetail){
                    var trans = this.arrDetail[k].translation;
                    detail.push({
                        word_type: this.wordProp[this.arrDetail[k].type_index].value,
                        translation: trans
                    });
                }
                var data = {
                    word: this.word,
                    detail: detail,
                    webDetail: this.webDetail
                };
                this.setStorage(this.cacheKey, data);
                return data;
            },
            getCache: function(){
                let data = uni.getStorageSync(this.cacheKey);
                if(data){
                    if(data.word.translation){
                        var _this = this;
                        uni.showModal({
                            title: "提示",
                            content:"上次未填写完，是否继续？",
                            success:function(res){
                                if(res.confirm){
                                    _this.word = data.word;
                                    _this.webDetail = data.webDetail;
                                    console.log(_this.word);
                                }else{
                                    _this.setCache();
                                }
                            }
                        })
                    }
                }
            },
            clearCache: function(){
                uni.clearStorage(this.cacheKey);
            },
			formReset: function(e) {
				console.log('清空数据')
			},
            bindPickerChange: function(e) {
            	this.arrDetail[this.index].type_index = e.target.value
            },
            addDetail:function(){
                this.arrDetail.push({
                    type_index: 0,
                    translation: ''
                });
            },
            delDetail:function(index){
                this.arrDetail.splice(index, 1);
            },
            addWebDetail:function(){
                this.webDetail.push({
                    type_index: 0,
                    translation: ''
                });
            },
            delWebDetail:function(index){
                this.webDetail.splice(index, 1);
            },
            selectPicker:function(index){
                this.index = index;
            }
		}
	}
</script>

<style >
    .uni-form-item .title {
        padding: 20rpx 0;
    }
    
    .sub-title{
        text-align: center;
        line-height: 60upx;
        color: #ccc;
        margin-top: 28upx;
    }
    
    .m-center{
        -webkit-flex: 1;
        flex: 1;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    
     .uni-input{
        position: absolute;
        left: 150upx;
        width: 68%;
        font-size: 24upx;
        border-bottom: 1px solid #efeff4;
    }
    
    .m-uni-input{
        width: 58%;
        font-size: 28upx;
    }
    
    
    .m-op{
        margin-top: 10upx;
    }
    
    .m-item{
        margin-bottom: 10upx;
        /* border-bottom: 2upx dotted #c0ddfd; */
    }
    
    .m-bradge{
        color: #0FAEFF;
    }
    
    
    .m-btn{
        background-color: #53b2fa;
        color: #ffffff;
    }
    
    .m-require{
        border-bottom: 1px solid #f3027d;
    }
    
    .uni-input-placeholder{
        font-size: 28upx;
    }
</style>
