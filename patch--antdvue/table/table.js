import { Table } from 'ant-design-vue'
/**
 * table补丁，增加loading文字
 */
export default {
  install(Vue) {
    Vue.component(Table.name, {
      extends: Table,
      props: {
        tip: {
          type: String,
          default: '加载中...'
        }
      },
      mounted() {
        this.$el.classList.add('t-table')
        if (!this.$el.querySelector('.ant-table-empty .ant-table-placeholder')) return
        this.$el.querySelector('.ant-table-empty .ant-table-placeholder').style.width =
          this.$el.querySelector('.ant-table-empty .ant-table-body').firstChild.scrollWidth + 'px'
      },
      watch: {
        loading: {
          handler(val) {
            if (val) {
              this.$nextTick(() => {
                setTimeout(() => {
                  const spantip = document.createElement('div')
                  spantip.className = 'ant-spin-text'
                  spantip.innerHTML = this.tip
                  spantip.style.top = `54%`
                  this.$el.querySelector('.ant-spin').appendChild(spantip)
                })
              })
            } else {
              this.$nextTick(() => {
                if (!this.$el.querySelector('.ant-table-empty .ant-table-placeholder')) return
                this.$el.querySelector('.ant-table-empty .ant-table-placeholder').style.width =
                  this.$el.querySelector('.ant-table-empty .ant-table-body').firstChild.scrollWidth + 'px'
              })
            }
          },
          immediate: true
        }
      }
    })
  }
}
