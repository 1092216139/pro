<template>
	<!-- 登录 -->
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="login-head">
					<image style="width: 100px;height: 100px;" src="../../static/img/ic_launcher.png" mode="scaleToFill"></image>
				</view>

				<view class="login-content-item">
					<image class="input-icon-image" style="width: 40rpx;height: 60rpx;" src="../../static/img/icon/phone.png" mode=""></image>

					<view class="login-input login-margin-b">

						<input type="number" v-model="username" placeholder="请输入手机号码" />

					</view>
				</view>

				<view class="login-content-item">
					<image class="input-icon-image" style="width: 40rpx;height: 50rpx;" src="../../static/img/icon/passcode.png" mode=""></image>

					<view class="login-input login-margin-b">

						<input type="number" v-model="code" placeholder="请输入验证码" />
						<view class="sendSmsBtn">
							<button type="primary" @click="sendMessage">{{codeText}}</button>
						</view>
					</view>
				</view>
				<!-- <view class="login-function">
					<view class="login-forget" @tap="forget">忘记密码</view>
					<view class="login-register" @tap="reg">快速注册></view>
				</view> -->
			</view>
		</view>
		<view class="login-btn" style="text-align: center;margin-top: 0;">
			<!-- <button class="landing" :loading="loading" type="primary" @tap="login">{{ loading ? "登录中...":"登陆"}}</button> -->
			<image src="../../static/img/icon/loginbtn.png" @tap="login" style="width: 85%;height: 60px;" mode="scaleToFill"></image>
		</view>
		<!-- 	<view class="login-btn">
			<evan-checkbox v-model="shapeChecked" shape="square">阅读并表示同意<text style="color: #09BB07;"><<用户协议>></text></evan-checkbox>
		</view> -->

	</view>
</template>

<script>
	export default {
		components: {

		},
		onNavigationBarButtonTap: function(e) {
			uni.navigateTo({
				url: '/pages/login/register'
			})
		},
		onLoad(e) {

			let token = uni.getStorageSync('token');
			let login = uni.getStorageSync('login');
			if (token != '' && login === 1) {
				uni.showToast({
					duration: 1000,
					title: '登录成功'
				});
				setTimeout((e => {
					uni.hideLoading()
					uni.switchTab({
						url: '../user/user'
					});
				}), 1000);
			}

		},
		data() {
			return {
				loading: false,
				username: "",
				shapeChecked: true,
				code: "",
				codeText: "获取验证码",
				btnDisabled: false
			};
		},
		methods: {
			qqlogin() {
				uni.navigateTo({
					url: '../qqlogin/qqlogin',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 点击发送验证码之前必须判断手机号不为空
			sendMessage() {
				if (this.btnDisabled) {
					return;
				}
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					});

					return;
				}
				api.post({
					url: '/services/sms/loginCode',
					data: {
						tel: this.username,
						device_type: api.DeviceType
					},
					success: data => {
						//console.log(data);
						if (data.code == 200) {
							this.code = data.data.code
							//console.log(data);
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: data.msg
							});
							this.getSecond(60);
						} else {

							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.msg
							});
						}
					}
				})

			},
			//发送验证码
			getSecond(wait) {
				let _this = this;
				let _wait = wait;
				if (wait == 0) {
					this.btnDisabled = false;
					this.codeText = "获取验证码"
					wait = _wait;
				} else {
					this.btnDisabled = true;
					this.codeText = "验证码(" + wait + "s)"
					wait--;
					setTimeout(function() {
							_this.getSecond(wait);
						},
						1000);
				}
			},
			// 登录
			login() {
				// this.loading = true;
				// if (!this.shapeChecked) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '请勾选用户协议'
				// 	});
				// 	this.loading = false;
				// 	return;
				// }
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					});

					return;
				}

				if (this.code == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});

					return;
				}
				api.post({
					url: '/api/user/user/login',
					data: {
						tel: this.username,
						smsCode: this.code,
						device_type: api.DeviceType
					},
					success: data => {
						//console.log(data);
						if (data.code == 200) {
							this.loading = false;
							//console.log(data);
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: data.msg
							});
							uni.setStorageSync('upload', 1)
							uni.setStorageSync('login', 1)
							uni.setStorageSync('token', data.data.jwt_token)//保存token
							uni.setStorageSync('user', data.data.user)

							setTimeout((e => {
								//强制页面重载，跳转到首页
								uni.reLaunch({
									url: '../user/user'
								});
							}), 500);
						} else {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.msg
							});
						}
					}
				})
			},
			reg() {
				uni.navigateTo({
					url: '../register/register'
				});
			},
			forget() {
				uni.navigateTo({
					url: '../forget/forget'
				});
			},
			//小程序登录
			onGotUserInfo() {
				uni.login({
					success: loginRes => {
						if (loginRes.code) {
							uni.getUserInfo({
								withCredentials: true,
								success: res => {
									//console.log(res)
									api.post({
										url: 'wxapp/public/login',
										data: {
											code: loginRes.code,
											encrypted_data: res.encryptedData,
											iv: res.iv,
											raw_data: res.rawData,
											signature: res.signature
										},
										success: data => {
											console.log(data)
											if (data.code == 1) {
												uni.showToast({
													title: '登录成功!',
													icon: 'success',
													duration: 500
												});
												//强制页面重载，跳转到首页
												uni.reLaunch({
													url: '../index/index'
												});
												try {
													uni.setStorageSync('upload', 1)
													uni.setStorageSync('login', 1)
													uni.setStorageSync('token', data.data.token)
													uni.setStorageSync('user', data.data.user)
												} catch (e) {}
												setTimeout(function() {
													uni.navigateBack()
												}, 500)
											}
										}
									});
								},
								fail: (res) => {
									if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
										uni.showModal({
											title: '用户授权失败',
											showCancel: false,
											content: '请删除此小程序重新授权!',
											success: function(res) {
												if (res.confirm) {
													console.log('用户点击确定')
												}
											}
										})
									}

								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.logbt {
		background: none;
		border: none !important;
		position: fixed;
		display: inline;
		margin-left: -76upx
	}

	.logbt:after {
		border: none !important;
	}

	image {
		width: 100upx;
		height: 100upx;
	}

	.landing {
		height: 94upx;
		line-height: 94upx;
		border-radius: 8upx;
		font-size: 35upx;
		/* background: linear-gradient(left, #86B5F4, #4790EF); */
		/* background-color: #09BB07; */
		background-image: url(../../static/img/icon/loginbtn.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;

	}

	.login-input {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		/* padding-left:30upx; */
		background: $page-color-light;
		height: 62rpx;
		border-radius: 20rpx;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 96rpx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			/* width: 469rpx; */
			border-radius: 20rpx;
			padding-left: 57rpx;
		}

	}



	.login-input input {
		/* background: #F2F5F6; */
		font-size: 34upx;
		padding: 14upx 0upx;
		height: 62upx;
		line-height: 62upx;
		/* border-radius: 8upx; */
		float: left;
	}

	.login-input text {
		float: left;
		font-size: 38upx;
		font-weight: 600;
		height: 62upx;
		line-height: 62upx;

	}

	.login-input {
		height: 80upx;
		line-height: 80upx;
		padding: 0upx 0upx;
		margin-top: 20rpx;
		border-bottom: 1px solid #dcb9b9;
		border-radius: 0;
		width: 85%;

	}

	.login-btn {
		padding: 10upx 20upx;
		margin-top: 20upx;
	}

	.login-function {
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}

	.login-content-item {
		margin-bottom: 20px;
	}

	.input-icon-image {
		float: left;
		width: 50rpx;
		height: 50rpx;
		margin-right: 10px;
	}

	.login-forget {
		float: left;
		font-size: 26upx;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 26upx;

	}

	.sendSmsBtn>button {
		background-color: #fff;
		font-size: 25rpx;
		font-weight: bold;
		border: 1px solid #dcb9b9;
		padding: 0px 20px;
		border-radius: 25px;
		height: auto;
		margin-left: -50px;
		color: #EE6728;
	}

	#code-btn {
		border: 1px solid #dcb9b9;
		padding: 0px 20px;
		font-size: 14px !important;
		border-radius: 25px;
		height: auto;
		margin-left: -50px;
		color: #dcb9b9;
	}



	.login-margin-b {
		margin-bottom: 20upx;
	}


	.login-head {

		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
		margin-bottom: 40px;
	}

	.login-card {
		/* background: #fff; */
		/* border-radius: 12upx; */
		/* padding: 10upx 25upx; */
		/* box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12); */
		position: relative;
		/* margin-top: 120upx; */
	}

	.login-bg {
		/* height: 260upx; */
		margin-top: 50px;
		padding: 25upx;
		/* background: linear-gradient(#86B5F4, #4790EF); */
	}
</style>
