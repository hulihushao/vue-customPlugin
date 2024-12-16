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
                    v-if="!videoUrl[i - 1]"
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
    return {};
  },
  mounted() {
    this.getApplyScreenCustom();
  },
  computed: {
    spilt: {
      get() {
        return this.$store.state.playData.spilt;
      },
      set(val) {
        this.$store.dispatch("playData/SET_SPLIT", val);
      },
    },
    splitCount() {
      let all = [];
      this.$store.state.playData.splitRes.forEach((item) => {
        all.push(...item);
      });
      return (
        this.$store.state.playData.splitX * this.$store.state.playData.splitY -
        all.length +
        this.$store.state.playData.splitRes.length
      );
    },
    splitRes() {
      return this.$store.state.playData.splitRes;
    },
    spiltName: {
      get() {
        return this.$store.state.playData.spiltName;
      },
      set(val) {
        this.$store.commit("playData/SET_SPLIT_NAME", val);
      },
    },
  },
  watch: {
    "$store.state.playData.splitRes": {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          let con = document.querySelector(".play-box-con");
          con.style.gridTemplateColumns = `repeat(${this.$store.state.playData.splitY},1fr)`;
          con.style.gridTemplateRows = `repeat(${this.$store.state.playData.splitX},1fr)`;
          let playBox = document.querySelectorAll(".play-box-con .play-box");
          // 重置样式
          playBox.forEach((item) => {
            item.style.gridColumn = "";
            item.style.gridRow = "";
          });
          // 计算框选结果的行列数
          let nhnl = {};
          this.$store.state.playData.splitRes.forEach((item, index) => {
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
            if (l > this.$store.state.playData.splitY) {
              nhnl[index] = [
                l / this.$store.state.playData.splitY,
                this.$store.state.playData.splitY,
              ];
            } else {
              nhnl[index] = [h, l];
            }
          });
          console.log(nhnl);
          playBox.forEach((item) => {
            let index = Number(item.dataset.index) + 1;
            this.$store.state.playData.splitRes.forEach((item2, index2) => {
              let min = Math.min(...item2);
              let min1 = min;
              if (index2 > 0 && min > this.splitCount) {
                min =
                  min -
                  (this.$store.state.playData.splitRes[index2 - 1].length - 1);
              }
              if (index == min) {
                // 计算框选的第一个格在几行几列
                let row =
                  parseInt(index / this.$store.state.playData.splitX) + 1;
                let col = parseInt(min1 % this.$store.state.playData.splitY);
                console.log(row, col);
                // 设置grid布局样式
                item.style.gridColumn = col + " / " + (col + nhnl[index2][1]);
                item.style.gridRow = row + " / " + (row + nhnl[index2][0]);
              }
            });
          });
          for (let i = 0; i < this.splitCount; i++) {
            const player = this.$refs.player;
            player && player[i] && player[i].updatePlayerDomSize();
          }
        });
      },
    },
  },

  methods: {
    getMergeArr(index) {
      return this.$store.state.playData.splitRes
        .filter((item, ind) => {
          if (
            item[0] == index ||
            (this.$store.state.playData.splitRes[ind - 1] &&
              item[0] > this.splitCount &&
              item[0] ==
                index + this.$store.state.playData.splitRes[ind - 1].length - 1)
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
      if (this.$store.state.playData.spiltName == "custom") {
        let mergeArr = currentPlayBox.dataset.merge?.split(",");
        bfb =
          (mergeArr?.length || 1) /
          (this.$store.state.playData.splitX *
            this.$store.state.playData.splitY);
      } else {
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
      let data = { combineWindows: "3#3" };
      let splitRes = [];
      if (data.combineWindows) {
        splitRes = JSON.parse(data.combineWindows).map((item) =>
          item.split("#").map((item2) => Number(item2))
        );
      }
      this.$store.commit("playData/SET_SPLIT_NAME", "custom");
      this.$store.commit("playData/SET_SPLIT_X_Y", {
        x: data.sizeX,
        y: data.sizeY,
        splitRes,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.btn {
  margin: 0 10px;
}

.btn:hover {
  color: #409eff;
}

.btn.active {
  color: #409eff;
}

.redborder {
  border: 1px solid #00e5ff !important;
}
.redborder:hover {
  border: 1px solid #00e5ff !important;
}
/*5+1分屏第一分屏样式*/
.active15 {
  width: 66.6% !important;
  height: 66.6% !important;
}
.active15_3 {
  position: absolute;
  top: 33.3%;
  right: 1px;
}
/*7+1分屏第一分屏样式*/
.active17 {
  width: 75% !important;
  height: 75% !important;
}
.active17_3 {
  position: absolute;
  top: 25%;
  right: 1px;
}
.active17_4 {
  position: absolute;
  top: 50%;
  right: 1px;
}
.play-box {
  /*background-color: #000000;*/
  background: url("~@/assets/screen/bg_normal.png") no-repeat center;
  background-size: 100% 100%;
  border: 1px solid #416da8;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.videoList {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.video-item {
  position: relative;
  width: 15rem;
  height: 10rem;
  margin-right: 1rem;
  background-color: #000000;
}

.video-item-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

.video-item-img:after {
  content: "";
  display: inline-block;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  background-image: url("~@/assets/loading.png");
  background-size: cover;
  background-color: #000000;
}

.video-item-title {
  position: absolute;
  bottom: 0;
  color: #000000;
  background-color: #ffffff;
  line-height: 1.5rem;
  padding: 0.3rem;
  width: 14.4rem;
}
div.button {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.osdDIV {
  z-index: 1;
}
.showYT {
  height: 50% !important;
}
</style>
