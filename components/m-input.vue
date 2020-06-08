<template>
	<view  :class="showClass" class="m-input-view">
		<input :focus="focus" :type="inputType" :value="value" @input="onInput" class="m-input-input" :placeholder="placeholder"
		 :password="type==='password'&&!showPassword" @focus="onFocus" @blur="onBlur" />
		<!-- 优先显示密码可见按钮 -->
		<view v-if="clearable&&!displayable&&value.length" class="m-input-icon">
			<m-icon color="#666666" type="clear" @click="clear"></m-icon>
		</view>
		<view v-if="displayable" class="m-input-icon">
			<m-icon :style="{color:showPassword?'#666666':'#cccccc'}" type="eye" @click="display"></m-icon>
		</view>
	</view>
</template>

<script>
	import mIcon from './m-icon/m-icon.vue'

	export default {
		components: {
			mIcon
		},
		props: {
			/**
			 * 输入类型
			 */
			type: String,
			/**
			 * 值
			 */
			value: String,
			/**
			 * 占位符
			 */
			placeholder: String,
			/**
			 * 是否显示清除按钮
			 */
			clearable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 是否显示密码可见按钮
			 */
			displayable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 自动获取焦点
			 */
			focus: {
				type: [Boolean, String],
				default: false
			},
            validate: String
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				/**
				 * 显示密码明文
				 */
				showPassword: false,
				/**
				 * 是否获取焦点
				 */
				isFocus: false,
                showClass: '',
			}
		},
		computed: {
			inputType() {
				const type = this.type
				return type === 'password' ? 'text' : type
			}
		},
		methods: {
			clear() {
				this.$emit('input', '')
			},
			display() {
				this.showPassword = !this.showPassword
			},
			onFocus() {
				this.isFocus = true
			},
			onBlur(e) {
                let val = e.detail.value;
                val = val.trim();
                if(this.validate){
                    if(this.validate == 'chinese'){//中文
                        if(!/^[\u4e00-\u9fa5]+$/.test(val)){
                            this.clear();
                            return;
                        }
                    }else if(this.validate == 'english'){
                        if(/[\u4e00-\u9fa5]/.test(val)){
                            this.clear();
                            return;
                        }
                    }
                }
				this.$nextTick(() => {
					this.isFocus = false
				})
			},
			onInput(e) {
                let val = e.detail.value;
                val = val.trim();
                this.value = val;
				this.$emit('input', val)
			}
		}
	}
</script>

<style>
	.m-input-view {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		/* width: 100%; */
		flex: 1;
		/* padding: 0 10px; */
	}

	.m-input-input {
		flex: 1;
		width: 100%;
		min-height: 100%;
		line-height: inherit;
        font-size: 28upx;
		background-color: rgba(0, 0, 0, 0);
	}

	.m-input-icon {
		width: 20px;
		font-size: 20px;
		line-height: 20px;
		color: rgba(53, 53, 53, 0.6);
	}
    
    .m-input-error{
        border-bottom: 1px solid #FF0000;
    }
</style>
