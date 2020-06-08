/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import md5 from '../js/md5';
import SHA256 from '../js/sha256.js';
import myConf from "../myConf";

console.log(myConf)
/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	console.log(req)
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			// console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	console.log(res)
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			// console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		// console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch(_statusCode){
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}


export default {
	config: {
		baseUrl: myConf.CONFIG_API_BASE_URL,
		header: {
			'Content-Type':'application/x-www-form-urlencoded'
		},  
		data: {},
		method: "GET",
		dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	upload(options) {
        var _default = {
            responseType: "json",
            header:{
                'X-Token': uni.getStorageSync('info') ? uni.getStorageSync('info').token : ''
            }
        }
		if (!options) {
			options = {}
		}
        
		// options.baseUrl = options.baseUrl || this.config.baseUrl
		let networkBaseUrl= uni.getStorageSync('network_base_url');
		if(networkBaseUrl){
			options.baseUrl = networkBaseUrl;
		}else{
			options.baseUrl = options.baseUrl || this.config.baseUrl;
		}
		
		options.url = options.baseUrl + options.url
		options.formData = options.data || {}
        
		//TODO 加密数据
		
		//TODO 数据签名
		/* 
		_token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
		_sign = {'sign': sign(JSON.stringify(options.data))}
		options.header = Object.assign({}, options.header, _token,_sign) 
		*/
            
		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response.data);
				} else {
					reject(response.data)
				}
			}
                
			_config = Object.assign({}, _default, options)
			_config.requestId = new Date().getTime()
            
			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			
			// 统一的请求日志记录
			_reqlog(_config)

			uni.uploadFile(_config);
		});
	},
	request(options) {
		if (!options) {
			options = {}
		}
		//设置token值
		this.config.header['X-Token'] = uni.getStorageSync('info') ? uni.getStorageSync('info').token : '';
		this.config.header['Content-Type'] = 'application/x-www-form-urlencoded';
        if(options.data){
            options.data.versionName = myConf.API_VERSION;
        }
		return this.common_request(options);
	},
	common_request(options) {
		if (!options) {
			options = {}
		}
		
		options.data = options.data || {}
		
        if(options.url.indexOf('http') != 0){//说明使用基本配置
            options.url = this.config.baseUrl + options.url
        }
        
	    let _this = this;
		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response.data);
				}else if(statusCode >= 500) {
					uni.showToast({
						title: '服务器繁忙，请稍后再试，如有疑问，请联系客服',
						icon: 'none',
						duration: 5000
					});
					reject(response.data)
				} else if(statusCode >= 400) {
					uni.showToast({
						title: '访问错误',
						icon: 'none',
						duration: 5000
					});
					reject(response.data)
				}
			}
			_config = Object.assign({}, _this.config, options)
			_config.requestId = new Date().getTime()
	
			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			// 统一的请求日志记录
			_reqlog(_config)
			uni.request(_config);
		});
	},
	baiduTrans(q){//http://api.fanyi.baidu.com/doc/21
		let conf = myConf.BAI_DU;
		let sign = md5(conf.app_id+ q + conf.salt + conf.pwd);
		//http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
		let fromto = "from=en&to=zh";
		if(q.match(/[\u4E00-\u9FA5]+/)){//英文
			fromto = "from=zh&to=en";
		}
		let url = conf.base_url + "?q=" + encodeURIComponent(q) + "&" + fromto + "&appid=" + conf.app_id + "&salt=" + conf.salt + "&sign=" + sign;
		let options = {
			url: url,
			method: 'GET',
			dataType: 'jsonp',
			header: {
				'Access-Control-Allow-Origin': '*', //跨域加上头
				'Content-Type':'application/x-www-form-urlencoded'
			},
		};
		return this.common_request(options)
	},
	youdaoTrans(q){//http://api.fanyi.baidu.com/doc/21
		let conf = myConf.YOU_DAO, 
			curtime = parseInt(Date.now() / 1000),
			len = q.length;
			
		let	salt = parseInt(curtime * Math.random());
		
		let input = len > 20 ? q.slice(0, 10) + len + q.slice(-10, len) : q;
		let sign = SHA256(conf.appKey+ input + salt  + "" + curtime + conf.pwd);
		let fromto = "from=en&to=zh-CHS";
		if(q.match(/[\u4E00-\u9FA5]+/)){//英文
			fromto = "from=zh-CHS&to=en";
		}
		let url = conf.base_url + "?q=" + encodeURIComponent(q) + "&" + fromto + "&appKey=" + conf.appKey + "&salt=" + salt + "&sign=" + sign + "&signType=v3&curtime=" + curtime;
		let options = {
			url: url,
			method: 'GET',
			dataType: 'jsonp',
			header: {
				'Access-Control-Allow-Origin': '*', //跨域加上头
				'Content-Type':'application/x-www-form-urlencoded'
			},
		};
		return this.common_request(options)
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'  
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
    uploadImg(url, name, filePath, options){
        options = options || {};
        options.url = url;
        name && (options.name = name);
        filePath && (options.filePath = filePath);
        options.fileType = 'image';
        return this.upload(options);
    }
}