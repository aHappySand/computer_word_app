<template>
	<view>
        <uni-nav-bar class="uni_nav_bar" :fixed="true" :backgroundColor="navBgColor" color="#333333" :status-bar="true" :border="false" :title="navTitle" :shadow="false" :transparent="true" right-icon="more-filled"  @click-right="scan">
        </uni-nav-bar>
        <!-- <uni-nav-bar class="nav-bar" :title="navTitle" fixed=true status-bar=true shadow=false right-icon="more-filled"></uni-nav-bar> -->
<!--        <uni-nav-bar>
            <view class="nav-title">单词汇</view>
            <view slot="right">right</view>
        </uni-nav-bar>
 -->
		<view>
			<!-- <uni-indexed-list :options="list" :show-select="false" @click="bindClick" /> -->
            <m-indexed-list :options="wordList" :show-select="false" @click="bindClick" />
		</view>
	</view>
</template>

<script>
    import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
    import uniIcons from "@/components/uni-icons/uni-icons.vue"
	// import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
    import mIndexedList from '@/components/m-indexed-list/m-indexed-list.vue'
	export default {
		components: {
            uniNavBar,
            uniIcons,
			mIndexedList
		},
        onLoad() {

        },
        onShow() {
            let bgColor = uni.getStorageSync('nav-bg-color');
            if(bgColor){
                this.navBgColor = bgColor;
            }
        },
		data() {
			return {
                navBgColor: '#f9f9f9',
                navTitle: '单词汇',
                wordList: [
                    {
                    		"letter": "A",
                    		"data": [
                                {
                                    name: 'aaaaa',
                                    phonetic: '[fsfsf]',
                                    translation: '阿拉山口机场',
                                },
                    			{
                    			    name: 'aaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '阿拉山口机场',
                    			},
                    			{
                    			    name: 'aaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '阿拉山口机场',
                    			},
                    			{
                    			    name: 'aaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '阿拉山口机场',
                    			},
                    			{
                    			    name: 'aaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '阿拉山口机场',
                    			},
                    			{
                    			    name: 'aaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '阿拉山口机场',
                    			}
                    		]
                    	}, {
                    		"letter": "B",
                    		"data": [
                    			{
                    			    name: 'baaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '保山机场',
                    			},
                    			{
                    			    name: 'baaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '包头机场',
                    			},
                    			{
                    			    name: 'baaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '包头机场3',
                    			},
                    			{
                    			    name: 'baaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '包头机场4',
                    			},
                    			{
                    			    name: 'baaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '包头机场5',
                    			},
                    			{
                    			    name: 'baaaaa',
                    			    phonetic: '[fsfsf]',
                    			    translation: '包头机场7',
                    			}
                    		]
                    	}
                ],
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
				console.log('点击item，返回数据' + JSON.stringify(e))
			},
            getWord(){
                
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
</style>
