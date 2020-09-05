// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: "水果水果",
      sub: Array.of(8)
    }, {
      name: "蔬菜蔬菜",
      sub: Array.of(5)
    }, {
      name: "肉类肉类",
      sub: Array.of(9)
    },{
      name: "牛奶",
      sub: Array.of(3)
    }, {
      name: "饮料",
      sub: Array.of(6)
    },  {
      name: "调料",
      sub: Array.of(1)
    }, {
      name: "酒水",
      sub: Array.of(8)
    }, {
      name: "冰淇淋",
      sub: Array.of(3)
    }, {
      name: "衣服",
      sub: Array.of(6)
    }],
    activeIndex: 0
  },
  customData: {
    sliderBar: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.createIntersectionObserver(this, {
    //   observeAll: true,
    // }).relativeToViewport().observe('.goods-classify', (res) => {
    //   console.log(res.dataset);
    //   console.log(res.intersectionRatio);
    //   console.log("=================");
    // });
    this.customData.sliderBar =  this.selectComponent("#slider-bar");
  },
  onPageScroll: function () {
    // if (this.customData.sliderBar) {
    //   this.customData.sliderBar.fixed();
    // }
  },
  onScroll: function () {
    if (this.customData.sliderBar) {
      this.customData.sliderBar.observerContent("goods-classify");
    }
  },
  onSliderBarTap (e) {
    this.setData({
      activeIndex: e.detail.index || 0
    })
  }
})