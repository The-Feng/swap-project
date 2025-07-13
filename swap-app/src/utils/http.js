import axios from "axios";

const http = axios.create({
  baseURL: "/", // 使用代理路径
});

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    console.log('Response received:', response); // 添加日志
    return response.data;
  },
  function (error) {
    console.error('Response error:', error); // 添加日志
    return Promise.reject(error);
  }
);

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    console.log('Request sent:', config); // 添加日志
    return config;
  },
  function (error) {
    console.error('Request error:', error); // 添加日志
    return Promise.reject(error);
  }
);

export default http;