// 使用方式： this.$store.commit('cancelRquest', [controllerName])

import storage from "store";
const app = {
  state: {
    // 批量，使用的方法： axios.CancelToken
    cancelToken: [],
    // 单个，使用的方法： AbortController
    abortController: new Map(),
  },
  mutations: {
    addCancelToken(state, cancel) {
      if (!state.cancelToken) {
        state.cancelToken = [];
      }
      if (cancel) {
        state.cancelToken.push(cancel);
      }
    },
    // 取消所有请求
    clearCancelToken(state, path) {
      const cancels = [...state.cancelToken];
      cancels.forEach((c) => {
        if (c.cancel && c.path == path) {
          c.cancel();
          state.cancelToken.splice(state.cancelToken.indexOf(c), 1);
        }
      });
    },
    setAbortController(state, { name, controller }) {
      state.abortController.set(name, controller);
    },
    cancelRquest(state, name) {
      if (state.abortController.get(name)) {
        state.abortController.get(name).abort();
      }
      state.abortController.delete(name);
    },
  },
  actions: {},
};

export default app;
