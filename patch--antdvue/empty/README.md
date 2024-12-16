## 说明

### empty补丁，**补丁组件使用必须在 `Vue.use(Antd)`之后，否则无法生效**，使用方式：Vue.use(empty)

- 修改默认图片显示Empty.PRESENTED_IMAGE_SIMPLE

### 使用：

新增props:{
simpleImage：boolean，是否使用PRESENTED_IMAGE_SIMPLE图片，默认true
}
