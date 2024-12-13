/*
 * @Author: TJP
 * @Date: 2024-12-10 16:40:50
 * @LastEditors: TJP
 * @LastEditTime: 2024-12-12 11:04:29
 */
import { Empty } from 'ant-design-vue'
/**
 * empty补丁，修改默认图片显示Empty.PRESENTED_IMAGE_SIMPLE
 */
export default {
  install(Vue) {
    Vue.component(Empty.name, {
      extends: Empty,
      props: {
        simpleImage: {
          type: Boolean,
          default: true
        }
      },
      render(h) {
        return h(Empty, {
          props: {
            ...this.$attrs,
            image: this.simpleImage ? Empty.PRESENTED_IMAGE_SIMPLE : ''
          }
        })
      }
    })
  }
}
