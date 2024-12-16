# antdVue版本：

## 说明：

命令式弹窗，减少对弹窗组件的关注及编写。弹窗内容通过参数传入组件进行渲染。

## 参数：


| 名称            | 说明                                                                                                   | 类型            | 默认    |
| --------------- | ------------------------------------------------------------------------------------------------------ | --------------- | ------- |
| title           | 弹窗标题                                                                                               | string          | ''      |
| `wrapClassName` | `对话框外层容器的类名`                                                                                 | string          | ''      |
| component       | 弹窗内容组件                                                                                           | component       | 无      |
| componentProps  | 弹窗内容组件props                                                                                      | object          | {}      |
| width           | 弹窗宽度                                                                                               | number, string | 710     |
| closeAfterCatch | `是否在请求失败后关闭弹窗`                                                                             | boolean         | `false` |
| `bodyStyle`     | `Modal body 样式`                                                                                      | object          | {}      |
| `dialogStyle`   | `可用于设置浮层的样式，调整浮层位置等`                                                                 | boolean         | true    |
| `locale`        | 语言，可选`'zh_cn','en_US'`                                                                            | string          | `zh_cn` |
| `footer`        | 底部按钮, footer=null可不显示                                                                          | component，null |         |
| `footerProps`   | 底部props                                                                                              | object          | {}      |
| `ok`            | 点击确定按钮的回调，接收一个参数：传入组件的$refs，<br /><br />return Promise()会有按钮的loading<br /> | function($refs) |         |
| `cancel`        | `Modal` 关闭的回调                                                                                    | function        |         |

## 使用说明：

```
import Modal from '*/index.js'
Vue.use(Modal)
```

```js
this.$Modal({})
/** $Modal会返回 弹窗组件实例，
提供updateComponentProps更新弹窗中的组件的props，方法参数格式与创建弹窗的componentProps一致，
提供close方法关闭弹窗，同时该方法会传入弹窗中的组件中，名称为close，
提供show方法打开弹窗；弹窗中的组件可通过$refs使用，
使用return Promise.reject()可阻止确认按钮关闭弹窗
*/
```
