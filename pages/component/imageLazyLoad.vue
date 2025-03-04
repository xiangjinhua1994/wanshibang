<template>
    <view
        class="image-lazy-load"
        :style="{
            opacity: opacity,
            borderRadius: borderRadius + 'rpx',
            background: background,
            transition: `opacity ${time / 1000}s ease-in-out`,
        }"
        :class="'image-lazy-load-item-' + elIndex"
    >
        <view :class="'image-lazy-load-item-' + elIndex" style="height: 100%">
            <image
                :style="{ borderRadius: borderRadius + 'rpx', height: imgHeight, width: imgWidth }"
                v-if="!isError"
                class="image-lazy-load-item"
                :src="isShow ? imageUrl : loadingImg"
                :mode="imgMode"
                @load="imgLoaded"
                @error="loadError"
                @tap="clickImg"
            ></image>
            <view
                v-else
                class="image-lazy-load-item"
                :style="{ borderRadius: borderRadius + 'rpx', height: imgHeight, width: imgWidth, background: background }"
            >
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "ImageLazyLoad",
    props: {
        index: {
            type: [Number, String],
        },
        // 要显示的图片
        image: {
            type: String,
            default: "",
        },
        // 图片裁剪模式
        imgMode: {
            type: String,
            default: "aspectFill",
        },
        // 占位图片路径
        loadingImg: {
            type: String,
            default: "",
        },
        errorImg: {
            type: String,
            default: "",
        },
        threshold: {
            type: [Number, String],
            default: 300,
        },
        duration: {
            type: [Number, String],
            default: 300,
        },
        effect: {
            type: String,
            default: "ease-in-out",
        },
        isEffect: {
            type: Boolean,
            default: true,
        },
        borderRadius: {
            type: [Number, String],
            default: 0,
        },
        width: {
            type: [Number, String],
            default: "100%",
        },
        height: {
            type: [Number, String],
            default: "450rpx",
        },
        background: {
            type: String,
            default: "",
        },
        showErrorImg: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            imageUrl: this.image, 
            isShow: false,
            opacity: 1,
            time: this.duration,
            loadStatus: "", 
            isError: false, 
            elIndex: this.generateRandomString(32),
            isConnected: true, 
        };
    },
    computed: {
        getThreshold() {
            let thresholdPx = uni.upx2px(Math.abs(this.threshold));
            return this.threshold < 0 ? -thresholdPx : thresholdPx;
        },
        imgHeight() {
            return this.height;
        },
        imgWidth() {
            return this.width;
        },
    },
    created() {
        this.observer = {};
    },
    watch: {
        isShow(nVal) {
            if (!this.isEffect) return;
            this.time = 0;
            this.opacity = 0;
            setTimeout(() => {
                this.time = this.duration;
                this.opacity = 1;
            }, 30);
        },
        image(n) {
            if (!n) {
                this.isError = true;
            } else {
                this.init();
                this.isError = false;
            }
        },
        isConnected(newVal) {
            if (newVal) {
                this.init();
                this.isError = false;
                this.imageUrl = this.image + '?time=' + Date.now()
            }
        },
    },
    emits: ["click", "load"],
    methods: {
        init() {
            this.isError = false;
            this.loadStatus = "";
        },
        clickImg() {
            let whichImg = "";
            if (this.isShow == false) whichImg = "lazyImg";
            else if (this.isError == true) whichImg = "errorImg";
            else whichImg = "realImg";
            this.$emit("click", this.index);
        },
        imgLoaded() {
            if (this.loadStatus == "") {
                this.loadStatus = "lazyed";
            }
            else if (this.loadStatus == "lazyed") {
                this.loadStatus = "loaded";
                this.$emit("load", this.index);
            }
        },
        errorImgLoaded() {
            this.$emit("error", this.index);
        },
        loadError() {
            this.isError = true;
        },
        disconnectObserver(observerName) {
            const observer = this[observerName];
            observer && observer.disconnect();
        },
        generateRandomString(length) {
            let result = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        },
    },
    beforeUnmount() {
        //observer.disconnect();
    },
    mounted() {
        uni.onNetworkStatusChange((res) => {
            this.isConnected = res.isConnected;
        });
        setTimeout(() => {
            const contentObserver = uni.createIntersectionObserver(this);
            contentObserver
                .relativeToViewport({
                    bottom: this.getThreshold,
                })
                .observe(".image-lazy-load-item-" + this.elIndex, (res) => {
                    if (res.intersectionRatio > 0) {
                        this.isShow = true;
                        this.disconnectObserver("contentObserver");
                    }
                });
            this.contentObserver = contentObserver;
        }, 30);
    },
};
</script>

<style scoped lang="scss">
.image-lazy-load {
    background-color: #fff;
    overflow: hidden;

    &-item {
        width: 100%;
        transform: transition3d(0, 0, 0);
        will-change: transform;
        /* #ifndef APP-NVUE */
        display: block;
        /* #endif */
    }
}
</style>