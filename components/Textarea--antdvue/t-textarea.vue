<template>
  <div class="t-textarea" style="position: relative">
    <a-textarea
      ref="textarea"
      :class="{ 'new-padding-left': $attrs.maxLength }"
      v-bind="$attrs"
      v-on="$listeners"
      v-model="textareaValue"
      @change="change"
    />
    <span
      v-if="$attrs.maxLength"
      style="
        position: absolute;
        user-select: none;
        z-index: 9;
        bottom: 5px;
        font-weight: 400;
        font-size: 12px;
        color: #86909c;
        line-height: 12px;
        transition: unset;
        right: 15px;
      "
    >
      {{ textareaValue ? textareaValue.length : 0 }}/{{ $attrs.maxLength }}
    </span>
  </div>
</template>
<script>
export default {
  name: "t-textarea",
  data() {
    return {
      textareaValue: undefined,
      textareaWidth: 0,
    };
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    textareaValue(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.textareaValue = val;
    },
  },
  created() {},
  mounted() {
    if (this.$attrs.maxLength) {
      if (this.$el.querySelector(".new-padding-left").tagName === "TEXTAREA") {
        this.textareaWidth = this.$refs.textarea.$el.offsetWidth;
        this.$el.querySelector(
          ".new-padding-left"
        ).style.paddingLeft = `45px !important`;
      } else {
        this.textareaWidth = this.$refs.textarea.$el.firstChild.offsetWidth;
      }
    }
  },
  methods: {
    change() {
      this.$emit("input", this.textareaValue);
    },
  },
};
</script>
<style lang="less" scoped>
.new-padding-left {
  /deep/textarea.ant-input {
    padding-right: 45px !important;
  }
}
</style>
