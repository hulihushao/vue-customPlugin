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
        bottom: 24px;
        font-weight: 400;
        font-size: 12px;
        color: #86909c;
        line-height: 12px;
        transition: unset;
      "
      :style="{
        left: `calc(${textareaWidth}px - ${
          (textareaValue || '1').length.toString().length * 7.5
        }px - 38px)`,
      }"
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
  model: {
    props: { value },
    event: "input",
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
    this.textareaWidth = this.$refs.textarea.$el.firstChild.offsetWidth;
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
