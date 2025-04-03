// utils/api.js

const BASE_URL = 'http://localhost:5000/api';

/**
 * 封装微信请求方法
 * @param {string} endpoint - API端点
 * @param {string} method - 请求方法
 * @param {object} data - 请求数据
 * @returns {Promise} 返回Promise
 */
const request = (endpoint, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    });
  });
};

/**
 * 获取教练列表
 * @param {string} lesson - 课程类型
 * @returns {Promise} 返回教练数据
 */
export const fetchCoaches = (lesson) => {
  return request('/coaches', 'GET', { lesson });
};

/**
 * 获取特定教练详情
 * @param {string} id - 教练ID
 * @returns {Promise} 返回教练详情
 */
export const fetchCoachDetail = (id) => {
  return request(`/coaches/${id}`);
};

// 其他API方法...