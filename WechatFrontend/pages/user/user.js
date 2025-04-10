Page({
  data: {
    userInfo: {
      avatarUrl: '', // 从微信获取或默认头像
      nickName: '',  // 用户自定义名称
      wechatId: 'wxid_123456' // 示例微信ID
    },
    defaultName: '', // 默认UUID名称
    remainingCourses: 5, // 剩余课程数
    showEditModal: false,
    newUsername: ''
  },
  
  onLoad: function() {
    // 生成默认UUID用户名
    const uuid = this.generateUUID();
    this.setData({
      defaultName: uuid,
      'userInfo.nickName': uuid
    });
    
    // 获取用户微信信息
    this.getUserProfile();
  },
  
  // 生成UUID
  generateUUID: function() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  },
  
  // 获取用户微信信息
  getUserProfile: function() {
    console.log("come into get user profile")
    wx.getUserProfile({
      desc: '用于展示用户信息',
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.userInfo.avatarUrl
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败', err);
        // 设置默认头像
        this.setData({
          'userInfo.avatarUrl': '/images/default-avatar.png'
        });
      }
    });
  },
  
  // 编辑用户名
  editUsername: function() {
    this.setData({
      showEditModal: true,
      newUsername: this.data.userInfo.nickName || this.data.defaultName
    });
  },
  
  // 输入用户名
  inputUsername: function(e) {
    this.setData({
      newUsername: e.detail.value
    });
  },
  
  // 取消编辑
  cancelEdit: function() {
    this.setData({
      showEditModal: false
    });
  },
  
  // 确认编辑
  confirmEdit: function() {
    if (this.data.newUsername.trim() === '') {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      'userInfo.nickName': this.data.newUsername,
      showEditModal: false
    });
    
    // 这里可以添加保存到服务器的逻辑
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },
  
  // 跳转到剩余课程页面
  navigateToRemainingCourses: function() {
    wx.navigateTo({
      url: '/pages/remainingCourses/remainingCourses'
    });
  },
  
  // 跳转到购买课程页面
  navigateToBuyCourses: function() {
    wx.navigateTo({
      url: '/pages/buyCourses/buyCourses'
    });
  },

  // 跳转到订单界面
  navigateToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  }
});