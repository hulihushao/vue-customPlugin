## 使用说明：

心跳的标识可根据实际情况修改

发送的心跳标识：

```js
self.send({
  funName: "ping",
});
```

接收的心跳标识：

```js
data.msg != "pong"
```

```js
import   WonWebSocket from 'websocket'

this.websocket = new WonWebSocket();
this.websocket.create(
  url,// websocket的url
  data, // 创建连接时需要发送的数据
  (data)=>{} //接收数据的回调
 );
// 发送数据
this.websocket.send()
// 关闭连接
this.websocket.close()
```
