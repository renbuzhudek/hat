import WeCropper from '../../lib/we-cropper/we-cropper';
import wxs from '../../lib/miniprogram-api-promise/index';

const app = getApp();

// 获取设备信息
const device = wx.getSystemInfoSync();
// 示例为一个与屏幕等宽的正方形裁剪框
const width = device.windowWidth;
const height = width;
const w = width - 48;
app.globalData.width = width;
Component({
  data: {
    src: null,
    cropper: null,
    cropperOpt: {
      // 用于手势操作的canvas组件标识符
      id: 'cropper',
      // 用于用于生成截图的canvas组件标识符
      targetId: 'targetCropper',
      // 传入设备像素比
      pixelRatio: device.pixelRatio,
      // 画布宽度
      width,
      // 画布高度
      height,
      // 最大缩放倍数
      scale: 2.5,
      // 缩放系数
      zoom: 8,
      cut: {
        // 裁剪框x轴起点
        x: (width - w) / 2,
        // 裁剪框y轴期起点
        y: (width - w) / 2,
        // 裁剪框宽度
        width: w,
        // 裁剪框高度
        height: w,
      },
    },
  },
  observers: {
    src(value) {
      if (!value) {
        return;
      }
      if (!this.data.cropper) {
        this.init();
      }
      // 设置图片字段
      this.data.cropper.pushOrign(value);
    },
  },
  methods: {
    // 获取用户信息
    getUserInfo(e) {
      const message = e.detail.errMsg;
      if (!/ok/.test(message)) {
        return;
      }
      this.setSrc(e.detail.userInfo);
    },
    // 选择相册照片
    onChoice() {
      wxs
        .chooseImage({ count: 0 })
        .then((res) => {
          const {
            tempFilePaths: [path],
          } = res;
          this.setData({ src: path });
        })
        .catch(() => {});
    },
    onNext() {
      this.data.cropper
        ?.getCropperImage()
        .then((path) => {
          const url = `/pages/design/index?url=${path}`;
          wx.navigateTo({ url });
        })
        .catch(() => {
          wx.showToast({ title: '获取图片地址失败，请稍后重试', icon: 'none', mask: true });
        });
    },
    // 是否授权
    isAuthorization() {
      return wxs.getSetting().then((res) => {
        if (res.authSetting['scope.userInfo']) {
          return wxs.getUserInfo().then((data) => data.userInfo);
        }
        return Promise.reject();
      });
    },
    // 设置图片
    setSrc(userInfo) {
      const { avatarUrl } = userInfo;
      const arr = avatarUrl.split('/');
      const src = [...arr.slice(0, -1), '0'].join('/');
      this.setData({ src });
    },
    // 初始化剪切
    init() {
      const { cropperOpt } = this.data;
      this.data.cropper = new WeCropper(cropperOpt);
    },
    touchStart(e) {
      this.data.cropper?.touchStart(e);
    },
    touchMove(e) {
      this.data.cropper?.touchMove(e);
    },
    touchEnd(e) {
      this.data.cropper?.touchEnd(e);
    },
  },
  attached() {
    this.isAuthorization()
      .then((res) => {
        this.setSrc(res);
      })
      .catch(() => {});
  },
});
