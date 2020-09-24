import wxs from '../../lib/miniprogram-api-promise/index';

Page({
  data: {
    url: null,
    tabs: [
      { title: '国旗', value: ['/image/china.png'] },
      { title: '本地', value: [] },
    ],
    activeTab: 0,
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
});
