<template>
  <jura-modal
    :title="title"
    :visible="visible"
    :width="width"
    destroyOnClose
    :dialogStyle="{ ...dialogStyle }"
    :bodyStyle="{ padding: '0px 20px 20px', ...bodyStyle }"
    :footer="null"
    :wrapClassName="`common-modal ${wrapClassName || ''}`"
    @cancel="handleRCancel"
  >
    <a-config-provider :locale="locale">
      <component
        :is="curcomponent"
        v-bind="curComponentProps"
        :ref="curcomponent.name || 'curComponent'"
        :close="close"
      ></component>
    </a-config-provider>
    <ModalFooter v-if="footer" @cancel="handleRCancel" @ok="handleROk" :loading="loading" />
  </jura-modal>
</template>
<script>
import ModalFooter from '@/components/ModalFooter/index.vue'
import antd from 'ant-design-vue/es/locale-provider/zh_CN'

export default {
  components: { ModalFooter },
  data() {
    return {
      loading: false,
      visible: false,
      curComponentProps: {}
    }
  },
  props: {
    title: String,
    wrapClassName: String,
    locale: {
      type: Object,
      default: () => {
        return antd
      }
    },
    width: {
      type: [Number, String],
      default: 710
    },
    // 组件
    curcomponent: {
      type: Object,
      default: () => {}
    },
    componentProps: {
      type: Object,
      default: () => {}
    },
    ok: {
      type: Function,
      default: () => {}
    },
    cancel: {
      type: Function,
      default: () => {}
    },
    bodyStyle: {
      type: Object,
      default: () => {}
    },
    dialogStyle: {
      type: Object,
      default: () => {}
    },
    // 显示控制
    vis: Boolean,
    // 是否在请求失败后关闭弹窗
    closeAfterCatch: {
      type: Boolean,
      default: false
    },
    footer: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    vis: {
      immediate: true,
      handler(val) {
        if (val) {
          this.curComponentProps = { ...this.componentProps }
          console.log(this.curComponentProps)
          this.visible = true
        }
      }
    },
  },
  created() {
    console.log(this)
  },
  methods: {
    handleRCancel() {
      this.visible = false
      this.cancel && this.cancel()
    },
    handleROk() {
      if (this.ok) {
        const res = this.ok(this.$refs[this.curcomponent.name || 'curComponent'])
        if (res) {
          this.loading = true
          res
            .then((res2) => {
              this.loading = false
              this.visible = false
            })
            .finally(() => {
              this.loading = false
              this.closeAfterCatch && (this.visible = false)
            })
        } else {
          this.visible = false
        }
      }
    },
    /**
     * @description: 更新组件属性
     * @param {*} props
     * @param {*} isShow 是否在更新props后打开弹窗，默认true
     */
    updateComponentProps(props, isShow = true) {
      this.curComponentProps = { ...props }
      console.log(this.footer)
      isShow && (this.visible = true)
    },
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="less"></style>
<style lang="less">
.common-modal {
  white-space: nowrap;
  .ant-modal-header {
    border-bottom: none;
    padding: 16px 20px 12px;
  }
  .ant-modal-body {
    min-height: unset !important;
    max-height: unset !important;
  }
}
</style>
