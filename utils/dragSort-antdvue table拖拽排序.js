/*
 * @Author: TJP
 * @Date: 2025-03-06 11:22:06
 * @LastEditors: TJP
 * @LastEditTime: 2025-05-09 14:18:40
 */
const border = '2px solid #0e5ab4'
const borderBottomDiv = document.createElement('div')
borderBottomDiv.style.borderTop = border
borderBottomDiv.style.position = 'absolute'
borderBottomDiv.style.zIndex = '9'
borderBottomDiv.style.width = 'calc(100% - 1px)'

const funs = {
  source: {},
  sourceDom: null,
  sourceIndex: {},
  data: {},
  dragBorderDirection: 'top',
  mouseMoveEvent(e) {
    borderBottomDiv.remove()
    this.sourceDom &&
      this.sourceDom.childNodes.forEach((item) => {
        if (this.dragBorderDirection == 'top') {
          item.style.borderTop = ''
        } else if (this.dragBorderDirection == 'bottom') {
          item.style.borderBottom = ''
        }
      })
    window.onmousemove = null
  },
  handleMouseenter(event, record, index, mouseenter) {
    const ev = event || window.event
    ev.target.draggable = true
    mouseenter && mouseenter(event, record, index)
  },
  handleDragstart(event, record, index, dragstart) {
    dragstart && dragstart(event, record, index)

    if (this.dragBorderDirection == 'top') {
      borderBottomDiv.style.borderTop = border
    } else if (this.dragBorderDirection == 'bottom') {
      borderBottomDiv.style.borderBottom = border
    }
    const ev = event || window.event
    ev.stopPropagation()
    window.onmousemove = this.mouseMoveEvent
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
  },
  handleDragover(event, record, index, dragover) {
    let rb
    dragover && (rb = dragover(event, record, index))
    console.log(rb)
    if (rb !== undefined) {
      return rb
    }
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
          if (this.dragBorderDirection == 'top') {
            item.style.borderTop = ''
          } else if (this.dragBorderDirection == 'bottom') {
            item.style.borderBottom = ''
          }
        })
      this.sourceDom = target
      if (this.dragBorderDirection == 'top') {
        target.previousSibling !== borderBottomDiv && target.insertAdjacentElement('beforeBegin', borderBottomDiv)
        if (target.previousSibling.tagName == 'DIV' && !target.previousSibling) {
          target.childNodes.forEach((item) => {
            item.style.borderTop = border
          })
          borderBottomDiv.remove()
        }
      } else if (this.dragBorderDirection == 'bottom') {
        target.nextSibling !== borderBottomDiv && target.insertAdjacentElement('afterend', borderBottomDiv)
        if (target.nextSibling.tagName == 'DIV' && !target.nextSibling.nextSibling) {
          target.childNodes.forEach((item) => {
            item.style.borderBottom = border
          })
          borderBottomDiv.remove()
        }
      }
    }
    // console.log(event, record)
  },
  handleDrop(event, record, index, drop) {
    const ev = event || window.event
    ev.stopPropagation()

    if (this.sourceDom) {
      borderBottomDiv.remove()
      this.sourceDom.childNodes.forEach((item) => {
        if (this.dragBorderDirection == 'top') {
          item.style.borderTop = ''
        } else if (this.dragBorderDirection == 'bottom') {
          item.style.borderBottom = ''
        }
      })
      this.sourceDom = null
    }

    this.data = { source: { ...this.source }, sourceIndex: this.sourceIndex, target: { ...record }, targetIndex: index }
    drop && drop(this.data)
  }
}
export default function dragSort(
  record,
  index,
  { mouseenter, dragstart, dragover, drop, dragBorderDirection = 'top' }
) {
  funs.dragBorderDirection = dragBorderDirection
  return {
    on: {
      mouseenter: (e) => funs.handleMouseenter(e, record, index, mouseenter),
      dragstart: (e) => funs.handleDragstart(e, record, index, dragstart),
      dragover: (e) => funs.handleDragover(e, record, index, dragover),
      drop: (e) => funs.handleDrop(e, record, index, drop)
    }
  }
}
