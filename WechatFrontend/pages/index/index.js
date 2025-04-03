import { BOOKING_STATUS } from '../../utils/enum';
const app = getApp()
Page({
  data: {
    currentDate: '2023-11-15',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    timeSlots: [], // 时间槽位(10:00-22:00)
    coaches: [
      { id: 1, name: '教练A', slots: [] },
      { id: 2, name: '教练B', slots: [] },
      { id: 3, name: '教练C', slots: [] }
    ],
    userInfo: null,
    credit: app.globalData.credit,
    BOOKING_STATUS
  },

  onLoad() {
    // 初始化时间槽位(10:00-22:00，每半小时)
    const timeSlots = [];
    for (let hour = 10; hour <= 22; hour++) {
      timeSlots.push(`${hour}:00`);
      if (hour < 22) {
        timeSlots.push(`${hour}:30`);
      }
    }

    // 初始化教练预定数据
    const coaches = this.data.coaches.map(coach => {
      // 随机生成一些已预定的时间段
      const slots = timeSlots.map(time => ({
        time,
        status: Math.random() > 0.7 ? BOOKING_STATUS.BOOKED : BOOKING_STATUS.AVAILABLE,
        bookedBy: null
      }));
      return { ...coach, slots };
    });
    console.log("timeslots:" + timeSlots)
    console.log("coaches:" + coaches)
    this.setData({
      timeSlots,
      coaches
    });
  },

  onShow() {
    this.setData({
      credit: app.getCredit()
    })
  },

  // 处理预定/取消预定 - 优化版本
  handleBooking(e) {
    const { coachId, timeIndex } = e.currentTarget.dataset;
    const { coaches, timeSlots, credit } = this.data;
    const coach = this.getCoach(coaches, coachId);
    const slot = coach.slots[timeIndex];
    const time = timeSlots[timeIndex];

    // 立即更新本地数据（临时状态）
    const newCoaches = JSON.parse(JSON.stringify(coaches)); // 深拷贝
    
    if (slot.status === BOOKING_STATUS.BOOKED) {
      // 取消预定流程
      wx.showModal({
        title: '取消预定确认',
        content: `确定要取消${coach.name} ${time}的预定吗?`,
        success: (res) => {
          var newCoach = this.getCoach(newCoaches, coachId)
          if (res.confirm) {
            // 更新数据
            newCoach.slots[timeIndex].status = BOOKING_STATUS.AVAILABLE;
            newCoach.slots[timeIndex].bookedBy = null;
            
            const newCredit = credit+0.5
            app.setCredit(newCredit)
            this.setData({
              coaches: newCoaches,
              credit: newCredit
            }, () => {
              // 数据更新完成后的回调
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              });
              console.log('更新后的数据:', this.data.coaches);
            });
          }
        }
      });
    } else {
      // 新预定流程
      if (credit < 0.5) {
        wx.showToast({
          title: '课时不足，无法预定',
          icon: 'none'
        });
        return;
      }

      wx.showModal({
        title: '预定确认',
        content: `确定要预定${coach.name} ${time}的课程吗?`,
        success: (res) => {
          var newCoach = this.getCoach(newCoaches, coachId)
          if (res.confirm) {
            // 更新数据
            newCoach.slots[timeIndex].status = BOOKING_STATUS.BOOKED;
            newCoach.slots[timeIndex].bookedBy = 'currentUser';
            
            const newCredit = credit-0.5
            app.setCredit(newCredit)
            this.setData({
              coaches: newCoaches,
              credit: newCredit
            }, () => {
              // 数据更新完成后的回调
              wx.showToast({
                title: '预定成功',
                icon: 'success'
              });
              console.log('更新后的数据:', this.data.coaches);
            });
          }
        }
      });
    }
  },

  getCoach(coaches, coachId) {
    return coaches.find(e => e.id === coachId)
  },

  // 日期变化处理
  dateChange(e) {
    const selectedDate = e.detail.value;
    this.setData({
      currentDate: selectedDate
    });
    // 这里可以添加加载新日期数据的逻辑
    wx.showToast({
      title: `已切换到${selectedDate}`,
      icon: 'none'
    });
  }
});