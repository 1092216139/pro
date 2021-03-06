// router/modules/home.js
const home = [{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/index/index',
		aliasPath: '/', //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'index',
		meta: {
			title: '快通',
		},
	},
	{
		path: '/pages/login/login',
		name: 'login',
		meta: {
			title: '登录',
		},
	},
	{
		path: '/pages/tabbar/my/my',
		name: 'login',
		meta: {
			title: '我的',
		},
	},
	
]
export default home
