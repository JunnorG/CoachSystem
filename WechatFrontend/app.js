// app.js
App({
  globalData: {
    credit: 0, // 初始值设为0
    userInfo: null,
    // 其他全局数据...
  },

  getCredit(){
    return this.globalData.credit
  },

  setCredit(credit){
    this.globalData.credit = credit
  },

  onLaunch() {
    // 初始化时可以从缓存或服务器加载数据
    const credit = 9.5;
    this.globalData.credit = credit;
  }
})