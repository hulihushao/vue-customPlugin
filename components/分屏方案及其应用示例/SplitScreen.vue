<!--
 * @Author: TJP
 * @Date: 2024-12-16 15:13:08
 * @LastEditors: TJP
 * @LastEditTime: 2024-12-16 16:06:03
-->
<!-- 分屏方案 -->
<template>
  <a-row :gutter="12">
    <a-col :span="7" class="left">
      <div class="main-content-list">
        <div
          class="main-content-item"
          :class="{ 'is-actice': item.id == isActive }"
          v-for="item in screenList"
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
            <span class="icon"></span>
            <span class="name">{{ item.name }}</span>
            <a @click.stop="apply(item)" style="margin-left: 50px"> 应用 </a>
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
      <SplitScreenComponent
        ref="SplitScreenComponent"
        :merge="mergeArr"
        :x="form.size1"
        :y="form.size2"
        @result="result"
      />
    </a-col>
  </a-row>
</template>
<script>
import SplitScreenComponent from "./component/SplitScreenComponent";
export default {
  name: "SplitScreen",
  components: { SplitScreenComponent },
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
      screenList: [
        {
          name: "方案1",
          id: 1,
          sizeX: 4,
          sizeY: 4,
          combineWindows: ["1#2#3"],
        },
      ],
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
      mergeArrRes: {},
      mergeArr: [],
    };
  },
  methods: {
    getData() {
      this.screenList = [];
      this.clickItem(this.screenList[0]);
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
        combineWindows: this.mergeArrRes.map((item) => item.join("#")),
      };
    },
    clickItem(item) {
      this.$refs.SplitScreenComponent.resetData();

      this.isActive = item?.id;
      this.form = {
        size1: item?.sizeX || 3,
        size2: item?.sizeY || 3,
      };
      // 回显框选的结果
      this.mergeArr = [];
      if (item?.combineWindows) {
        item.combineWindows.forEach((item2) => {
          this.mergeArr.push(item2.split("#").map((item3) => Number(item3)));
        });
      }
      console.log(this.mergeArr);
    },
    change() {
      this.$refs.screenform.validateField(["size"], (error, values) => {
        console.log(values, error);
        if (!error) {
          this.mergeArr = [];
        }
      });
    },
    changeSize1() {
      this.mergeArr = [];
    },
    apply(item) {
      this.mergeArr = [];
      if (item?.combineWindows) {
        item.combineWindows.forEach((item2) => {
          this.mergeArr.push(item2.split("#").map((item3) => Number(item3)));
        });
      }
      console.log(this.mergeArr);
      this.$store.commit("SET_SPLIT_NAME", "custom");
      this.$store.commit("SET_SPLIT_X_Y", {
        x: item ? item.sizeX : this.mergeArrRes.x,
        y: item ? item.sizeY : this.mergeArrRes.y,
        splitRes: item ? this.mergeArr : this.mergeArrRes.splitRes,
      });
    },
    result(res) {
      console.log(res);
      this.mergeArrRes = { ...res };
      this.$set(this.screenList[0], "sizeX", res.x);
      this.$set(this.screenList[0], "sizeY", res.y);
      this.$set(
        this.screenList[0],
        "combineWindows",
        res.splitRes.map((item) => item.join("#"))
      );
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
