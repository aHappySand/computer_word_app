<template>
	<view class="content">
        <view class="uni-flex uni-row m-head">
        	<view class="text uni-flex">
        		<image v-if="!hasLogin" src="../../static/img/notLogin.png" style="width: 150upx;height: 150upx;"></image>
        	</view>
        	<view class="uni-flex uni-row m-head-item"  v-if="!hasLogin">
                <view>点击</view>
                <view class="a-link"  @tap="bindLogin"> 登录 </view> / 
                <view class="a-link">注册</view>
        	</view>
            <view  v-if="hasLogin" class="uni-flex m-head-item" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: left;justify-content: left;-webkit-align-items: center;align-items: left;">
                <view class="uni-flex uni-row">昵称</view>
            </view>
        </view>
        <view class="blank"></view>
        
        <uni-list>
        	<uni-list-item title="资源包" thumb="../../static/img/pack.png" @click="navTo()"/>
            <uni-list-item title="设置" thumb="../../static/img/setting.png" @click="navTo()" />
            <uni-list-item title="有问题" thumb="../../static/img/backQ.png" />
            <uni-list-item title="关于" thumb="../../static/img/about.png" />
        </uni-list>
        </view>
    </view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		computed: {
			...mapState(['hasLogin', 'forcedLogin'])
		},
        components:{
          uniList,
          uniListItem  
        },
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/login',
				});
			},
			bindLogout() {
				this.logout();
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/login',
					});
				}
			},
            navTo(newUrl){
                uni.navigateTo({
                	url: '../set/set',
                });
            }
		}
	}
</script>


<style>
    
    .content{
        padding: 0;
    }
    
    .m-head{
        background-color: #FFFFFF;
        padding-bottom: 10upx;
    }
    

    
    uni-view{
        display: flex;
    }

    .row-item{
        background-color: #FFFFFF;
    }
    
    .uni-media-list-logo{
        width: 50upx;
        height: 50upx;
    }
    
    .m-head-item{
        margin-left: 24upx;
        -webkit-flex: 1;
        flex: 1;
        -webkit-justify-content: left;
        justify-content: left;
        -webkit-align-items: center;
        align-items: center;
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
    

    .imgPhotoBoxWrap{
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

	}
</style>
