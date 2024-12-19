<template>
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
        @click="playerIdx = i - 1"
      >
        <slot :name="'item' + i" :index="i">
          <div style="color: #ffffff; font-size: 30px; font-weight: bold">
            {{ i }}
          </div>
        </slot>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "apply",
  data() {
    return {
      playerIdx: -1,
      splitResultBk: [],
    };
  },
  props: {
    splitResult: {
      type: Array,
      default: () => [],
    },
    splitX: {
      type: Number,
      default: 3,
    },
    splitY: {
      type: Number,
      default: 3,
    },
  },
  mounted() {},
  computed: {
    splitCount() {
      let all = [];
      this.splitResult.forEach((item) => {
        all.push(...item);
      });
      return this.splitX * this.splitY - all.length + this.splitResult.length;
    },
  },
  watch: {
    splitResult: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val.length) return;
        this.splitResultBk = [...val];
        this.remaining();
        this.$forceUpdate();
        this.$nextTick(() => {
          let con = document.querySelector(".play-box-con");
          con.style.gridTemplateColumns = `repeat(${this.splitY},1fr)`;
          con.style.gridTemplateRows = `repeat(${this.splitX},1fr)`;
          let playBox = document.querySelectorAll(".play-box-con .play-box");
          // 重置样式
          playBox.forEach((item) => {
            item.style.gridColumn = "";
            item.style.gridRow = "";
          });
          // 计算框选结果的行列数
          let nhnl = {};
          this.splitResultBk.forEach((item, index) => {
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
            if (l > this.splitY) {
              nhnl[index] = [l / this.splitY, this.splitY];
            } else {
              nhnl[index] = [h, l];
            }
          });
          console.log(nhnl);
          playBox.forEach((item) => {
            let index = Number(item.dataset.index);
            const merge = item.dataset.merge.split(",");
            if (merge.length > 1) {
              // 计算框选的第一个格在几行几列
              const min = this.splitResultBk[index][0];
              let row = parseInt(min / this.splitX) + 1;
              let col = parseInt(min % this.splitY) || this.splitY;
              console.log(row, col);
              // 设置grid布局样式
              item.style.gridColumn = col + " / " + (col + nhnl[index][1]);
              item.style.gridRow = row + " / " + (row + nhnl[index][0]);
            }
          });
        });
      },
    },
  },

  methods: {
    getMergeArr(index) {
      return this.splitResultBk[index - 1]?.toString();
    },
    remaining() {
      const remain = [];
      const allres = this.splitResult.flat();
      for (let i = 1; i <= this.splitX * this.splitY; i++) {
        if (!allres.includes(i)) {
          remain.push([i]);
        }
      }
      this.splitResultBk = [...this.splitResultBk, ...remain].sort(
        (a, b) => a[0] - b[0]
      );
      console.log(this.splitResultBk);
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
