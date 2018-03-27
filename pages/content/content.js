// pages/content/content.js

Page({
  data: {
    title: '',
    body: {
      author: '',
      bio: '',
      avatar: '',
      nodes: []
    },
    image: '',
    imageSource: ''
  },
  onLoad: function (options) {
    const storyId = options.id
    const url = `https://news-at.zhihu.com/api/4/news/${storyId}`
    const that = this
    wx.request({
      url: url,
      success (res) {
        const data = res.data
        that.getBodyData(res.data.body)
        that.setData({
          title: data.title,
          htmlNode: res.data.body,
          image: data.image,
          imageSource: data.image_source
        }, () => {
          // console.log(that.data.body)
          // that.getBodyData(that.data.body)
        })
      }
    })    
  },
  getBodyData (html) {    
    // 正则
    let titleReg = new RegExp('question-title.+?>(.+?)</h2>')
    let authorReg = new RegExp('author.+?>(.+?)<.+?>')
    let bioReg = new RegExp('bio.+?>(.+?)<.+?>')
    let avatarReg = new RegExp('avatar.+?src=\\"(.+?)\\">')
    let blockReg = new RegExp('(?:<p>(.+?)</p>)|(?:<ol>((.|\r\n)*?)</ol>)|(?:<ul>((.|\r\n)*?)</ul>)|(<img.+?src=\\"(.+?)\\".+?>)', 'g') // 获取所有段落
    let pReg =  new RegExp('<p>(.+?)</p>')
    let olReg = new RegExp('<ol>((.|\r\n)*?)</ol>')
    let ulReg = new RegExp('<ul>((.|\r\n)*?)</ul>')
    let pImgReg = new RegExp('<img.+?src=\\"(.+?)\\".+?>') // 获取段落里的图片

    let title = null
    let author = null
    let bio = null
    let avatar = null
    let pArr = []
    let rItem = null
    
    if (titleReg.test(html)) {
      title = titleReg.exec(html)[1]
    }
    if (authorReg.test(html)) {
      author = authorReg.exec(html)[1]
    }
    if (bioReg.test(html)) {
      bio = bioReg.exec(html)[1]
    }
    if (avatarReg.test(html)) {
      avatar = avatarReg.exec(html)[1]
    }
        
    // 推入pArr数组
    while (rItem = blockReg.exec(html)) {
      let matchStr = rItem[0]
  
      if (pImgReg.test(matchStr)) {
        let imgSrc = pImgReg.exec(matchStr)[1]
        pArr.push({
          src: imgSrc
        })
      } else if (olReg.test(matchStr)) { 
        // 获取所有的li
        pArr.push({
          ol: olReg.exec(matchStr)[1]
        })
      } else if (ulReg.test(matchStr)) {
        pArr.push({
          ul: ulReg.exec(matchStr)[1]
        })
      } else {
        pArr.push({
          text: pReg.exec(matchStr)[1]
        })      
      }
    }

    this.setData({
      body: {
        title,
        author,
        bio,
        nodes: this._convertToNodes(pArr),
        avatar
      }
    })
  },
  _getTextNodes (str) {
    let nodes = []
    
    // strong
    str = str.replace(/<strong>/g, '|split||strong|')
    str = str.replace(/<\/strong>/g, '|strong||split|')
    // em
    str = str.replace(/<em>/g, '|split||em|')
    str = str.replace(/<\/em>/g, '|em||split|')
    // a
    str = str.replace(/<a.+?href=/g, '|split|<a href=')
    str = str.replace(/<\/a>/g, '</a>|split|')

    nodes = str.split('|split|')
    nodes = nodes.map(item => {
      if (item.includes('|strong|')) {
        item = item.replace(/\|strong\|/g, '')
        return {
          name: 'strong',
          children: [{
            type: 'text',
            text: item
          }]
        }
      } else if (item.includes('|em|')) {
        item = item.replace(/\|em\|/g, '')
        return {
          name: 'em',
          children: [{
            type: 'text',
            text: item
          }]
        }
      } else if (item.includes('</a>')) {
        // 提取href
        let hrefReg = new RegExp('<a.*?href="(.+?)">', 'g')
        let href = hrefReg.exec(item)[1]

        // 提取text(去除a标签)
        let text = item.replace(hrefReg, '')        
        text = text.replace('</a>', '')
        return {
          name: 'a',
          attrs: {
            style: 'color: #01a2ed',
            href: href
          },
          children: [{
            type: 'text',
            text: text
          }]
        }
      } else {
        return {
          name: 'span',
          children: [{
            type: 'text',
            text: item
          }]
        }
      }
    })

    return nodes
  },
  _getOlAndUlNodes (str) {
    let nodes = []
    let liReg = new RegExp('<li>(.+?)</li>', 'g')
    let match = null
    while (match = liReg.exec(str)) {
      nodes.push({
        name: 'li',
        attrs: {
          class: 'rich-li'
        },
        children: this._getTextNodes(match[1])
      })
    }
    return nodes
  },
  _convertToNodes (pArr) {
    // 转化成字符串nodes
    let nodes = []
    pArr.forEach(item => {
      if (item.text) {
        nodes.push({
          name: 'p',
          attrs: {
            class: 'rich-p'
          },
          children: this._getTextNodes(item.text) // 提取textNodes
        })
      } else if (item.ol) {
        nodes.push({
          name: 'ol',
          children: this._getOlAndUlNodes(item.ol)
        })
      } else if (item.ul) {
        nodes.push({
          name: 'ul',
          attrs: {
            class: 'rich-ul'
          },
          children: this._getOlAndUlNodes(item.ul)
        })
      } else if (item.src) {
        nodes.push({
          name: 'img',          
          attrs: {
            class: 'rich-img',
            src: item.src
          }
        })
      }
    })
    // 写入nodes
    return nodes
  }
})