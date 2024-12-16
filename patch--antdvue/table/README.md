## 说明

### 表格组件补丁，**补丁组件使用必须在 `Vue.use(Antd)`之后，否则无法生效**，使用方式：Vue.use(table)

- 增加loading文字

### 使用：

新增props:{
tip(loading文字): 默认'加载中...'
}
