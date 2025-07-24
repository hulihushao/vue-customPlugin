<template>
  <div v-if="direction === 'v'" class="scroll-btn-content-v">
    <div class="pre" v-if="showBtn" style="display: flex; justify-content: center; margin-bottom: 8px">
      <jura-button icon="up" @mousedown="mousedown('scrollTop', '-')" @mouseup="mouseup" size="small" />
    </div>
    <span ref="scrollContentRef" class="scroll-content">
      <slot></slot>
    </span>
    <div class="next" v-if="showBtn" style="display: flex; justify-content: center; margin-top: 8px">
      <jura-button icon="down" @mousedown="mousedown('scrollTop', '+')" @mouseup="mouseup" size="small" />
    </div>
  </div>
  <div v-else-if="direction === 'h'" class="scroll-btn-content-h" style="display: flex">
    <div class="pre" v-if="showBtn" style="display: flex; align-items: center; margin-right: 8px">
      <jura-button icon="left" @mousedown="mousedown('scrollLeft', '-')" @mouseup="mouseup" size="small" />
    </div>
    <span ref="scrollContentRef" :style="containerStyle" class="scroll-content">
      <slot></slot>
    </span>
    <div class="next" v-if="showBtn" style="display: flex; align-items: center; margin-left: 8px">
      <jura-button icon="right" @mousedown="mousedown('scrollLeft', '+')" @mouseup="mouseup" size="small" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScrollBtn',
  data() {
    return {
      timer: null,
      downTime: 0
    }
  },
  props: {
    showBtn: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'v' // v:垂直 h:水平
    },
    scrollLength: {
      type: Number,
      default: 10 // px
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    mousedown(type, sign) {
      clearInterval(this.timer)
      if (sign === '+') {
        this.$refs.scrollContentRef.firstElementChild[type] += this.scrollLength
      } else {
        this.$refs.scrollContentRef.firstElementChild[type] -= this.scrollLength
      }
      this.timer = setInterval(() => {
        this.downTime += 100
        if (this.downTime > 300) {
          if (sign === '+') {
            this.$refs.scrollContentRef.firstElementChild[type] += this.scrollLength
          } else {
            this.$refs.scrollContentRef.firstElementChild[type] -= this.scrollLength
          }
        }
      }, 100)
    },
    mouseup() {
      this.downTime = 0
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="less" scoped>
.scroll-btn-content-h {
  width: calc(100% - 64px);
  height: 100%;
  .scroll-content {
    height: 100%;
    width: 100%;
  }
}
.scroll-btn-content-v {
  .scroll-content {
  }
}
</style>
