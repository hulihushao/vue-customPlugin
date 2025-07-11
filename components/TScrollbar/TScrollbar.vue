<!-- 滚动条组件模板 -->
<template>
  <div
    class="t-scrollbar"
    @mouseenter="showScrollbar"
    @mouseleave="hideScrollbar"
    :style="{ height: typeof height === 'string' ? height : height + 'px' }"
  >
    <!-- 内容插槽 -->
    <div
      class="t-scroll-content"
      ref="scrollContent"
      @scroll="handleScroll"
      style="padding-right: 8px"
      :class="{ 'user-select': isDragging }"
    >
      <slot></slot>
    </div>
    <!-- 纵向滚动条轨道 -->
    <div
      class="t-scrollbar-track t-vertical"
      :style="{
        opacity: verticalScrollbarVisible ? 1 : 0,
        'padding-bottom': '8px',
      }"
      @click.self="handleClickScroll"
    >
      <!-- 纵向滚动条滑块 -->
      <div
        class="t-scrollbar-thumb t-vertical"
        ref="scrollbarThumbVertical"
        :style="{
          height: verticalThumbHeight + '%',
          transform: `translateY(${verticalThumY}%)`,
        }"
        @mousedown.stop="startDrag('vertical')"
      ></div>
    </div>
    <!-- 横向滚动条轨道 -->
    <div
      class="t-scrollbar-track t-horizontal"
      :style="{ opacity: horizontalScrollbarVisible ? 1 : 0 }"
      @click.self="handleClickScroll"
    >
      <!-- 横向滚动条滑块 -->
      <div
        class="t-scrollbar-thumb t-horizontal"
        :style="{
          width: horizontalThumbWidth + '%',
          transform: `translateX(${horizontalThumX}%)`,
        }"
        @mousedown.stop="startDrag('horizontal')"
        ref="scrollbarThumbHorizontal"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AScrollbar",
  data() {
    return {
      verticalScrollbarVisible: false,
      horizontalScrollbarVisible: false,
      verticalThumbHeight: 100,
      horizontalThumbWidth: 100,
      isDragging: false,
      dragType: null,
      startY: 0,
      startX: 0,
      startScrollTop: 0,
      startScrollLeft: 0,
      verticalThumY: 0,
      horizontalThumX: 0,
    };
  },
  props: {
    height: {
      type: [Number, String],
      default: 200,
    },
  },
  mounted() {
    this.updateScrollbar();
  },
  methods: {
    showScrollbar() {
      this.verticalScrollbarVisible =
        this.$refs.scrollContent.scrollHeight >
        this.$refs.scrollContent.clientHeight;
      this.horizontalScrollbarVisible =
        this.$refs.scrollContent.scrollWidth >
        this.$refs.scrollContent.clientWidth;
    },
    hideScrollbar() {
      this.verticalScrollbarVisible = false;
      this.horizontalScrollbarVisible = false;
    },
    handleScroll() {
      const scrollContent = this.$refs.scrollContent;
      this.verticalThumY =
        (scrollContent.scrollTop / scrollContent.clientHeight) * 100;
      console.log(this.verticalThumY);
    },
    handleClickScroll(e) {
      if (this.isDragging) return;
      const scrollContent = this.$refs.scrollContent;
      const scrollbarThumbVertical = this.$refs.scrollbarThumbVertical;
      const scrollbarThumbHorizontal = this.$refs.scrollbarThumbHorizontal;
      const rectscrollbarThumbVertical =
        scrollbarThumbVertical.getBoundingClientRect();
      const rectscrollbarThumbHorizontal =
        scrollbarThumbHorizontal.getBoundingClientRect();
      const rectscrollbarThumbVerticalY = rectscrollbarThumbVertical.height / 2;
      const rectscrollbarThumbHorizontalX =
        rectscrollbarThumbHorizontal.width / 2;
      const rect = scrollContent.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      scrollContent.scrollLeft =
        ((clickX - rectscrollbarThumbHorizontalX) / rect.width) *
        scrollContent.scrollWidth;
      scrollContent.scrollTop =
        ((clickY - rectscrollbarThumbVerticalY) / rect.height) *
        scrollContent.scrollHeight;
      this.horizontalThumX =
        (scrollContent.scrollLeft / scrollContent.clientWidth) * 100;
      this.verticalThumY =
        (scrollContent.scrollTop / scrollContent.clientHeight) * 100;
    },
    updateScrollbar() {
      const scrollContent = this.$refs.scrollContent;
      if (scrollContent) {
        // 计算纵向滑块高度
        this.verticalThumbHeight =
          (scrollContent.clientHeight / scrollContent.scrollHeight) * 100;
        // 计算横向滑块宽度
        this.horizontalThumbWidth =
          (scrollContent.clientWidth / scrollContent.scrollWidth) * 100;
      }
    },
    startDrag(type) {
      this.isDragging = true;
      this.dragType = type;
      this.startY = event.clientY;
      this.startX = event.clientX;
      this.startScrollTop = this.$refs.scrollContent.scrollTop;
      this.startScrollLeft = this.$refs.scrollContent.scrollLeft;
      document.addEventListener("mousemove", this.handleDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    handleDrag(event) {
      if (this.isDragging) {
        const scrollContent = this.$refs.scrollContent;
        if (this.dragType === "vertical") {
          const deltaY = event.clientY - this.startY;
          const scrollTop =
            this.startScrollTop +
            deltaY * (scrollContent.scrollHeight / scrollContent.clientHeight);
          scrollContent.scrollTop = scrollTop;
        } else if (this.dragType === "horizontal") {
          const deltaX = event.clientX - this.startX;
          const scrollLeft =
            this.startScrollLeft +
            deltaX * (scrollContent.scrollWidth / scrollContent.clientWidth);
          scrollContent.scrollLeft = scrollLeft;
          this.horizontalThumX =
            (scrollContent.scrollLeft / scrollContent.clientWidth) * 100;
        }
      }
    },
    stopDrag() {
      this.isDragging = false;
      this.dragType = null;
      document.removeEventListener("mousemove", this.handleDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },
  },
};
</script>

<style scoped>
.t-scrollbar {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.t-scroll-content {
  height: 100%;
  width: 100%;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent;
}
.t-scroll-content.user-select {
  user-select: none;
}

.t-scrollbar-track {
  position: absolute;
  background-color: #f0f0f0;
  transition: opacity 0.3s;
}

.t-scrollbar-track.t-vertical {
  right: 0;
  top: 0;
  width: 8px;
  height: 100%;
}

.t-scrollbar-track.t-horizontal {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
}

.t-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.t-scrollbar-thumb.t-vertical {
  width: 100%;
}

.t-scrollbar-thumb.t-horizontal {
  height: 100%;
}
</style>
