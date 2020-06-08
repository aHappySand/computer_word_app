//设置全局的showToast
export function showToast(msg){
	if(undefined != msg){
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: msg.length * 600
		});
	}
};

export function saveWordDetail(data){
    let _this = this;
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
                
                // _this.$api.post('/word/save', postData).then(function(res){
                    
                // });
            }
            console.log(data);
            _this.$DB.saveWord(data);
        }
    });
}