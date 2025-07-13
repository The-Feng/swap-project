import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000", // 添加协议头
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 请求错误时做点什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (res) {
    if (res.status === 200) {
      return res.data.data;
    } else {
      return Promise.reject(res);
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;