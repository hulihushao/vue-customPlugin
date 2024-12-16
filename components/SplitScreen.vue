<!-- 分屏方案 -->
<template>
  <a-row :gutter="12">
    <a-col :span="7" class="left">
      <div class="main-content-list">
        <div
          class="main-content-item"
          :class="{ 'is-actice': item.id == isActive }"
          v-for="item in screenListData"
          :key="item.id"
          @click="clickItem(item)"
        >
          <div class="bz" v-show="item.id == isActive"></div>
          <span v-if="item.isApply" style="font-size: 16px; margin-left: 20px">
            √
          </span>
          <div
            class="title"
            :style="{ 'margin-left': item.isApply ? '10px' : '40px' }"
          >
            <span class="icon"
              ><img
                style="width: 24px; height: 24px"
                src="~@/assets/img/user.png"
                alt="" /></span
            ><span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="17" class="right">
      <div class="content-content">
        <a-form-model
          ref="screenform"
          :model="form"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 18 }"
          :rules="rules"
        >
          <a-form-model-item label="行列数" prop="size">
            <a-input
              v-model="form.size1"
              class="size"
              @change="changeSize1"
            ></a-input>
            X
            <a-input
              v-model="form.size2"
              class="size"
              @change="change"
            ></a-input>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div
        ref="mainDiv"
        class="main-div"
        @mouseover="mouseenter"
        @mouseout="mouseleave"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @contextmenu="contextmenu"
        :style="{
          width: divWidthNum * itemWidthHeight + divWidthNum + 5 + 'px',
          cursor: cursorType,
        }"
      >
        <div
          class="div-item"
          :style="{
            width: itemWidthHeight + 'px',
            height: itemWidthHeight + 'px',
          }"
          v-for="(item, index) in divWidthNum * divHeightNum"
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
    </a-col>
  </a-row>
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
  name: "SplitScreen",
  data() {
    let that = this;
    let sizeCheck = async () => {
      if (Number(that.form.size1) && Number(that.form.size2)) {
        if (
          /[1-5]/.test(Number(that.form.size1)) &&
          /[1-5]/.test(Number(that.form.size2))
        ) {
          if (
            Number(that.form.size1) > 5 ||
            Number(that.form.size1) < 1 ||
            Number(that.form.size2) > 5 ||
            Number(that.form.size2) < 1
          ) {
            return Promise.reject("请输入 1-5 的数字");
          } else {
            this.setSplitNum();
            return Promise.resolve();
          }
        } else {
          return Promise.reject("请输入 1-5 的数字");
        }
      } else {
        return Promise.reject("请输入尺寸");
      }
    };
    return {
      isActive: 1,
      divWidthNum: 3,
      divHeightNum: 3,
      itemWidthHeight: 120,
      screenList: [],
      form: {
        size1: 3,
        size2: 3,
      },
      rules: {
        size: [
          {
            required: true,
            trigger: "blur",
            validator: sizeCheck,
          },
          {
            required: true,
            trigger: "change",
            validator: sizeCheck,
          },
        ],
      },
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
    screenListData() {
      return this.screenList;
    },
  },
  methods: {
    getData() {
      this.screenList = [];
      this.clickItem(this.screenList[0]);
    },
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
      let divItemAll = document.querySelectorAll(".div-item");
      divItemAll.forEach((item2) => {
        item2.style.borderColor = "#ccc";
      });
    },
    addScreen() {
      let newS = {
        id: (Math.random() * 100000000000).toFixed(5) + "==",
        name: "新建分屏方案",
      };
      let f = this.screenList.filter((item) =>
        item.name.includes("新建分屏方案")
      );
      if (f.length) {
        newS.name = "新建分屏方案1";
        let max = 0;
        if (f.length > 1) {
          f.forEach((item) => {
            if (item.name.match(/\d+(.\d+)?/g)) {
              let s = Number(item.name.match(/\d+(.\d+)?/g)[0]);
              if (s > max) max = s;
            }
          });
          newS.name = "新建分屏方案" + (max + 1);
        }
      }
      this.screenList.push(newS);
      this.isActive = this.screenList[this.screenList.length - 1].id;
      this.form = {
        name: newS.name,
        size1: 3,
        size2: 3,
        isApply: false,
      };
      this.setSplitNum();
      this.resetData();
      this.resetStyle();
    },
    saveScreen() {
      const params = {
        sizeX: this.form.size1,
        sizeY: this.form.size2,
        combineWindows: this.mergeArr.map((item) => item.join("#")),
      };
    },
    clickItem(item) {
      this.resetData();

      this.isActive = item?.id;
      this.form = {
        size1: item?.sizeX || 3,
        size2: item?.sizeY || 3,
      };
      this.setSplitNum();
      // 回显框选的结果
      this.mergeArr = [];
      if (item?.combineWindows) {
        JSON.parse(item.combineWindows).forEach((item2) => {
          this.mergeArr.push(item2.split("#").map((item3) => Number(item3)));
        });
      }

      this.$nextTick(() => {
        let box = this.$refs.mainDiv.getBoundingClientRect();
        this.resetStyle();
        let divItemAll = document.querySelectorAll(".div-item");

        this.mergeArr.forEach((item2, index) => {
          item2.forEach((item3) => {
            divItemAll[item3 - 1].style.borderColor = colors[index];
          });
        });
      });
      console.log(this.mergeArr);
    },
    setSplitNum() {
      this.divWidthNum = this.form.size2 * 1;
      this.divHeightNum = this.form.size1 * 1;
    },
    change() {
      this.$refs.screenform.validateField(["size"], (error, values) => {
        console.log(values, error);
        if (!error) {
          this.divWidthNum = this.form.size2 * 1;
          this.mergeArr = [];
          this.$nextTick(() => {
            this.resetStyle();
          });
        }
      });
    },
    changeSize1() {
      this.mergeArr = [];
      this.$nextTick(() => {
        this.resetStyle();
      });
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
      }
    },
    apply(id) {
      this.$store.commit("playData/SET_SPLIT_NAME", "custom");
      this.$store.commit("playData/SET_SPLIT_X_Y", {
        x: this.form.size1,
        y: this.form.size2,
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
      let divYCount = this.selectHeight / this.itemWidthHeight;
      let selectIndex = [];
      for (let i = 0; i < divYCount; i++) {
        //行
        for (let j = 0; j < divXCount; j++) {
          // 列
          selectIndex.push(minIndex + i * this.form.size2 + j);
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
          console.log(item);
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
.drag-content {
  position: relative;
  height: 300px;
  background-color: #ddd;
}
.main-content-list {
  margin-top: 10px;
  height: 600px;
  border: 1px solid #ccc;
  overflow-y: auto;
  overflow-x: hidden;
  .main-content-item {
    width: 100%;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    &:hover,
    &.is-actice {
      background: #81d3f8;
    }
    .title {
      display: flex;
      align-items: center;
      .name {
        max-width: 200px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .icon {
      margin-right: 5px;
    }
    .bz {
      transition: all 0.3s;
      width: 10px;
      height: 100%;
      background: #7f7f7f;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .main-content-item:last-of-type {
    border: 0;
  }
}
.content-content {
  margin-top: 20px;
  .x {
    text-align: center;
  }
  /deep/.ant-input {
    width: 250px;
    &.size {
      width: 115px;
    }
  }
}
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
  // .div-item:nth-child(1) {
  //   border-left-color: #ccc !important;
  // }
  // .div-item:nth-child(1),
  // .div-item:nth-child(2),
  // .div-item:nth-child(3),
  // .div-item:nth-child(4),
  // .div-item:nth-child(5) {
  //   border-top-color: #ccc !important;
  // }
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
/deep/.ant-form .ant-form-item {
  height: 60px;
  margin-bottom: 0px;
}
</style>
