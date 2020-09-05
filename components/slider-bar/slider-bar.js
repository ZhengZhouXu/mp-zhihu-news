// components/slider-bar.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: [Number, String],
      value: 0
    },
    position: {
      type: String,
      value: "static"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{
      name: "水果水果"
    }, {
      name: "蔬菜蔬菜"
    }, {
      name: "肉类肉类"
    },{
      name: "牛奶"
    }, {
      name: "饮料"
    },  {
      name: "调料"
    }, {
      name: "酒水"
    }, {
      name: "冰淇淋"
    }, {
      name: "衣服"
    }],
    isFixed: false,
    computedTop: 0,
    activeIndex: 0
  },

  /**
   * 自定义数据
   */
  current: null,

  /**
   * 组件的方法列表
   */
  methods: {
    scrollFixed() {
      const current = this.current;
      if (current) {
        current.exec()
      }
    },
    observerContent(className) {
      const query = wx.createSelectorQuery();
      query.selectAll('.goods-classify').boundingClientRect((res) => {
        let len = res.length;
        let i = 0;
        for (i = 0; i < len; i++) {
          let item = res[i];
          if (item.top < 210 && item.bottom > 200) {
            break;
          }
        }
        i = i >= len ? 0 : i;

        if (i != this.data.activeIndex) {
          this.setData({
            activeIndex: i
          });
        }
        
        console.log(i >= len ? 0 : i)
      }).exec();
    },
    onItemTap(e) {
      // console.log(e);
      let index = e.currentTarget.dataset.index || 0;
      this.setData({
        activeIndex: index
      });
      this.triggerEvent('sliderBarTap', {
        index
      });
    },
    debounce (fn, wait, firstImmediate) {
      let timer = null;
      return () => {
        clearTimeout(timer);
        if (timer === null && firstImmediate) {
          fn();
        }

        timer = setTimeout(() => {
          console.log(9999);
          fn();
          // timer = clearTimeout(timer);
        }, wait);
      }
    },
    init () {
      this.initComputedTop();
      this.initEl();
    },
    initEl () {
      // 初始化组件元素
      const query = wx.createSelectorQuery().in(this);
      const topThreshold = this.data.computedTop;
      this.current = query.select('.slider-bar-wrapper').boundingClientRect((res) => {
        if (res.top <= topThreshold && !this.data.isFixed) {
          this.setData({
            isFixed: true
          })
        } else if (res.top > topThreshold && this.data.isFixed) {
          this.setData({
            isFixed: false
          })
        }
      });
    },
    initComputedTop () {
      // 初始化top距离
      let computedTop = 0;
      const top = this.properties.top;
      if (typeof top === "number") {
        computedTop = top;
      } else if (typeof top === "string") {
        const pxReg = /([0-9]+)px/;
        const rpxReg = /([0-9]+)rpx/;
        if (pxReg.test(top)) {
          computedTop = Number(RegExp.$1);
        } else if (rpxReg.test(top)) {
          console.log(top)
          // console.log(RegExp.$1)
          const numTop = Number(RegExp.$1)
          console.log();
          
          const screenWidth = wx.getSystemInfoSync().windowWidth;
          const ratio = screenWidth / 750;
          console.log(ratio)
          // console.log(Number(RegExp.$1.toString()));
          computedTop = Math.floor(numTop * ratio);
        } else {
          console.warn("Properties 'top' need px or rpx.");
        }
      } else {
        console.warn("Properties 'top' error in type. Need type string or number.");
      }

      this.setData({
        computedTop
      });
    }
  },
  ready: function() {
    this.init()
    this.observerContent = this.debounce(this.observerContent.bind(this), 30, true);
    this.fixed = this.debounce(this.scrollFixed.bind(this), 30, true);
  }
})