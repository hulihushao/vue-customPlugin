# elementUI版本：

## 说明：

命令式弹窗，减少对弹窗组件的关注及编写。弹窗内容通过参数传入组件进行渲染。

## 参数：


| 名称                | 说明                                              | 类型            | 默认    |
| ------------------- | ------------------------------------------------- | --------------- | ------- |
| title               | 弹窗标题                                          | string          | ''      |
| customClass         | 自定义class                                       | string          | ''      |
| component           | 弹窗内容组件                                      | component       | 无      |
| componentProps      | 弹窗内容组件props                                 | object          | {}      |
| width               | 弹窗宽度                                          | number, string | 710     |
| closeAfterCatch     | `是否在请求失败后关闭弹窗`                        | boolean         | `false` |
| `closeOnClickModal` | `是否可以通过点击 modal 关闭 Dialog`              | boolean         | true    |
| `showAfterMounted`  | `是否在组件挂载后显示弹窗`                        | boolean         | true    |
| `locale`            | 语言，可选`'zh_cn','en_US'`                       | string          | `zh_cn` |
| `modal`             | 遮罩层                                            | boolean         | true    |
| `footer`            | 底部按钮, footer=null可不显示                     | component，null |         |
| `footerProps`       | 底部props                                         | object          | {}      |
| `ok`                | 点击确定按钮的回调，接收一个参数：传入组件的$refs | function($refs) |         |
| `cancel/close`      | Dialog 关闭的回调                                 | function        |         |
| `open`              | Dialog 打开的回调                                 | function        |         |

## 使用说明：

```
import Dialog from '*/index.js'
Vue.use(Dialog)
```

```js
this.$Dialog({})
/** $Dialog会返回 弹窗组件实例，
提供updateComponentProps更新弹窗中的组件的props，方法参数格式与创建弹窗的componentProps一致，
提供close方法关闭弹窗，同时该方法会传入弹窗中的组件中，名称为close，
提供show方法打开弹窗；弹窗中的组件可通过$refs使用，
使用return Promise.reject()可阻止确认按钮关闭弹窗
*/
```
