import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
//get请求
export const get = (url,data) => {
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作
		return response;
	}
    return http.get(url,data);
}
//post请求
export const post = (url,data) => {
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化post')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.post(url,data);
}
// 轮播图
export const banner = (data) => {
    return http.request({
        url: '/banner/36kr',
        method: 'GET', 
        data,
		// handle:true
    })
}

//上传图片
export const uploadImg = (url,name, filePath, options) => {
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作
		return response;
	}
    return http.uploadImg(url, name, filePath, options);
}

export const getMac = () => {
    var Mac = {
        address: function() {
            var Build = plus.android.importClass('android.os.Build');
            if (Build.VERSION.SDK_INT < 23) //android 6.0以下版本
            {
                return this.WifiInfoMac();
            } else if (Build.VERSION.SDK_INT == 23) //android 6.0
            {
                return this.ReaderMac();
            } else {
                return this.NetworkMac();
            }
        },
        WifiInfoMac: function() {
            var Context = plus.android.importClass("android.content.Context");
            var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
            var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
            var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
            var wifiInfo = wifiManager.getConnectionInfo();
            return wifiInfo.getMacAddress();
        },
        ReaderMac: function() {
            try {
                var BufferedReader = plus.android.importClass("java.io.BufferedReader");
                var FileReader = plus.android.importClass("java.io.FileReader");
                var file = new FileReader("/sys/class/net/wlan0/address");
                var reader = new BufferedReader(file, 256);
                var address = reader.readLine();
                reader.close();
                return address;
            } catch(error) {
                this.NetworkMac();
                return "02:00:00:00:00:00";
            }
        },
        NetworkMac: function() {
            var NetworkInterface = plus.android.importClass("java.net.NetworkInterface");
            var networkInterface = NetworkInterface.getByName("eth1");
            if (networkInterface == null) {
                networkInterface = NetworkInterface.getByName("wlan0");
            }
            if (networkInterface == null) {
                this.isWifi();
                return "02:00:00:00:00:00";
            }
            var mac = networkInterface.getHardwareAddress();
            var macArr = [];
            for (var i in mac) {
                macArr.push(this.format(mac[i]));
            }
            return macArr.join(":");
        },
        format: function(mac) {
            if (parseInt(mac) >= 0) {
                var numbder = parseInt(mac).toString(16);
                var num = numbder.length == 1 ? "0" + numbder: numbder;
                return num;
            } else {
                var numbder = parseInt(256 - Math.abs(mac)).toString(16);
                var num = numbder.length == 1 ? "0" + numbder: numbder;
                return num;
            }
        },
        isWifi: function() {
            if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_WIFI) {
                return "02:00:00:00:00:00";
            } else {
                plus.nativeUI.confirm("需要打开WiFi才能获取到MAC地址,是否去打开WiFi",
                function(event) {
                    if (event.index == 0) {
                        var main = plus.android.runtimeMainActivity();
                        var Intent = plus.android.importClass('android.content.Intent');
                        var intent = new Intent();
                        intent.setClassName("com.android.settings", "com.android.settings.wifi.WifiSettings");
                        main.startActivity(intent);
                    }
                });
            }
        }
    };
    return Mac.address();
}

//获取设备信息
export const getDeviceInfo = (_successCallback, _failCallback, hasTip) => {
    let device = plus.device;
    device.getInfo({
        success:function(e){
            let data = {
                imei: e.imei,
                imsi: typeof e.imsi == 'string' ? e.imsi : e.imsi[0],
                model: device.model,
                brandName: device.vendor,
                androidId: getAndroidId(),
                mac: getMac()
            };
            _successCallback(data);
        },
        fail:function(e){
            if(hasTip){
                uni.showToast({
                    title:'请授权获取设备信息，否则无法授权登录',
                    duration:5000,
                    icon:'none'
                });
            }
            
            if(_failCallback){
                _failCallback(e);
            }
        }
    });
}

export const getAndroidId = () => {
    var mainActivity = plus.android.runtimeMainActivity();
    var Settings = plus.android.importClass("android.provider.Settings");
    let androidId = Settings.Secure.getString(mainActivity.getContentResolver(), Settings.Secure.ANDROID_ID);
    return androidId;
}

export const getLocations = (_successCallback, _failCallback, hasTip) => {
    uni.getLocation({
        type: 'wgs84',
        success: function(res) {
            _successCallback(res);
        },
        fail:function(res){
            if(hasTip){
                var math;
                if(math = res.errMsg.match(/.*geolocation:(\d+).*/)){
                    if(math[1] == 9){
                        msg = "请重新启动GPS定位，重新进入app";
                    }else if(math[1] == 12){
                        msg = "请启动GPS定位，重新进入app";
                    }else{
                        msg = "请检查是否启动GPS定位，是否授权app定位。";
                    }
                    var msg = '定位失败，请重新进入app';
                    
                    uni.showToast({
                        title: msg,
                        duration: 4000,
                        icon: 'none'
                    });
                    
                        // setTimeout(function(){
                        //     plus.runtime.quit();
                        // }, 3000);
                    
                }else if(res.errMsg.match(/.*getLocation:fail.*/)){
                    // # ifdef APP-PLUS
                        uni.showToast({
                            title:'请到应用->权限设置中将地理位置权限打开，否则无法领取礼品',
                            duration:5000,
                            icon:'none'
                        });
                        
                        setTimeout(function(){
                            openSetting();
                        }, 5000);
                    // # endif
                    
                    // # ifdef H5
                        uni.showToast({
                            title:'请授权地理位置，否则无法通过审核',
                            duration:3000,
                            icon:'none'
                        });
                    // # endif
                }
            }
            if(_failCallback){
                _failCallback(res);
            }
        }
    });
}

export const addPermissions = function(permissions, succCallback,failCallback){//获取设备权限
    // #ifdef APP-PLUS
    plus.android.requestPermissions(permissions, function(res){
        var msg = [];
        if(permissions.indexOf("android.permission.ACCESS_COARSE_LOCATION")!=-1
         && res.granted.indexOf("android.permission.ACCESS_COARSE_LOCATION")<0){
            msg.push("位置信息");
        }
        
        if(permissions.indexOf("android.permission.READ_PHONE_STATE")!=-1 
        && res.granted.indexOf("android.permission.READ_PHONE_STATE")<0){
            msg.push("设备信息");
            
        }
        
        if(msg.length>0){
            uni.showToast({
                title: '请到应用->权限管理中找到本app，开启'+ msg.join('、') +'权限',
                duration: 4000,
                icon: 'none'
            });
            setTimeout(function() {
                openSetting();
            }, 3500);
            
            if(typeof failCallback == 'function'){
                failCallback(res);
            }
        }
        if(typeof succCallback == 'function'){
            succCallback(res);
        }
        
    }, function(res){
        console.log(res);
    });
    // #endif
    
    // #ifdef H5
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            if(typeof succCallback != 'undefined'){
                succCallback(position.coords);
            }
            // "Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude;	
        },showError);
    } else {
        if(failCallback){
            failCallback();
        }
        // "Geolocation is not supported by this browser."
    }

    function showError(error)
    {
        switch(error.code)  {
            case error.PERMISSION_DENIED:
              //"User denied the request for Geolocation."
              break;
            case error.POSITION_UNAVAILABLE:
              //"Location information is unavailable."
              break;
            case error.TIMEOUT:
              //"The request to get user location timed out."
              break;
            case error.UNKNOWN_ERROR:
              //"An unknown error occurred."
              break;
        }
        failCallback(error);
      }
    // #endif
}

export const openSetting = function(){
    // App跳转系统的设置界面
    // #ifdef APP-PLUS
    var main = plus.android.runtimeMainActivity(); //获取activity  
    var Intent = plus.android.importClass('android.content.Intent');  
    var Settings = plus.android.importClass('android.provider.Settings');  
    var intent = new Intent(Settings.ACTION_SETTINGS);//可设置表中所有Action字段  
    main.startActivity(intent);
    // #endif
}

function transfer(q){
	return http.baiduTrans(q);
}

function youdao(q){
	return http.youdaoTrans(q);
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	get,
	post,
    banner,
    uploadImg,
    baseUrl: http.config.baseUrl,
    getDeviceInfo,
    getAndroidId,
    getLocations,
    addPermissions,
    openSetting,
	transfer,
	youdao
}