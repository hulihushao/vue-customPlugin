<template>
  <div id="devicePosition" style="height: 100%">
    <a-layout>
      <a-layout>
        <a-layout>
          <a-layout-content style="padding: 0">
            <ApplySplitComponent
              :splitX="splitX"
              :splitY="splitY"
              :splitResult="splitRes"
            />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import ApplySplitComponent from "./component/ApplySplitComponent.vue";
export default {
  name: "apply",
  components: { ApplySplitComponent },
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
    splitRes() {
      return this.$store.state.splitRes;
    },
    splitX: {
      get() {
        return this.$store.state.splitX;
      },
      set(val) {
        this.$store.commit("SET_SPLIT_X", val);
      },
    },
    splitY: {
      get() {
        return this.$store.state.splitY;
      },
      set(val) {
        this.$store.commit("SET_SPLIT_Y", val);
      },
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
  methods: {
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
