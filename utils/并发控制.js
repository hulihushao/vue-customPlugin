// 方法1
export const limitFn = (limit) => {
  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.length > 0) {
      queue.shift()();
    }
  };

  const run = async (fn, resolve, ...args) => {
    activeCount++;

    const result = (async () => fn(...args))();

    try {
      const res = await result;
      resolve(res);
    } catch {}

    next();
  };

  const enqueue = (fn, resolve, ...args) => {
    queue.push(run.bind(null, fn, resolve, ...args));

    if (activeCount < limit && queue.length > 0) {
      queue.shift()();
    }
  };

  const generator = (fn, ...args) =>
    new Promise((resolve) => {
      enqueue(fn, resolve, ...args);
    });

  return generator;
};

// 方法2
/**
 * 并发控制函数
 * @param {Array<() => Promise<any>>} tasks - 每一项是一个返回 Promise 的函数，不是 Promise 本身
 * @param {number} maxConcurrent - 最大并发数，比如 3
 * @returns {Promise<any[]>} - 返回一个 Promise，resolve 所有任务的结果，顺序与 tasks 一致
 */
export function concurrentControl(tasks, maxConcurrent) {
  return new Promise((resolve, reject) => {
    // 参数校验
    if (!Array.isArray(tasks)) {
      return reject(new Error("tasks 必须是一个数组"));
    }
    if (tasks.length === 0) {
      return resolve([]); // 没任务直接返回空数组
    }
    if (typeof maxConcurrent !== "number" || maxConcurrent < 1) {
      return reject(new Error("maxConcurrent 必须是 >=1 的数字"));
    }

    let index = 0; // 当前准备执行的任务索引
    let running = 0; // 当前正在运行的任务数
    let results = []; // 用于存储每个任务的结果，按顺序
    let hasError = false; // 是否已经有任务报错，用于中断后续任务
    let resolvedCount = 0; // 已经完成（成功/失败）的任务数

    // 结果数组长度先填充 undefined，方便按索引赋值
    results = new Array(tasks.length);

    /**
     * 尝试执行下一个任务
     */
    function runNext() {
      // 如果已经有任务报错，或者没有任务了，或者并发已满且无空闲，就退出
      if (
        hasError ||
        index >= tasks.length ||
        (running >= maxConcurrent && index < tasks.length)
      ) {
        return;
      }

      // 如果全部任务都完成了
      if (index >= tasks.length && running === 0) {
        if (resolvedCount === tasks.length) {
          resolve(results); // 所有任务都成功返回了
        }
        return;
      }

      // 只要还有任务，且并发数没满，就不断启动新任务
      while (running < maxConcurrent && index < tasks.length && !hasError) {
        const currentIndex = index; // 闭包记住当前任务索引
        const taskFn = tasks[currentIndex]; // 获取任务函数
        index++;
        running++;

        // 执行任务函数，拿到 Promise
        const promise = taskFn();

        if (!(promise instanceof Promise)) {
          console.error("任务函数必须返回一个 Promise");
          hasError = true;
          reject(new Error("任务函数必须返回 Promise"));
          return;
        }

        promise
          .then((result) => {
            if (hasError) return;
            results[currentIndex] = result; // 按原始顺序保存结果
            resolvedCount++;
            running--;
            runNext(); // 继续调度下一个任务
          })
          .catch((error) => {
            hasError = true; // 发生错误，停止后续任务执行
            running--;
            reject(error); // 整体 reject
          });
      }
    }

    // 开始执行第一批任务
    runNext();
  });
}
