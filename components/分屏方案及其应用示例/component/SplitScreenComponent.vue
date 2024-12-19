<!-- 分屏 -->
<template>
  <div
    ref="mainDiv"
    class="main-div"
    @mouseover="mouseenter"
    @mouseout="mouseleave"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @contextmenu="contextmenu"
    :style="{
      width: divColNum * itemWidthHeight + divColNum + 5 + 'px',
      cursor: cursorType,
    }"
  >
    <div
      class="div-item"
      :style="{
        width: itemWidthHeight + 'px',
        height: itemWidthHeight + 'px',
      }"
      v-for="(item, index) in divColNum * divRowNum"
      :key="index"
      :data-index="index"
    ></div>
    <div
      class="selectdiv"
      :style="{
        display: selectVisible,
        width: selectWidthPX,
        height: selectHeightPX,
        top: selectTopPX,
        left: selectLeftPX,
      }"
    ></div>
    <div
      class="itembtn"
      :style="{
        display: selectBtnVisible,
        top: selectBtnTopPX,
        left: selectBtnLeftPX,
      }"
    >
      <ul>
        <li @click.stop="handleHB">合并</li>
        <li @click.stop="handleCancelHB">取消合并</li>
      </ul>
    </div>
  </div>
</template>
<script>
let colors = [
  "#70d619",
  "#b0ead0",
  "#ed8c70",
  "#9b6685",
  "#9e81dc",
  "#0aa400",
  "#1ad005",
  "#1bd301",
  "#6585d6",
  "#9a826d",
  "#e5b50d",
  "#377aa6",
  "#d6019b",
  "#855409",
  "#c14cbd",
  "#9ba27b",
  "#e66293",
  "#a90544",
  "#1e305c",
  "#d477c7",
  "#288c2a",
  "#81e53a",
  "#cec941",
  "#31bc69",
  "#73e07c",
];
export default {
  name: "SplitScreenComponent",
  data() {
    return {
      divColNum: 3,
      divRowNum: 3,
      itemWidthHeight: 120,
      selectBtnVisible: "none",
      selectVisible: "none",
      cursorType: "",
      selectWidth: "",
      selectHeight: "",
      selectTop: "",
      selectLeft: "",
      selectBtnTop: "",
      selectBtnLeft: "",
      selectDiv: [],
      mergeArr: [],
      selecrIndexArr: [],
    };
  },
  props: {
    // 行
    x: {
      type: Number,
      default: 3,
    },
    // 列
    y: {
      type: Number,
      default: 3,
    },
    // 待合并的数组，二维数组，[[待合并的方格序号]]
    merge: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    selectTopPX() {
      return this.selectTop + "px";
    },
    selectLeftPX() {
      return this.selectLeft + "px";
    },
    selectWidthPX() {
      return this.selectWidth + "px";
    },
    selectHeightPX() {
      return this.selectHeight + "px";
    },
    selectBtnTopPX() {
      return this.selectBtnTop + "px";
    },
    selectBtnLeftPX() {
      return this.selectBtnLeft + "px";
    },
  },
  watch: {
    x() {
      this.divRowNum = this.y * 1;
      this.mergeArr = [];
      this.$nextTick(() => {
        this.resetStyle();
      });
    },
    y(val) {
      this.divColNum = val * 1;
      this.mergeArr = [];
      this.$nextTick(() => {
        this.resetStyle();
      });
    },
    merge: {
      deep: true,
      handler(val) {
        this.mergeArr = [...val];
        if (val.length) {
          this.$nextTick(() => {
            this.resetStyle();
            let divItemAll = document.querySelectorAll(".div-item");

            this.mergeArr.forEach((item2, index) => {
              item2.forEach((item3) => {
                divItemAll[item3 - 1].style.borderColor = colors[index];
              });
            });
          });
        } else {
          this.$nextTick(() => {
            this.resetStyle();
          });
        }
      },
    },
  },
  methods: {
    resetData() {
      this.setOrCancelHB("#ccc");
      this.selectBtnVisible = "none";
      this.selectVisible = "none";
      this.cursorType = "";
      this.selectWidth = "";
      this.selectHeight = "";
      this.selectTop = "";
      this.selectLeft = "";
      this.selectBtnTop = "";
      this.selectBtnLeft = "";
      this.selectDiv = [];
      this.mergeArr = [];
      this.selecrIndexArr = [];
    },
    resetStyle() {
      let divItemAll = this.$el.querySelectorAll(".div-item");
      divItemAll.forEach((item2) => {
        item2.style.borderColor = "#ccc";
      });
    },
    setSplitNum() {
      this.divColNum = this.x * 1;
      this.divRowNum = this.y * 1;
    },
    handleHB() {
      let mergeAll = [...this.selecrIndexArr];
      this.mergeArr.forEach((item) => {
        mergeAll.push(...item);
      });
      if ([...new Set(mergeAll)].length != mergeAll.length) {
        this.$message.error("框选的分屏已被合并，请重新框选！");
        return;
      } else {
        let index = this.mergeArr.findIndex(
          (item) => JSON.stringify(item) == JSON.stringify(this.selecrIndexArr)
        );
        if (index >= 0) {
          this.mergeArr.splice(index, 1, this.selecrIndexArr);
        } else {
          this.mergeArr.push(this.selecrIndexArr);
        }
        let color = colors[this.mergeArr.length - 1];
        this.setOrCancelHB(color);
        let s = colors.splice(this.mergeArr.length - 1, 1);
        colors.push(s);
        this.result();
      }
    },
    setOrCancelHB(color) {
      this.$refs.mainDiv.querySelectorAll(".div-item").forEach((item) => {
        let i = item.dataset.index;
        if (this.selecrIndexArr.indexOf(Number(i) + 1) >= 0) {
          item.style.borderColor = color;
        }
      });
    },
    handleCancelHB() {
      let index = this.mergeArr.findIndex(
        (item) => JSON.stringify(item) == JSON.stringify(this.selecrIndexArr)
      );
      if (index >= 0) {
        this.mergeArr.splice(index, 1);
        this.setOrCancelHB("#ccc");
        this.result();
      }
    },
    result() {
      console.log(this.mergeArr);
      this.$emit("result", {
        x: this.x,
        y: this.y,
        splitRes: this.mergeArr,
      });
    },
    mouseenter() {
      this.cursorType = "cell";
    },
    mouseleave() {
      this.cursorType = "";
    },
    mousedown(e) {
      e.preventDefault();
      if (e.target.tagName == "LI") return;
      this.selectVisible = "none";
      this.selectDiv = [];
      document
        .querySelector(".main-div")
        .addEventListener("mousemove", this.mousemove);
      console.log(e.target);
      // 计算鼠标按下的位置的元素并设置框选的元素的位置
      let box = this.$refs.mainDiv.getBoundingClientRect();
      this.selectBtnVisible = "none";
      let find = this.getWhichItem(e);
      this.selectTop = (find.findItemRect?.top || e.clientY) - box.top;
      this.selectLeft = (find.findItemRect?.left || e.clientX) - box.left;
      console.log(this.selectTop, this.selectLeft, "weiz");
      this.selectDiv.push(find);
      // 框选元素的显示、初始化
      this.selectWidth = 0;
      this.selectHeight = 0;
      if (this.selectWidth > 1 && this.selectHeight > 1) {
        this.selectVisible = "block";
      } else {
        this.selectVisible = "none";
      }
    },
    mousemove(e) {
      e.preventDefault();
      // console.log(e, 'move');
      this.cursorType = "cell";

      let f = this.getWhichItem(e);
      if (!this.selectDiv.find((item) => item.index == f.index)) {
        this.selectDiv.push(f);
      }
      // console.log(f.dom);
      // 计算框选的元素宽和高
      this.selectWidth = Math.abs(
        Math.max(f.findItemRect?.left, this.selectDiv[0].findItemRect.left) -
          Math.min(f.findItemRect?.left, this.selectDiv[0].findItemRect.left) +
          this.itemWidthHeight
      );
      this.selectHeight = Math.abs(
        Math.max(f.findItemRect?.top, this.selectDiv[0].findItemRect.top) -
          Math.min(f.findItemRect?.top, this.selectDiv[0].findItemRect.top) +
          this.itemWidthHeight
      );
      // 计算框选元素的方向
      let box = this.$refs.mainDiv.getBoundingClientRect();
      if (f.findItemRect?.top < this.selectDiv[0].findItemRect.top) {
        this.selectTop = f.findItemRect?.top - box.top;
      } else {
        this.selectTop = this.selectDiv[0].findItemRect.top - box.top;
      }
      if (f.findItemRect?.left < this.selectDiv[0].findItemRect.left) {
        this.selectLeft = f.findItemRect?.left - box.left;
      } else {
        this.selectLeft = this.selectDiv[0].findItemRect.left - box.left;
      }
      // console.log(f.findItemRect, this.selectDiv[0].findItemRect, this.selectHeight);

      // console.log(this.selectWidth, this.selectHeight, '大小');
      // 框选的显示
      if (this.selectWidth > 1 && this.selectHeight > 1) {
        this.selectVisible = "block";
      } else {
        this.selectVisible = "none";
      }
    },
    mouseup(e) {
      e.preventDefault();
      if (e.target.tagName == "LI") return;
      console.log(e, "抬起");
      document
        .querySelector(".main-div")
        .removeEventListener("mousemove", this.mousemove);
      // 计算按钮位置
      let box = this.$refs.mainDiv.getBoundingClientRect();
      this.selectBtnTop = e.clientY - box.top;
      this.selectBtnLeft = e.clientX - box.left;
      if (
        this.selectWidth > this.itemWidthHeight ||
        this.selectHeight > this.itemWidthHeight
      ) {
        this.selectBtnVisible = "block";
      }

      let f = this.getWhichItem(e);
      this.selectDiv.push(f);
      // 计算框选的元素
      let first = this.selectDiv[0];
      let last = this.selectDiv[this.selectDiv.length - 1];
      let maxIndex = Math.max(first.index, last.index) + 1;
      let minIndex = Math.min(first.index, last.index) + 1;
      let divXCount = this.selectWidth / this.itemWidthHeight;
      let divYCount = Math.floor(this.selectHeight / this.itemWidthHeight);
      let selectIndex = [];
      for (let i = 0; i < divYCount; i++) {
        //行
        for (let j = 0; j < divXCount; j++) {
          // 列
          selectIndex.push(minIndex + i * this.y + j);
        }
      }
      console.log(selectIndex.sort((a, b) => a - b));
      this.selecrIndexArr = selectIndex.sort((a, b) => a - b);
    },
    contextmenu(e) {
      e.preventDefault();
    },
    getWhichItem(e) {
      // 计算鼠标位置在哪个元素内
      let divItemAll = document.querySelectorAll(".div-item");
      let first;
      let dom;
      let index = 0;
      divItemAll.forEach((item, indx) => {
        let itemRect = item.getBoundingClientRect();
        if (
          e.clientX > itemRect.x &&
          e.clientX < itemRect.x + this.itemWidthHeight &&
          e.clientY > itemRect.y &&
          e.clientY < itemRect.y + this.itemWidthHeight
        ) {
          // console.log(item);
          first = itemRect;
          dom = item;
          index = indx;
        }
      });
      return { findItemRect: first, dom, index };
    },
  },
};
</script>
<style scoped lang="less">
.main-div {
  border: 1px solid #000;
  display: flex;
  flex-wrap: wrap;
  margin: 0px 20px;
  justify-content: center;
  padding: 5px 2px;
  position: relative;
  .div-item {
    border: 1px solid #ccc;
    background: #d7d7d7;
  }
  .selectdiv {
    position: absolute;
    border: 2px dashed #81d3f8;
    display: none;
    background: rgba(0, 0, 0, 0.2);
  }
}
.itembtn {
  position: absolute;
  background: #fff;
  display: none;
  border: solid 1px #c2dff3;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      cursor: pointer;
      padding: 5px 15px;
      white-space: nowrap;
      &:hover {
        background-color: #dbf0fe;
      }
    }
  }
}
</style>
