<template>
	<view class="page">
        <view class="uni-list">
        	<view class="uni-list-cell" hover-class="uni-list-cell-hover" >
        		<view class="uni-list-cell-navigate uni-navigate-right uni-media-list uni-flex uni-row row2"  @click="open">
        			<view class="uni-media-list-body m-list-item">
        				<view class="uni-media-list-text-top">导航背景颜色</view>
        			</view>
                    <view class="">
                    	<view class="uni-media-list-text-top">
                            <view class="color-span" :style="{'background-color': 'rgb('+color.r+','+color.g+','+color.b+','+ color.a +')'}"></view>
                            <t-color-picker ref="colorPicker" :color="color" @confirm="confirm"></t-color-picker>
                        </view>
                    </view>
        		</view>
        	</view>
            
            <view class="uni-list-cell" hover-class="uni-list-cell-hover" >
            	<view class="uni-list-cell-navigate uni-navigate-right uni-media-list uni-flex uni-row row2"  @click="clearView">
            		<view class="uni-media-list-body m-list-item">
            			<view class="uni-media-list-text-top">清理查看记录</view>
            		</view>
                    <view>
                    	<view class="uni-media-list-text-top">
                            <view>
                                <text>{{viewCount}}个</text>
                                <!-- <view v-if="viewCount>0" class="m-clear-text uni-icon uni-icon-trash"></view> -->
                            </view>
                        </view>
                    </view>
            	</view>
            </view>
        </view>
    </view>
</template>

<script>
    import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
	export default {
        components: {
			tColorPicker
		},
        data(){
            return {
                color: {r: 255,g: 0,b: 0,a: 1},
                viewCount: 0,
            }
        },
        onLoad() {
            this.color = this.hexToRgb(uni.getStorageSync('nav-bg-color'));
            this.getViewCount();
        },
		methods: {
            open(item) {
                // 打开颜色选择器
                this.$refs.colorPicker.open();
            },
            confirm(e) {
                this.color = e.rgba;
                console.log(this.color)
                uni.setStorageSync('nav-bg-color', 'rgb('+this.color.r+','+this.color.g+','+this.color.b+','+ this.color.a +')');
            },
            hexToRgb(hex) {
                hex = hex||'#f9f9f9';
                var rgb = {};
                if(hex.length == 4 || hex.length == 7){//hex
                    if(hex.length == 4){//转换为6位
                        let arr = hex.split("");
                        for(var i = 1; i < 4; i++){
                            arr[i] = arr[i].repeat(2);
                        }
                        hex = arr.join("");
                    }
                    rgb.r = parseInt('0x' + hex.slice(1, 3));
                    rgb.g = parseInt('0x' + hex.slice(3, 5));
                    rgb.b = parseInt('0x' + hex.slice(5, 7));
                    rgb.a = 1;
                }else if(hex){
                    let arr = hex.replace(/rgb|\(|\)/g, '').split(",");
                    rgb.r = arr[0];
                    rgb.g = arr[1];
                    rgb.b = arr[2];
                    if(arr.length == 4){
                        rgb.a = arr[3];
                    }
                }
                return rgb;
            },
            getViewCount(){
                this.$DB.viewCount().then(res => {
                    this.viewCount = res[0]['count'];
                });
            },
            clearView(){
                if(this.viewCount > 0){
                    let _this = this;
                    uni.showModal({
                        title: '提示',
                        content: '确认要删除吗？',
                        success: function(res){
                            if (res.confirm) {
                                _this.$DB.clearView().then(res => {
                                    _this.$showToast('清理完毕');
                                    _this.viewCount = 0;
                                });
                            }
                        }
                    });
                }
            }
		}
	}
</script>


<style>
    
    .page{
        width: 100%;
        background-color: #f5f5f5;
    }
    .color-span{
        width: 60upx;
        height: 40upx;
    }
	.flex-item {
		width: 33.3%;
		height: 200upx;
		text-align: center;
		line-height: 200upx;
	}
    .blank{
         height: 20upx;
    }
	.flex-item-V {
		width: 100%;
		height: 150upx;
		text-align: center;
		line-height: 150upx;
	}

    .row-item{
        background-color: #FFFFFF;
    }
    
    .uni-media-list-logo{
        width: 50upx;
        height: 50upx;
    }
    
    .m-list-item{
        -webkit-flex: 1;
        flex: 1;
        -webkit-justify-content: left;
        justify-content: center;
        -webkit-align-items: center;
        align-items: left;
    }
    
    .tips{
        margin-top: 200upx;
        -webkit-flex: 1;
        flex: 1;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    
	.text {
		margin: 15upx 10upx;
		padding: 0 20upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #777;
		font-size: 26upx;
	}

    .imgPhotoBoxWrap{
        /* border: 10upx solid #f9f9f9; */
        border-radius: 50%;
    }
    .imgPhotoBox{
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        overflow: hidden;
        
    }
    
    image{
        width: 100upx;
        height: 100upx;
        border-radius: 50% !important;
    }
    
    .imgPhoto{
        width: 60upx;
        height: 60upx;
        margin-top: 14upx;
    }


    .a-link{
        color: #0FAEFF;
    }

	.desc {
		/* text-indent: 40upx; */
	}
    
    .m-clear-text{
        color: #CCCCCC;
        font-size: 14px;
    }
</style>
