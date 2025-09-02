/*
 * @Author: TJP
 * @Date: 2025-03-06 11:22:06
 * @LastEditors: TJP
 * @LastEditTime: 2025-08-13 18:45:38
 * @Description: 支持树形拖拽，treeDrag：是否开启树形拖拽，默认关闭；showOverBg：是否在拖动过程中显示当前行背景色，true-显示；false-不显示，默认false，treeDrag为true时showOverBg将由鼠标位置决定，鼠标在行中心时为true，其他位置为false。position: 当前插入位置，before、after、inner；默认before；dragBorderDirection：拖拽时的边框显示，top,上边，bottom,下边，treeDrag为true时dragBorderDirection由鼠标位置决定，在行偏上方时为top，在行下方时为bottom
 * 使用方式：customRow(record, index) {
      return dragSort(record, index, {
        drop: (data) => {
          console.log(data)
          if (data.source.id == data.target.id) return
          this.saveSort(data)
        },
        showOverBg: true,
        treeDrag: true
      })
    }
 */
const border = "2px solid #0e5ab4";
const borderBottomDiv = document.createElement("div");
borderBottomDiv.style.borderTop = border;
borderBottomDiv.style.position = "absolute";
borderBottomDiv.style.zIndex = "9";
borderBottomDiv.style.width = "calc(100% - 1px)";

const funs = {
  source: {},
  sourceDom: null,
  sourceIndex: {},
  datas: {},
  dragBorderDirection: "top",
  showOverBg: false,
  treeDrag: false,
  position: "before",
  mouseMoveEvent(e) {
    borderBottomDiv.remove();
    this.sourceDom &&
      this.sourceDom.childNodes.forEach((item) => {
        if (this.dragBorderDirection == "top") {
          item.style.borderTop = "";
        } else if (this.dragBorderDirection == "bottom") {
          item.style.borderBottom = "";
        }
      });
    window.onmousemove = null;
  },
  handleMouseenter(event, record, index, mouseenter) {
    const ev = event || window.event;
    ev.target.draggable = true;
    mouseenter && mouseenter(event, record, index);
  },
  handleDragstart(event, record, index, dragstart) {
    dragstart && dragstart(event, record, index);

    if (this.dragBorderDirection == "top") {
      borderBottomDiv.style.borderTop = border;
    } else if (this.dragBorderDirection == "bottom") {
      borderBottomDiv.style.borderBottom = border;
    }
    const ev = event || window.event;
    ev.stopPropagation();
    window.onmousemove = this.mouseMoveEvent;
    // console.log(ev)
    // 查找是否有固定列
    let fixed = ev.target.parentNode;
    while (fixed && fixed.tagName !== "TR") {
      fixed = fixed.parentNode;
      if (
        (fixed.className.includes("ant-table-fixed-") &&
          fixed.classList.length == 1 &&
          fixed.tagName === "DIV") ||
        fixed.tagName === "BODY"
      ) {
        if (fixed.tagName !== "BODY") {
          const dragDom = document.querySelector(
            `[data-row-key="${ev.target.dataset.rowKey}"]`
          );
          const parent = dragDom.parentNode.parentNode.parentNode;
          ev.dataTransfer.setDragImage(
            dragDom,
            parseFloat(window.getComputedStyle(parent).width) -
              (parent.getBoundingClientRect().right - ev.clientX),
            20
          );
        }
        break;
      }
    }
    // 得到源目标数据
    this.source = record;
    this.sourceIndex = index;
  },
  handleDragover(event, record, index, dragover) {
    let rb;
    dragover && (rb = dragover(event, record, index));
    console.log(rb, event);
    if (rb !== undefined) {
      return rb;
    }
    const ev = event || window.event;

    // 设置边框显示
    if (this.treeDrag) {
      console.log(ev.target.offsetTop, ev.layerY, ev.target.offsetTop + 12);
      if (
        ev.target.offsetTop < ev.layerY &&
        ev.layerY < ev.target.offsetTop + 12
      ) {
        this.dragBorderDirection = "top";
        this.showOverBg = false;
        this.position = "before";
      } else if (
        ev.target.offsetTop + 12 < ev.layerY &&
        ev.layerY < ev.target.offsetTop + 24
      ) {
        this.dragBorderDirection = "";
        borderBottomDiv.remove();
        this.sourceDom &&
          this.sourceDom.childNodes.forEach((item) => {
            if (this.dragBorderDirection == "top") {
              item.style.borderTop = "";
            } else if (this.dragBorderDirection == "bottom") {
              item.style.borderBottom = "";
            }
          });
        this.showOverBg = true;
        this.position = "inner";
      } else if (
        ev.target.offsetTop + 24 < ev.layerY &&
        ev.layerY < ev.target.offsetTop + 36
      ) {
        this.dragBorderDirection = "bottom";
        this.showOverBg = false;
        this.position = "after";
      }
    }

    // 阻止默认行为
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move"; // 可以去掉拖动时那个＋号
    let target = ev.target;
    while (target && target.tagName !== "TR") {
      target = target.parentNode;
      if (target.tagName === "TR" || target.tagName === "BODY") {
        break;
      }
    }
    // 查找是否有固定列
    let fixed = target.parentNode;
    while (fixed && fixed.tagName !== "TR") {
      fixed = fixed.parentNode;
      if (
        (fixed.className.includes("ant-table-fixed-") &&
          fixed.classList.length == 1 &&
          fixed.tagName === "DIV") ||
        fixed.tagName === "BODY"
      ) {
        if (fixed.tagName !== "BODY") {
          target = document.querySelector(
            `[data-row-key="${target.dataset.rowKey}"]`
          );
        }
        break;
      }
    }

    if (target && target.tagName === "TR") {
      this.sourceDom &&
        this.sourceDom.childNodes.forEach((item) => {
          if (this.dragBorderDirection == "top") {
            item.style.borderTop = "";
          } else if (this.dragBorderDirection == "bottom") {
            item.style.borderBottom = "";
          }
        });

      if (this.showOverBg && this.sourceDom) {
        this.sourceDom.style.background = "";
      }
      this.sourceDom = target;

      if (this.dragBorderDirection == "top") {
        target.previousSibling !== borderBottomDiv &&
          target.insertAdjacentElement("beforeBegin", borderBottomDiv);

        // 特殊处理最后一行
        if (
          target.previousSibling.tagName == "DIV" &&
          !target.previousSibling
        ) {
          target.childNodes.forEach((item) => {
            item.style.borderTop = border;
          });
          borderBottomDiv.remove();
        }
      } else if (this.dragBorderDirection == "bottom") {
        target.nextSibling !== borderBottomDiv &&
          target.insertAdjacentElement("afterend", borderBottomDiv);

        // 特殊处理最后一行
        if (
          target.nextSibling.tagName == "DIV" &&
          !target.nextSibling.nextSibling
        ) {
          target.childNodes.forEach((item) => {
            item.style.borderBottom = border;
          });
          borderBottomDiv.remove();
        }
      }
      if (this.showOverBg) {
        target.style.background = "#e0f8f9";
      } else {
        target.style.background = "";
      }
    }
    // console.log(event, record)
  },
  handleDrop(event, record, index, drop) {
    const ev = event || window.event;
    ev.stopPropagation();

    if (this.sourceDom) {
      borderBottomDiv.remove();
      this.sourceDom.childNodes.forEach((item) => {
        if (this.dragBorderDirection == "top") {
          item.style.borderTop = "";
        } else if (this.dragBorderDirection == "bottom") {
          item.style.borderBottom = "";
        }
      });
      if (this.showOverBg) {
        this.sourceDom.style.background = "";
      }
      this.sourceDom = null;
    }

    this.datas = {
      source: { ...this.source },
      sourceIndex: this.sourceIndex,
      target: { ...record },
      targetIndex: index,
      position: this.position,
    };
    drop && drop(this.datas); // NOSONAR
  },
};
export default function dragSort(
  record,
  index,
  {
    mouseenter,
    dragstart,
    dragover,
    drop,
    dragBorderDirection = "top",
    showOverBg = false,
    treeDrag = false,
  }
) {
  funs.dragBorderDirection = dragBorderDirection;
  funs.showOverBg = showOverBg;
  funs.treeDrag = treeDrag;
  return {
    on: {
      mouseenter: (e) => funs.handleMouseenter(e, record, index, mouseenter),
      dragstart: (e) => funs.handleDragstart(e, record, index, dragstart),
      dragover: (e) => funs.handleDragover(e, record, index, dragover),
      drop: (e) => funs.handleDrop(e, record, index, drop),
    },
  };
}
