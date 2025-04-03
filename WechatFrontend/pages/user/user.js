const app = getApp()
Page({
  data: {
    userInfo: null,
    credit: 0,
    history: []
  },
  
  onLoad() {
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
    
    // 获取用户课时和预订历史
    this.getUserData()
  },
  
  onShow() {
    this.setData({
      credit: app.getCredit()
    })
  },

  getUserData() {
    // 模拟数据
    this.setData({
      credit: app.globalData.credit, 
      history: [
        { id: 1, date: '2023-05-20', field: 1, time: '14:00-14:30' },
        { id: 2, date: '2023-05-18', field: 3, time: '19:00-20:00' },
        { id: 3, date: '2023-05-15', field: 2, time: '16:30-17:30' }
      ]
    })
  }
})