// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.createIntersectionObserver(this, {
      observeAll: true,
    }).relativeToViewport().observe('.goods-classify', (res) => {
      console.log(res.dataset);
      console.log(res.intersectionRatio);
      console.log("=================");
    });
  },
  onPageScroll: function () {
    this.selectComponent("#slider-bar").fixed();
  },
  onTap() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#slider-bar').boundingClientRect(function (res) {
      res.top // 这个组件内 #the-id 节点的上边界坐标
    }).exec()
  }
})