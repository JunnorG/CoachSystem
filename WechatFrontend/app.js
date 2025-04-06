// app.js
App({
  globalData: {
    credit: 0, // 初始值设为0
    userInfo: null,
    // 其他全局数据...
    student: {
      id: 'dummy-id',
      name: 'ganjun',
      lessons: [
        {
          court: '朝阳网球中心',
          coaches: [
            {
              name: '老李',
              classHours: 3,
            },
            {
              name: '老张',
              classHours: 1.5
            }
          ]
        }
      ]
    }, // 当前用户作为学生拥有的课程信息
  },

  getCredit(){
    return this.globalData.credit
  },

  setCredit(credit){
    this.globalData.credit = credit
  },

  getLessonsOfCourt(court){
    var lessonsOfCourt = this.globalData.student.lessons.find(e => e.court === court)
    if (!lessonsOfCourt) return []
    else return lessonsOfCourt
  },

  updateLessons(court, coach, classHours) {
    var lessonsOfCourt = this.globalData.student.lessons.find(e => e.court === court)
    if (!lessonsOfCourt) {
      this.globalData.student.push({
        court: court,
        coaches: [{
          name: coach,
          classHours: classHours
        }]
      })
    }
    var coach = lessonsOfCourt.coaches.find(e => e.name === coach)
    if (lessonsOfCourt) {
      coach.classHours = classHours
    }
    else {
      lessonsOfCourt.push({ name: coach, classHours: classHours })
    }
  },

  getLessons(court, coach) {
    var lessonsOfCourt = this.globalData.student.lessons.find(e => e.court === court)
    if (!lessonsOfCourt) return 0
    var coach = lessonsOfCourt.coaches.find(e => e.name === coach)
    if (coach) return coach.classHours
    else return 0
  },

  onLaunch() {
    // 初始化时可以从缓存或服务器加载数据
    const credit = 9.5;
    this.globalData.credit = credit;
  }
})