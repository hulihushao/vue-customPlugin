<template>
  <div id="devicePosition" style="height: 100%">
    <a-layout>
      <a-layout>
        <a-layout>
          <a-layout-content style="padding: 0">
            <div
              style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                position: relative;
              "
              class="play-box-con"
              :style="{ display: 'grid !important' }"
            >
              <template>
                <div
                  v-for="(i, index) in splitCount"
                  :key="i"
                  :data-index="index"
                  :data-merge="getMergeArr(i)"
                  class="play-box"
                  :class="{
                    redborder: playerIdx == i - 1,
                  }"
                >
                  <div
                    style="color: #ffffff; font-size: 30px; font-weight: bold"
                  >
                    {{ i }}
                  </div>
                  <div></div>
                </div>
              </template>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "apply",
  components: {},
  data() {
    return {
      playerIdx: -1,
    };
  },
  mounted() {
    this.getApplyScreenCustom();
  },
  computed: {
    spilt: {
      get() {
        return this.$store.state.spilt;
      },
      set(val) {
        this.$store.dispatch("SET_SPLIT", val);
      },
    },
    splitCount() {
      let all = [];
      this.$store.state.splitRes.forEach((item) => {
        all.push(...item);
      });
      return (
        this.$store.state.splitX * this.$store.state.splitY -
        all.length +
        this.$store.state.splitRes.length
      );
    },
    splitRes() {
      return this.$store.state.splitRes;
    },
    spiltName: {
      get() {
        return this.$store.state.spiltName;
      },
      set(val) {
        this.$store.commit("SET_SPLIT_NAME", val);
      },
    },
  },
  watch: {
    "$store.state.splitRes": {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          let con = document.querySelector(".play-box-con");
          con.style.gridTemplateColumns = `repeat(${this.$store.state.splitY},1fr)`;
          con.style.gridTemplateRows = `repeat(${this.$store.state.splitX},1fr)`;
          let playBox = document.querySelectorAll(".play-box-con .play-box");
          // 重置样式
          playBox.forEach((item) => {
            item.style.gridColumn = "";
            item.style.gridRow = "";
          });
          // 计算框选结果的行列数
          let nhnl = {};
          this.$store.state.splitRes.forEach((item, index) => {
            let h = 1;
            let l = 1;
            let hh = false;
            item.forEach((item2, index2) => {
              if (item[index2 + 1]) {
                if (item2 + 1 == item[index2 + 1]) {
                  if (!hh) {
                    l++;
                  }
                } else {
                  hh = true;
                  h++;
                }
              }
            });
            if (l > this.$store.state.splitY) {
              nhnl[index] = [
                l / this.$store.state.splitY,
                this.$store.state.splitY,
              ];
            } else {
              nhnl[index] = [h, l];
            }
          });
          console.log(nhnl);
          playBox.forEach((item) => {
            let index = Number(item.dataset.index) + 1;
            this.$store.state.splitRes.forEach((item2, index2) => {
              let min = Math.min(...item2);
              let min1 = min;
              if (index2 > 0 && min > this.splitCount) {
                min = min - (this.$store.state.splitRes[index2 - 1].length - 1);
              }
              if (index == min) {
                // 计算框选的第一个格在几行几列
                let row = parseInt(index / this.$store.state.splitX) + 1;
                let col =
                  parseInt(min1 % this.$store.state.splitY) ||
                  this.$store.state.splitY;
                console.log(row, col);
                // 设置grid布局样式
                item.style.gridColumn = col + " / " + (col + nhnl[index2][1]);
                item.style.gridRow = row + " / " + (row + nhnl[index2][0]);
              }
            });
          });
        });
      },
    },
  },

  methods: {
    getMergeArr(index) {
      return this.$store.state.splitRes
        .filter((item, ind) => {
          if (
            item[0] == index ||
            (this.$store.state.splitRes[ind - 1] &&
              item[0] > this.splitCount &&
              item[0] == index + this.$store.state.splitRes[ind - 1].length - 1)
          ) {
            return true;
          } else {
            return false;
          }
        })
        ?.toString();
    },
    getMainOrS(index) {
      let bfb = 0;
      let currentPlayBox = document.querySelectorAll(".play-box-con .play-box")[
        index
      ];
      if (this.$store.state.spiltName == "custom") {
        let mergeArr = currentPlayBox.dataset.merge?.split(",");
        bfb =
          (mergeArr?.length || 1) /
          (this.$store.state.splitX * this.$store.state.splitY);
      } else {
        // 获取分辨率
        switch (this.spilt) {
          case 1:
            bfb = 11;
            break;
          case 4:
            bfb = 1 / 4;
            break;
          case 6:
            if (this.spiltName === "5+1") {
              if (
                currentPlayBox.getAttribute("class").includes("active") &&
                currentPlayBox.dataset.small != "yes"
              ) {
                bfb = 4 / 9;
              } else bfb = 1 / 9;
            } else {
              bfb = 1 / 6;
            }
            break;
          case 8:
            if (currentPlayBox.getAttribute("class").includes("active"))
              bfb = 9 / 16;
            else bfb = 1 / 16;
            break;
          case 9:
            bfb = 1 / 9;
            break;
          case 16:
            bfb = 1 / 16;
            break;
          case 25:
            bfb = 1 / 25;
            break;
        }
      }
      if (bfb > 0.25) return 0;
      else return 1;
    },
    setSplitName(name) {
      this.spiltName = name;
    },
    getApplyScreenCustom() {
      let data = { combineWindows: ["1#2#3"] };
      let splitRes = [];
      if (data.combineWindows) {
        splitRes = data.combineWindows.map((item) =>
          item.split("#").map((item2) => Number(item2))
        );
      }
      this.$store.commit("SET_SPLIT_NAME", "custom");
      this.$store.commit("SET_SPLIT_X_Y", {
        x: 3,
        y: 3,
        splitRes,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.redborder {
  border: 1px solid #00e5ff !important;
}
.redborder:hover {
  border: 1px solid #00e5ff !important;
}
.play-box {
  /*background-color: #000000;*/
  background: #000;
  background-size: 100% 100%;
  border: 1px solid #416da8;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
