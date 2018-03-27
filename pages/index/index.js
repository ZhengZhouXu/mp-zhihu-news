//index.js
//获取应用实例
const app = getApp()
let dateBefore = 0
/** example
 * storyList: [{
 *   title: 'xxx',
 *   stories: []
 * }]
 */
Page({
  data: {
    topStories: [],
    storyList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this._fetchNews()
  },
  onReachBottom: function () {
    dateBefore++
    this._fetchNews(getDate(dateBefore))
  },
  _fetchNews (date = "latest", success) {
    let url = `https://news-at.zhihu.com/api/4/news/${date === 'latest' ? date : 'before/' + date}`
    
    success = success || ((res) => {
      let data = res.data
      let topStories = this.data.topStories  
      let storyList = this.data.storyList
      let stories = this.data.stories

      data["top_stories"] && topStories.push(...data["top_stories"])
      storyList.push({
        title: this._getTitle(date),
        stories: data["stories"]
      })

      this.setData({
        topStories,
        storyList
      })
    })

    wx.request({url, success})
  },
  _getTitle (dateStr) {
    // 根据date得到标题
    if (dateStr === 'latest') {
      return '今日新闻'
    } else {
      // 测试
      let formatDate = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      let weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let date = new Date(formatDate)
      let week = weekMap[date.getDay()]

      let title = dateStr.replace(/\d{4}(\d{2})(\d{2})/, `$1月$2日 ${week}`)
      return title
    }
  }
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})

// 获取当前日期
function getDate (before = 0) {
  let date = new Date()
  date.setDate(date.getDate() - before)
  let year = date.getFullYear()
  let month = parseInt(date.getMonth()) + 1
  let day = date.getDate()

  month = month.toString().padStart(2, '0')
  day = day.toString().padStart(2, '0')

  return `${year}${month}${day}`
}
