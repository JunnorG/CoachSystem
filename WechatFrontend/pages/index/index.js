import { BOOKING_STATUS } from '../../utils/enum';
import { fetchCoaches } from '../../apis/coachesAPI';
const app = getApp()
Page({
  data: {
    currentDate: '2023-11-15',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    coaches: [
      { id: 1, name: '教练A', slots: [] },
      { id: 2, name: '教练B', slots: [] },
      { id: 3, name: '教练C', slots: [] }
    ],
    timeSlots: [],
    orders: [
      { coach: { Name: '老李' }, timeSlot: 22, status: BOOKING_STATUS.BOOKED },
      { coach: { Name: '老李' }, timeSlot: 23, status: BOOKING_STATUS.CANCELED },
      { coach: { Name: '老李' }, timeSlot: 24, status: BOOKING_STATUS.BOOKED },
      { coach: { Name: '老李' }, timeSlot: 25, status: BOOKING_STATUS.AVAILABLE },
    ],
    coachesMetadataRes: {
      loading: false,
      coachMetada: [],
      error: null
    },
    userInfo: null,
    BOOKING_STATUS,
    court: '朝阳网球中心',
    lessons: [
      {
        name: '老李',
        classHours: 9
      }
    ]
  },

  onLoad() {
  },

  async onShow() {
    this.setData({
      lessons: app.getLessonsOfCourt(this.data.court).coaches
    })

    // 加载教练数据
    await this.fetchTennisCoaches();
    
    // 更新教练名字
    this.transformBookTable()
  },

  // 处理预定/取消预定 - 优化版本
  handleBooking(e) {
    const { coachId, coachName, timeIndex } = e.currentTarget.dataset;
    const { coaches, timeSlots } = this.data;
    const coach = this.getCoach(coaches, coachId);
    const slot = coach.slots[timeIndex];
    const time = timeSlots[timeIndex];

    // 立即更新本地数据（临时状态）
    const newCoaches = JSON.parse(JSON.stringify(coaches)); // 深拷贝
    
    if (slot.status === BOOKING_STATUS.AVAILABLE) {
      // 新预定流程
      const leftCredit = app.getLessons(this.data.court, coachName)
      if (leftCredit < 0.5) {
        wx.showToast({
          title: `你在教练${coachName}处课时不足，无法预定`,
          icon: 'none'
        });
        return;
      }

      wx.showModal({
        title: '预定确认',
        content: `确定要预定${coachName} ${timeSlots[timeIndex].time}的课程吗?`,
        success: (res) => {
          var newCoach = this.getCoach(newCoaches, coachId)
          if (res.confirm) {
            // 更新数据
            newCoach.slots[timeIndex].status = BOOKING_STATUS.BOOKED;
            newCoach.slots[timeIndex].bookedBy = 'currentUser';
            
            app.updateLessons(this.data.court, coachName, leftCredit-0.5)

            this.setData({
              coaches: newCoaches,
              lessons: app.getLessonsOfCourt(this.data.court).coaches
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
    return coaches.find(e => e.Id === coachId)
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
  },

  // 获取网球教练数据
  async fetchTennisCoaches() {
    this.setData({
      coachesMetadataRes: {
        ...this.data.coachesMetadataRes,
        loading: true,
        error: null
      }
    });
    
    try {
      const result = await fetchCoaches('网球');
      this.setData({
        coachesMetadataRes: {
          coachMetada: result,
          loading: false,
          error: null,
        }
      });
    } catch (error) {
      console.error('请求失败', error);
      this.setData({
        coachesMetadataRes: {
          ...this.data.coachesMetadataRes,
          loading: false,
          error: error.message || '加载失败'
        }
      });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  transformBookTable() {
    // 初始化时间槽位(10:00-22:00，每半小时)
    const timeSlots = [];
    for (let hour = 20; hour <= 44; hour++) {
      timeSlots.push({ time: hour % 2 === 0 ? hour/2 + ':00' : (hour-1)/2 + ':30', slot: hour});
    }

    // 初始化教练预定数据
    const coaches = this.data.coachesMetadataRes.coachMetada.map(coach => {
      // 随机生成一些已预定的时间段
      const slots = timeSlots.map(timeSlot => ({
        ...timeSlot,
        status: this.getBookingStatus(coach.Name, timeSlot.slot),
        bookedBy: null
      }));
      return { ...coach, slots };
    });
    this.setData({
      timeSlots: timeSlots,
      coaches: coaches
    })
  },

  getBookingStatus(coachName, timeSlot) {
    const order = this.data.orders.find(item => item.coach.Name === coachName && item.timeSlot === timeSlot)
    if (order){
      return order.status
    }
    else return BOOKING_STATUS.AVAILABLE
  }
});