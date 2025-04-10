Page({
  data: {
    activeTab: 0, // 0-未完成 1-已完成 2-退订
    orderList: []
  },

  onLoad: function(options) {
    // 根据activeTab加载不同数据
    this.loadOrderData();
  },

  onShow() {
    wx.showTabBar();  // 强制显示 tabBar
    wx.setTabBarStyle({
      selectedColor: "#07C160",  // 确保选中颜色正确
    });
    // 强制选中 user Tab（视觉上保持高亮）
    wx.setTabBarItem({
      index: 1,  // user Tab 的索引（从 0 开始）
      selected: true,
    });
  },

  // 切换Tab
  switchTab: function(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({
      activeTab: tab
    }, () => {
      this.loadOrderData();
    });
  },

  // 加载订单数据
  loadOrderData: function() {
    // 模拟数据，实际项目中应该从服务器获取
    const mockData = {
      0: this.getUnfinishedOrders(),
      1: this.getFinishedOrders(),
      2: this.getCanceledOrders()
    };
    
    this.setData({
      orderList: mockData[this.data.activeTab]
    });
  },

  // 模拟未完成订单数据
  getUnfinishedOrders: function() {
    return [
      {
        id: 1,
        statusText: '进行中',
        time: '下单时间: 2023-05-15 14:30',
        coach: {
          avatar: '../../images/仓鼠.png',
          name: '张教练',
          level: '高级私人教练'
        },
        course: {
          type: '私教课-减脂',
          time: '2023-05-20 18:00-19:00',
          duration: 60
        },
        price: '299.00'
      },
      {
        id: 2,
        statusText: '待确认',
        time: '下单时间: 2023-05-16 10:15',
        coach: {
          avatar: '../../images/仓鼠.png',
          name: '李教练',
          level: '中级私人教练'
        },
        course: {
          type: '私教课-增肌',
          time: '2023-05-21 19:00-20:00',
          duration: 60
        },
        price: '259.00'
      }
    ];
  },

  // 模拟已完成订单数据
  getFinishedOrders: function() {
    return [
      {
        id: 3,
        statusText: '已完成',
        time: '完成时间: 2023-05-10 19:00',
        coach: {
          avatar: '../../images/coach3.jpg',
          name: '王教练',
          level: '高级私人教练'
        },
        course: {
          type: '私教课-塑形',
          time: '2023-05-10 18:00-19:00',
          duration: 60
        },
        price: '299.00'
      }
    ];
  },

  // 模拟退订订单数据
  getCanceledOrders: function() {
    return [
      {
        id: 4,
        statusText: '已退订',
        time: '退订时间: 2023-05-05 15:20',
        coach: {
          avatar: '../../images/coach4.jpg',
          name: '赵教练',
          level: '中级私人教练'
        },
        course: {
          type: '私教课-康复',
          time: '2023-05-08 17:00-18:00',
          duration: 60
        },
        price: '259.00'
      }
    ];
  },

  // 取消订单
  cancelOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 实际项目中调用取消订单接口
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          this.loadOrderData();
        }
      }
    });
  },

  // 确认完成订单
  confirmOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    // 实际项目中调用确认完成接口
    wx.showToast({
      title: '订单已完成',
      icon: 'success'
    });
    this.loadOrderData();
  },

  // 重新预约
  reorder: function(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到预约页面
    wx.navigateTo({
      url: '/pages/reservation/reservation'
    });
  },

  navigateBackToUser: function() {
    wx.navigateBack({
      delta: 1  // 返回上一页
    });
  }
});