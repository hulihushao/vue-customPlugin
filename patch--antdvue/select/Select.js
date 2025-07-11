import { Select } from 'ant-design-vue'
import { setOnScroll } from './utils'
export default {
  install(Vue) {
    Vue.component(Select.name, {
      extends: Select,
      props: {
        getPopupContainer: {
          default: () => (trigger) => {
            let scrollC = trigger
            const arr = []
            while (true) {
              if (
                window.getComputedStyle(scrollC).overflow.includes('scroll') ||
                window.getComputedStyle(scrollC).overflow.includes('auto')
              ) {
                arr.push(scrollC)
                // 滚动容器的高度>500px且出现滚动条
                if (scrollC.clientHeight < scrollC.scrollHeight && scrollC.clientHeight > 500) {
                  // return trigger.parentNode
                  setOnScroll(arr, '.ant-select-dropdown')
                  return scrollC
                }
                // break
              }
              if (scrollC.tagName === 'BODY') {
                break
              }
              scrollC = scrollC.parentElement
            }
            setOnScroll(arr, '.ant-select-dropdown')
            return document.body
          }
        }
      }
    })
  }
}
