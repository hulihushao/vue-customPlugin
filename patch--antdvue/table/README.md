## 说明

### 组件补丁，**补丁组件使用必须在 `Vue.use(Antd)`之后，否则无法生效**，使用方式：Vue.use(table)

# table.js

- 增加loading文字

#### 使用：

新增props:{
tip(loading文字): 默认'加载中...'
}

# JuraTable.js

修复页面缩放表体表头分离问题，表头显示省略号时增加title显示
