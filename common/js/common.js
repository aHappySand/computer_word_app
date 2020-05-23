//设置全局的showToast
var showToast=function(msg){
	if(undefined != msg){
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: msg.length * 600
		});
	}
    
};
export default showToast;