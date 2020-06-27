<template>
	<view class="content">
		<view class="input-group">
            <view class="input-row">
                <view class="uni-flex title">
                    <view>标题</view>
                </view>
                <m-input class="uni-input m-input" v-model="form.title" :clearable=false placeholder="标题"></m-input>
            </view>
            <view class="input-row">
                <view class="uni-flex title">类型</view>
                <view class="uni-list-cell-db">
                    <picker @change="bindPickerChange" :value="index" :range="questionTypes" range-key="name">
                        <view class="uni-input m-input">{{questionTypes[index].name}}</view>
                    </picker>
                </view>
            </view>
            <view class="input-row" v-if="form.type == 3">
                <view class="uni-flex title">其他类型</view>
                <m-input class="uni-input m-input" v-model="form.other_type" placeholder="其他类型"  :clearable="false" ></m-input>
            </view>
            <view class="input-row">
                <view class="uni-flex title">详细内容</view>
                <view class="uni-list-cell cell-pd uni-list-cell-db uni-textarea" ><textarea class=" m-area" v-model="form.content" placeholder="详细内容" ></textarea></view>
            </view>
            
            
            <view class="input-row">
                <view class="uni-flex title">上传凭证</view>
                <view class="uni-uploader-info">{{imageList.length}}</view>
            </view>
            <view class="input-row">
                <view class=" cell-pd">
                    <view class="uni-uploader">
                        <view class="uni-uploader-head">
                            <view class="uni-uploader-title"></view>
                        </view>
                        <view class="uni-uploader-body">
                            <view class="uni-uploader__files uni-flex uni-row"  style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
                                <block v-for="(image,index) in imageList" :key="index">
                                    <view class="uni-uploader__file" @longpress="showClose=true">
                                        <view v-if="showClose" class="iconfont icon-close" @click="clearImg(index)"></view>
                                        <image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
                                    </view>
                                </block>
                                <view class="uni-uploader__input-box">
                                    <view class="uni-uploader__input" @tap="chooseImage"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
		</view>
        
        
        <view class="uni-btn-v">
        	<button class="m-btn" @click="formSubmit" >提交</button>
        </view>
	</view>
</template>
<script>
    var sourceType = [
    	['camera'],
    	['album'],
    	['camera', 'album']
    ]
    var sizeType = [
    	['compressed'],
    	['original'],
    	['compressed', 'original']
    ]
    
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
                cacheKey: 'addQuestion',
                isShowRequire: false,
                questionTypes: [
                    {name:'界面', value: 1},
                    {name:'单词解释错误', value: 2},
                    {name:'其他', value: 3}
                    ],
                index: 0,
                form:{
                    word_id: '',
                    title: '',
                    type: 2,
                    other_type: '',
                    content: '',
                    attaches: []
                },
                imageList: [],
                showClose: false,
                title: 'choose/previewImage',
                sourceTypeIndex: 2,
                sourceType: ['拍照', '相册', '拍照或相册'],
                sizeTypeIndex: 0,
                sizeType: ['压缩', '原图', '压缩或原图'],
                countIndex: 8,
                count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                current: 1,
			}
		},
        onLoad(options) {
            if(options.word_id){
                this.form.word_id = options.word_id;
                this.index = 1;
            }
            console.log(this.index)
            // this.getCache();
            // this.setIntval();
        },
		methods: {
			formSubmit: function() {
                
			},
            bindPickerChange: function(e) {
            	this.index = e.target.value;
                this.form.type = this.questionTypes[this.index].value;
                console.log(this.index)
            },
            chooseImage: async function() {
            	if (this.imageList.length === 3) {
            		let isContinue = await this.isFullImg();
            		console.log("是否继续?", isContinue);
            		if (!isContinue) {
            			return;
            		}
            	}
            	uni.chooseImage({
            		sourceType: sourceType[this.sourceTypeIndex],
            		sizeType: sizeType[this.sizeTypeIndex],
            		count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
            		success: (res) => {
            			this.imageList = this.imageList.concat(res.tempFilePaths);
            			// this.$api.uploadImg('/api/appeal/uploadimage', 'image', res.tempFilePaths[0]).then((res)=>{
            			// 	let r = JSON.parse(res);
            			// 	if(r.code == 0){
            			// 		this.form.imgIds.push(r.data);
            			// 	};
            			// });
            		}
            	})
            },
            isFullImg: function() {
            	return new Promise((res) => {
            		uni.showModal({
            			content: "已经有3张图片了,是否清空现有图片？",
            			success: (e) => {
            				if (e.confirm) {
            					this.imageList = [];
            					res(true);
            				} else {
            					res(false)
            				}
            			},
            			fail: () => {
            				res(false)
            			}
            		})
            	})
            },
            previewImage: function(e) {
                if(this.showClose){
                    this.showClose = false;
                    return;
                }
            	var current = e.target.dataset.src
            	uni.previewImage({
            		current: current,
            		urls: this.imageList
            	})
            },
            clearImg(index){
                this.imageList.splice(index, 1);
            }
		}
	}
</script>

<style >
    .content{
        padding: 0px;
    }
    .input-group{
        margin-top: 10upx;
        padding-bottom: 12upx;
        font-size: 28upx;
    }
    .sub-title{
        text-align: center;
        line-height: 60upx;
        color: #ccc;
        margin-top: 28upx;
        
    }
    
    .title{
        -webkit-justify-content: left;
        justify-content: left;
        -webkit-align-items: center;
        align-items: center;
    }
    
    .m-center{
        -webkit-flex: 1;
        flex: 1;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    
    .m-op{
        padding-right: 10upx;
    }
    
    .m-input{
        border-bottom: 2upx solid #eee;
        margin-right: 16upx;
        font-size: 28upx;
    }
    
    .input-group::before{
        background-color: white;
    }
    .input-group::after{
        background-color: white;
    }
    
    .m-btn{
        background-color: #0FAEFF;
    }
    
    .uni-textarea-textarea{
        left: 20upx;
        right: 10upx;
    }
    
    .uni-uploader__file{
        position: relative;
    }
    
    .icon-close{
        position: absolute;
        top: -15px;
        left: -10px;
        z-index: 9999;
    }
    
    .uni-uploader-body{
        margin: 8px;
    }
</style>
