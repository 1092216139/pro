<template>
	<!-- 首页 -->
	<view class="content">
		<!-- 轮播图 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" @change="swiperChange" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					 :duration="duration" circular>
						<swiper-item class="swiper_item" v-for="(item,index) in background" :key="item.id">
							<image :class="[swiperCurrent == index ? 'img_current':'img']" :src="item.image"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 身体 -->
		<view class="main">
			
		</view>
		
		<!-- 页脚 -->
		<view class="footer">
			<view>我的</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: [],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				swiperCurrent: 0, //激活样式中间图片变大
			}
		},
		onLoad() {
			this.banner()
		},
		methods: {
			// 轮播图中间变大
			swiperChange: function(e) {
				// 获取到马上要被出发的索引
				let index = e.detail.current
				// 当前这个变大
				this.swiperCurrent = index
			},

			// 轮播图
			async banner() {
				const res = await this.$req({
					url: '/api/ad/adPos/show',
					method: 'get',
					data: {
						code: "home_index_banner",
					}
				})
				this.background = res.data.data.ads
			}

		}
	}
</script>
<style lang='scss'>
	.page-section-spacing {
		position: relative;
	}

	.swiper {
		height: 380rpx;
		text-align: center;
	}

	.swiper_item {
		width: 80% !important;
		left: 84upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.img {
		width: 88%;
		height: 88%;
		border-radius: 10px;
	}

	.img_current {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
</style>
