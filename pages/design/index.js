import wxs from '../../lib/miniprogram-api-promise/index';

const app = getApp();
Page({
  data: {
    url: null,
    tabs: [
      { title: '国旗', value: ['/image/china.png'] },
      { title: '本地', value: [] },
    ],
    activeTab: 0,
    rotate: [],
  },
  onLoad({ url } = {}) {
    this.setData({ url });
  },
  onBack() {
    wx.navigateBack();
  },
  onNext() {},
  // 本地上传文件
  onUp(e) {
    const { index } = e.currentTarget.dataset;
    const li = this.data.tabs[index].value;
    wxs
      .chooseImage()
      .then((res) => {
        const { tempFilePaths } = res;
        li.push(...tempFilePaths);
        this.setData({ tabs: this.data.tabs });
      })
      .catch(() => {});
  },
  // 点击图片
  choice(e) {
    const { src } = e.currentTarget.dataset;
    const w = app.globalData.width;
    const left = w / 2;
    this.data.rotate.map((item) => {
      const obj = item;
      obj.show = false;
      return obj;
    });
    this.data.rotate.push({
      src,
      left,
      top: left,
      show: true,
    });
    this.setData({ rotate: this.data.rotate });
  },
  // 属性被变更
  onShowChange(e) {
    const { index } = e.currentTarget.dataset;
    const li = this.data.rotate[index];
    if (!li) {
      return;
    }
    li.show = true;
    this.setData({ rotate: this.data.rotate });
  },
  onGlobalClick() {
    const arr = this.data.rotate.map((item) => {
      const i = item;
      i.show = false;
      return i;
    });
    this.setData({ rotate: arr });
  },
  // 滑动开始
  touchstart(e) {
    const { index } = e.currentTarget.dataset;
    const li = this.data.rotate[index];
    if (!li) {
      return;
    }
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    li.moveLeft = x;
    li.moveTop = y;
    li.show = true;
    this.setData({ rotate: this.data.rotate });
  },
  // 滑动移动
  touchmove(e) {
    const { index } = e.currentTarget.dataset;
    const li = this.data.rotate[index];
    if (!li) {
      return;
    }
    const { moveLeft = 0, moveTop = 0 } = li;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const left = x - moveLeft;
    const top = y - moveTop;
    li.left += left;
    li.top += top;
    li.moveLeft = x;
    li.moveTop = y;
    this.setData({ rotate: this.data.rotate });
  },
});
