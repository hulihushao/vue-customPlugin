/*
 * @Author: TJP
 * @Date: 2025-03-06 11:22:06
 * @LastEditors: TJP
 * @LastEditTime: 2025-03-07 09:38:11
 */
const borderBottomDiv = document.createElement('div')
borderBottomDiv.style.borderBottom = '2px solid #1890ff'
borderBottomDiv.style.position = 'absolute'
borderBottomDiv.style.zIndex = '9'
borderBottomDiv.style.width = '100%'

const funs = {
  source: {},
  sourceDom: null,
  sourceIndex: {},
  data: {},
  handleMouseenter(event, record, index, mouseenter) {
    const ev = event || window.event
    ev.target.draggable = true
    mouseenter && mouseenter(event, record, index)
  },
  handleDragstart(event, record, index, dragstart) {
    const ev = event || window.event
    ev.stopPropagation()
    // console.log(ev)
    // 查找是否有固定列
    let fixed = ev.target.parentNode
    while (fixed && fixed.tagName !== 'TR') {
      fixed = fixed.parentNode
      if (
        (fixed.className.includes('ant-table-fixed-') && fixed.classList.length == 1 && fixed.tagName === 'DIV') ||
        fixed.tagName === 'BODY'
      ) {
        if (fixed.tagName !== 'BODY') {
          const dragDom = document.querySelector(`[data-row-key="${ev.target.dataset.rowKey}"]`)
          const parent = dragDom.parentNode.parentNode.parentNode
          ev.dataTransfer.setDragImage(
            dragDom,
            parseFloat(window.getComputedStyle(parent).width) - (parent.getBoundingClientRect().right - ev.clientX),
            20
          )
        }
        break
      }
    }
    // 得到源目标数据
    this.source = record
    this.sourceIndex = index
    dragstart && dragstart(event, record, index)
  },
  handleDragover(event, record, index, dragover) {
    const ev = event || window.event
    // 阻止默认行为
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'move' // 可以去掉拖动时那个＋号
    let target = ev.target
    while (target && target.tagName !== 'TR') {
      target = target.parentNode
      if (target.tagName === 'TR' || target.tagName === 'BODY') {
        break
      }
    }
    // 查找是否有固定列
    let fixed = target.parentNode
    while (fixed && fixed.tagName !== 'TR') {
      fixed = fixed.parentNode
      if (
        (fixed.className.includes('ant-table-fixed-') && fixed.classList.length == 1 && fixed.tagName === 'DIV') ||
        fixed.tagName === 'BODY'
      ) {
        if (fixed.tagName !== 'BODY') {
          target = document.querySelector(`[data-row-key="${target.dataset.rowKey}"]`)
        }
        break
      }
    }

    if (target && target.tagName === 'TR') {
      this.sourceDom &&
        this.sourceDom.childNodes.forEach((item) => {
          item.style.borderBottom = ''
        })
      this.sourceDom = target
      target.nextSibling !== borderBottomDiv && target.insertAdjacentElement('afterend', borderBottomDiv)
      if (target.nextSibling.tagName == 'DIV' && !target.nextSibling.nextSibling) {
        target.childNodes.forEach((item) => {
          item.style.borderBottom = '2px solid #1890ff'
        })
      }
    }
    // console.log(event, record)
    dragover && dragover(event, record, index)
  },
  handleDrop(event, record, index, drop) {
    const ev = event || window.event
    ev.stopPropagation()

    if (this.sourceDom) {
      borderBottomDiv.remove()
      this.sourceDom.childNodes.forEach((item) => {
        item.style.borderBottom = ''
      })
      this.sourceDom = null
    }

    this.data = { source: this.source, sourceIndex: this.sourceIndex, target: record, targetIndex: index }
    drop && drop(this.data)
  }
}
export default function dragSort(record, index, { mouseenter, dragstart, dragover, drop }) {
  return {
    on: {
      mouseenter: (e) => funs.handleMouseenter(e, record, index, mouseenter),
      dragstart: (e) => funs.handleDragstart(e, record, index, dragstart),
      dragover: (e) => funs.handleDragover(e, record, index, dragover),
      drop: (e) => funs.handleDrop(e, record, index, drop)
    }
  }
}
