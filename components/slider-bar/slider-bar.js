// components/slider-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{
      name: "水果"
    }, {
      name: "蔬菜"
    }, {
      name: "肉类"
    }, {
      name: "饮料"
    }, {
      name: "牛奶"
    }, {
      name: "调料"
    }, {
      name: "酒水"
    }, {
      name: "冰淇淋"
    }, {
      name: "衣服"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#slider-bar').boundingClientRect(function (res) {
        // res.top // 这个组件内 #the-id 节点的上边界坐标
        console.log(res.top);
      }).exec()
    },
    fixed () {
      const query = wx.createSelectorQuery().in(this);
      query.select('#slider-bar').boundingClientRect(function (res) {
        // res.top // 这个组件内 #the-id 节点的上边界坐标
        console.log(res.top);
      }).exec()
    }
  },

  lifetimes: {
    ready: function () {
      console.log(111);
      const query = wx.createSelectorQuery()
      query.select('.slider-bar').boundingClientRect(function (res) {
        console.log(222);
        // res.top // #the-id 节点的上边界坐标（相对于显示区域）
        console.log(res);
      })

      query.exec()
    }
  },
})