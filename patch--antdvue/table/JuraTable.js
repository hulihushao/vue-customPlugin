/*
 * @Author: TJP
 * @Date: 2025-03-12 11:38:14
 * @LastEditors: TJP
 * @LastEditTime: 2025-06-13 13:48:42
 */
import { YTable } from 'jurassic-ui'
export default {
  install(Vue) {
    Vue.component(YTable.name, {
      extends: YTable,
      watch: {
        dataSource: {
          deep: true,
          handler() {
            // 设置header的MarginBottom，解决表头表体分离问题
            this.setHeaderMarginBottom()
          }
        },
        loading: {
          handler() {
            this.setHeaderMarginBottom()
          }
        },
        columns: {
          deep: true,
          immediate: true,
          handler() {
            // 设置列宽的最小宽度
            this.setHeaderMinWidth()
          }
        }
      },
      mounted() {
        // 兼容其它浏览器，联想浏览器会出现paddingBottom没有重新设置问题
        document.querySelectorAll('.ant-table-header').forEach((el) => {
          if (!el.style.paddingBottom) el.style.paddingBottom = '0px'
        })
        //
        // 设置表头单元格超出显示title提示
        this.$nextTick(() => {
          setTimeout(() => {
            this.$el.querySelectorAll('.ant-table-column-title').forEach((item) => {
              if (item.scrollWidth > item.clientWidth) {
                item.title = item.innerHTML
              } else {
                item.title = ''
              }
            })
            this.setHeaderMarginBottom()
          }, 500)
        })
      },
      beforeUpdate() {
        this.setHeaderMarginBottom(0)
      },
      updated() {
        this.setHeaderMarginBottom(0)
      },
      methods: {
        setHeaderMarginBottom(timer = 150) {
          this.$nextTick(() => {
            setTimeout(() => {
              let tableHeader = document.querySelectorAll('.ant-table-header')
              // console.log(tableHeader)
              if (tableHeader) {
                tableHeader.forEach((e) => {
                  const bottom = e.scrollHeight - parseFloat(window.getComputedStyle(e).height)
                  e.style.marginBottom = Math.floor(bottom) + 'px'
                })
              }
              tableHeader = null
            }, timer)
          })
        },
        setHeaderMinWidth() {
          this.columns.forEach((item) => {
            if (item.minWidth) {
              item.RC_TABLE_INTERNAL_COL_DEFINE = {
                style: { minWidth: typeof item.minWidth === 'number' ? item.minWidth + 'px' : item.minWidth }
              }
            }
          })
        }
      }
    })
  }
}
