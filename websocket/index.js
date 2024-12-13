class WonWebSocket {
  /**
   * 构造函数
   * @param url
   *   eg:  "wss://127.0.0.1:8088"
   */
  constructor(url, delay) {
    this.url = url;
    this.socket = url;
    this.delay = delay || 1500; //重连延迟，单位：毫秒
  }

  /**
   * 创建 websocket 连接
   */
  create(url, data, onmessageCbk) {
    let socket = this.socket;
    try {
      // 启动 WebSocket
      if (!socket && WebSocket) {
        if (!this.url) {
          this.url = url.replace(/^http/i, "ws");
          this.data = data;
          this.onmessageCbk = onmessageCbk;
        }
        socket = new WebSocket(this.url);
        socket.onopen = this.onopen;
        socket.onmessage = this.onmessage;
        socket.onerror = this.onerror;
        socket.onclose = this.onclose;
        this.socket = socket;
        this.socket.self = this;
      }
    } catch (e) {
      console.log("websocket 创建连接失败", e);
    }
    return socket;
  }

  /**
   * websocket 端口或失败之后重新打开
   */
  reopen() {
    let self = this,
      timer = setTimeout(() => {
        self.create();
      }, self.delay);
    this.socket = null;
    return timer;
  }

  /**
   * websocket 端口或失败之后重新打开
   */
  keepalive() {
    let self = this,
      timer = this.timer;
    this.timer && clearTimeout(this.timer); // 如果存在定时任务则取消
    if (this.socket && this.socket.readyState == 1) {
      timer = setTimeout(() => {
        self.keepalive();
      }, self.delay);
      try {
        self.send({
          funName: "ping",
        });
      } catch (e) {
        console.log("websocket 发送心跳失败", e);
      }
      self.timer = timer;
    }
    return timer;
  }

  /**
   * 打开 websocket 之后发送心跳
   */
  onopen(callback) {
    try {
      console.log("打开websocket， 定时发送心跳");
      this.self.send(this.self.data);

      this.self.keepalive();
      if (typeof callback == "function") callback();
    } catch (e) {
      console.log("打开websocket失败", e);
    }
  }

  /**
   * 连接失败重连
   */
  onerror() {
    try {
      this.socket.self.reopen();
    } catch (e) {
      console.log("websocket连接失败", e);
    }
  }

  /**
   * 断开重连
   */
  onclose() {
    console.log("websocket已经关闭");
    // this.reopen()
  }

  /**
   * websocket 数据接收统一处理
   */

  onmessage(msg) {
    try {
      let data = typeof msg.data == "string" ? JSON.parse(msg.data) : msg.data;
      console.log(data);
      if (typeof this.self.onmessageCbk == "function") {
        if (data && data.msg != "pong") this.self.onmessageCbk(data);
      }
    } catch (e) {
      console.log("websocket消息处理失败", e);
    }
  }

  send(msg) {
    if (msg) {
      let message = typeof msg == "string" ? msg : JSON.stringify(msg);
      if (this.socket && this.socket.readyState == 1 && msg) {
        this.socket.send(message);
      } else if (!this.socket) {
        // socket连接失败
        console.log("websocket连接失败, 无法发送消息", msg);
      }
    }
  }

  /**
   * 主动关闭websocket
   */
  close() {
    try {
      clearTimeout(this.timer);
      this.socket.close();
    } catch (e) {
      console.log("关闭websocket连接失败, 无法发送消息", e);
    }
  }
}

/**
 * js 中使用 websocket 发送数据
 *  import { websocket } from '@/services/websocket'
 * vue 中使用 websocket 发送数据
 *  this.websocket.send()
 *  this.websocket.close()
 * @type {WonWebSocket}
 */

export default WonWebSocket;
