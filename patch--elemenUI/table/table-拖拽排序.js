/*
 * @Author: TJP
 * @Date: 2025-12-12 16:36:43
 * @LastEditors: TJP
 * @LastEditTime: 2025-12-15 10:28:00
 */
import { Table } from 'element-ui'
/**
 * 表格组件补丁
 * 新增drag，拖拽排序（仅支持平级拖拽排序），支持传入事件：dragstart,dragover,dragend
 * dragstart,dragover:接收 移动的行数据, event
 * dragend:接收 移动的行数据和下标，目标行数据和下标, event
 */
export default {
  install(Vue) {
    Vue.component(Table.name, {
      extends: Table,
      props: {
        drag: {
          type: Object,
          default: () => null
        }
      },
      data() {
        return {
          draggingIndex: null, // 记录当前拖拽行的索引
          tableData2: [],
          draggingLevel: 0,
          hoverDom: null,
          hoverDomLeft: null,
          hoverDomRight: null,
          rows: [],
          leftRows: [],
          rightRows: []
        }
      },
      watch: {
        data: {
          handler(val) {
            if (!val) return
            if (this.drag) {
              this.tableData2 = this.expendAll(this.data, [])
              // console.log(this.tableData2)
              this.getRows()
            }
          },
          deep: true,
          immediate: true
        }
      },
      methods: {
        getRows() {
          this.$nextTick(() => {
            setTimeout(() => {
              const allrow = this.$el.querySelectorAll('.el-table__body-wrapper tr.el-table__row')
              this.rows = allrow
              // console.log(allrow)
              allrow.forEach((row, index) => { // NOSONAR
                row.draggable = true // 设置行元素为可拖拽
                // 开始拖拽时的事件处理
                row.ondragstart = (event) => this.handleDragStart(event, index)
                // 拖拽经过时的事件处理
                row.ondragover = (event) => this.handleDragOver(event, index)
                // 拖拽放下时的事件处理
                row.ondrop = (event) => this.handleDrop(event, index)
              })
              this.leftRows = this.$el.querySelectorAll(
                '.el-table__fixed .el-table__fixed-body-wrapper tr.el-table__row'
              )
              this.leftRows.forEach((row, index) => { // NOSONAR
                row.draggable = true // 设置行元素为可拖拽
                // 开始拖拽时的事件处理
                row.ondragstart = (event) => this.handleDragStart(event, index, 'fixed')
                // 拖拽经过时的事件处理
                row.ondragover = (event) => this.handleDragOver(event, index)
                // 拖拽放下时的事件处理
                row.ondrop = (event) => this.handleDrop(event, index)
              })
              this.rightRows = this.$el.querySelectorAll(
                '.el-table__fixed-right .el-table__fixed-body-wrapper tr.el-table__row'
              )
              this.rightRows.forEach((row, index) => { // NOSONAR
                row.draggable = true // 设置行元素为可拖拽
                // 开始拖拽时的事件处理
                row.ondragstart = (event) => this.handleDragStart(event, index, 'fixed')
                // 拖拽经过时的事件处理
                row.ondragover = (event) => this.handleDragOver(event, index)
                // 拖拽放下时的事件处理
                row.ondrop = (event) => this.handleDrop(event, index)
              })
            }, 500)
          })
        },
        // 处理拖拽开始事件
        handleDragStart(event, index, type) {
          this.draggingIndex = index // 记录当前拖拽行的索引
          this.draggingLevel = event.target.className.split(' ')[1] || 'el-table__row--level-0'
          if (
            this.draggingLevel !== 'el-table__row--level-0' &&
            !event.target.className.includes('el-table__row--level-')
          ) {
            this.draggingLevel = 'el-table__row--level-0'
          }
          event.dataTransfer.effectAllowed = 'move' // 设置拖拽效果为移动
          event.dataTransfer.setData('text/plain', index) // 将索引存储到拖拽数据中
          if (type === 'fixed') {
            event.dataTransfer.setData('text/plain', this.rows[index])
          }
          // console.log(this.draggingLevel)
          if (this.drag.dragstart) {
            this.drag.dragstart(this.tableData2[this.draggingIndex], event)
          }
        },
        // 处理拖拽经过事件
        handleDragOver(event, index) {
          // console.log(event)
          let target = event.target
          while (target && target.nodeName !== 'TR') {
            target = target.parentNode
          }
          // 如果目标索引和拖拽层级不同，不允许放置
          if (
            !target ||
            (this.draggingLevel.includes('level-0') && !target.className.split(' ')[1]) ||
            target.className.split(' ')[1] === this.draggingLevel
          ) {
            event.preventDefault() // 阻止默认事件，允许放置
            if (this.hoverDom) {
              this.hoverDom.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
              this.hoverDomLeft.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
              this.hoverDomRight.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
            }
            this.hoverDom = this.rows[index]
            this.hoverDomLeft = this.leftRows[index]
            this.hoverDomRight = this.rightRows[index]

            this.hoverDom.childNodes.forEach((item) => {
              item.style.borderBottom = `2px solid ${this.drag.hoverBorderColor || '#409EFF'}` // 设置拖拽经过行的边框
            })
            this.leftRows[index].childNodes.forEach((item) => {
              item.style.borderBottom = `2px solid ${this.drag.hoverBorderColor || '#409EFF'}` // 设置拖拽经过行的边框
            })
            this.rightRows[index].childNodes.forEach((item) => {
              item.style.borderBottom = `2px solid ${this.drag.hoverBorderColor || '#409EFF'}` // 设置拖拽经过行的边框
            })
          } else {
            console.log(this.hoverDom)
            if (this.hoverDom) {
              this.hoverDom.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
              this.hoverDomLeft.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
              this.hoverDomRight.childNodes.forEach((item) => {
                item.style.borderBottom = '' // 设置拖拽经过行的边框
              })
            }
          }
          event.dataTransfer.dropEffect = 'move' // 设置拖拽效果为移动
          if (this.drag.dragover) {
            this.drag.dragover(this.tableData2[this.draggingIndex], event)
          }
        },
        // 处理拖拽放下事件
        handleDrop(event, targetIndex) {
          if (this.hoverDom) {
            this.hoverDom.childNodes.forEach((item) => {
              item.style.borderBottom = '' // 设置拖拽经过行的边框
            })
            this.hoverDomLeft.childNodes.forEach((item) => {
              item.style.borderBottom = '' // 设置拖拽经过行的边框
            })
            this.hoverDomRight.childNodes.forEach((item) => {
              item.style.borderBottom = '' // 设置拖拽经过行的边框
            })
            this.hoverDom = null
            this.hoverDomLeft = null
            this.hoverDomRight = null
          }
          const sourceIndex = this.draggingIndex // 获取开始拖拽时记录的索引
          const sourceData = this.tableData2[sourceIndex]
          const targetData = this.tableData2[targetIndex]
          // 如果源索引和目标索引相同，直接返回
          if (sourceIndex === targetIndex) return
          let target = event.target
          console.log(target)
          while (target && target.nodeName !== 'TR') {
            target = target.parentNode
          }
          // 如果目标索引和拖拽层级不同，直接返回
          if (
            !target ||
            (this.draggingLevel.includes('level-0') && !target.className.split(' ')[1]) ||
            target.className.split(' ')[1] === this.draggingLevel
          ) {
            console.log(sourceIndex, targetIndex)
          } else {
            return
          }
          this.draggingIndex = null // 重置拖拽索引
          target = null
          if (this.drag.dragend) {
            this.drag.dragend({ data: sourceData, index: sourceIndex }, { data: targetData, index: targetIndex }, event)
          }
        },
        expendAll(data, list) {
          data.forEach((item) => {
            list.push(item)
            if (item.children) {
              this.expendAll(item.children, list)
            }
          })
          return list
        }
      }
    })
  }
}
