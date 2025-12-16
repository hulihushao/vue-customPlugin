import store from "@/store";

const abortControllerMap = new WeakMap();

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL,
  withCredentials: true,
  timeout: 300000, // 请求超时时间
});

request.interceptors.request.use((config) => {
  config.cancelToken = new axios.CancelToken((cancel) => {
    store.commit("addCancelToken", {
      path: window.location.pathname,
      cancel,
    });
  });
  // 取消相同标识的请求，手动，参数：controllerName
  if (config.controllerName) {
    const controller = new AbortController();
    config.signal = controller.signal;
    store.commit("setAbortController", {
      name: config.controllerName,
      controller,
    });
  }
  // 取消相同标识的请求，自动，参数：abortKey
  if (config.abortKey) {
    const kv = { key: config.abortKey };
    const abortController = abortControllerMap.get(kv);
    if (abortController) {
      abortController.abort();
      abortControllerMap.delete(kv);
    } else {
      const c = new AbortController();
      abortControllerMap.set(kv, c);
      config.signal = c.signal;
    }
  }
  return config;
}, errorHandler);

export default request;
