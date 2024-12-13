import antd from 'ant-design-vue/es/locale-provider/zh_CN'

const def = {
  title: '',
  wrapClassName: '',
  component: {},
  componentProps: {},
  width: 710,
  closeAfterCatch: false,
  bodyStyle: {},
  dialogStyle: {},
  locale: antd,
  footer: undefined,
  ok: () => {},
  cancel: () => {},
  curcomponent: {}
}
let modalInstance
let CommonModal
const map = new Map()

export default {
  install: (Vue) => {
    /**
     * @param {*} propsData
     * title,
     * wrapClassName,
     * component,
     * componentProps,//组件props，格式{[组件定义的传入的prop名称]:数据}
     * width,
     * closeAfterCatch,// 是否在请求失败后关闭弹窗
     * showAfterMounted,//是否在组件挂载后显示弹窗
     * bodyStyle,
     * dialogStyle,
     * locale,//默认中文
     * footer,//是否显示按钮
     * footerProps,
     * ok,
     * cancel,
     * return 弹窗组件实例，提供updateComponentProps更新弹窗中的组件的props，方法参数格式与创建弹窗的componentProps一致，提供close方法关闭弹窗，同时该方法会传入弹窗中的组件中，名称为close，提供show方法打开弹窗；弹窗中的组件可通过$refs使用，使用return Promise.reject()可阻止确认按钮关闭弹窗
     */
    function openModal(propsData) {
      const instance = map.get(propsData.component._scopeId)
      if (instance) {
        propsData.curcomponent = propsData.component
        instance._props = propsData
        for (const key in def) {
          if (Object.hasOwnProperty.call(propsData, key)) {
            this.$set(instance._props, key, propsData[key])
          } else {
            this.$set(instance._props, key, def[key])
          }
        }
        instance.updateComponentProps(propsData.componentProps)
        return instance
      }
      // CommonModal && CommonModal.$destroy()
      const { showAfterMounted = true } = propsData
      let dialogDiv = document.querySelector('body>div[type=dialog]')
      if (!dialogDiv) {
        dialogDiv = document.createElement('div')
        dialogDiv.setAttribute('type', 'dialog')
        document.body.appendChild(dialogDiv)
      }

      const suraModal = createModal()
      console.log(this)
      const that = this
      CommonModal = new Vue({
        router: this.$router,
        store: this.$store,
        i18n: this.$i18n,
        provide() {
          return {
            localeData: that._provided.localeData
          }
        },
        render: function (h) {
          let footer = null
          let footerComponent = null
          if (propsData.footer === null || propsData.footer === undefined) {
            footer = propsData.footer
          } else if (typeof propsData.footer == 'object' && propsData.footer._scopeId) {
            footerComponent = propsData.footer
            footer = null
          } else {
            throw new Error('footer参数错误')
          }
          if (!footerComponent) {
            return h(suraModal, {
              ref: 'CommonModal',
              props: {
                vis: showAfterMounted,
                ...propsData,
                footer,
                curcomponent: propsData.component
              }
            })
          }
          return h(
            suraModal,
            {
              ref: 'CommonModal',
              props: {
                vis: showAfterMounted,
                ...propsData,
                footer,
                curcomponent: propsData.component
              }
            },
            [
              h(footerComponent, {
                slot: 'footer',
                props: {
                  ...(propsData.footerProps || {})
                }
              })
            ]
          )
        }
      }).$mount(dialogDiv)
      modalInstance = CommonModal.$refs.CommonModal
      // console.log(propsData.component, CommonModal, modalInstance)
      map.set(propsData.component._scopeId, modalInstance)
      return modalInstance
    }
    function createModal() {
      return {
        components: {},
        data() {
          return {
            loading: false,
            visible: false,
            curComponentProps: {},
            localed: null
          }
        },
        props: {
          title: {
            type: String,
            default: ''
          },
          wrapClassName: {
            type: String,
            default: ''
          },
          locale: {
            type: Object,
            default: () => null
          },
          width: {
            type: [String, Number],
            default: 710
          },
          curcomponent: {
            type: Object,
            default: () => ({})
          },
          componentProps: {
            type: Object,
            default: () => ({})
          },
          ok: {
            type: Function
          },
          cancel: {
            type: Function
          },
          bodyStyle: {
            type: Object,
            default: () => ({})
          },
          dialogStyle: {
            type: Object,
            default: () => ({})
          },
          vis: Boolean,
          closeAfterCatch: {
            type: Boolean,
            default: false
          },
          footer: {
            type: [Object],
            default: undefined
          }
        },
        inject: ['localeData'],
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
          localeData: {
            deep: true,
            handler(val) {
              this.localed = this.locale || val.antdLocale
            }
          }
        },
        created() {
          console.log(this.localeData)
          this.localed = { ...this.locale }
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
        },
        render: function (h) {
          const Component = this.curcomponent
          return (
            <a-config-provider locale={this.localed || antd}>
              <a-modal
                visible={this.visible}
                title={this.title}
                width={this.width}
                destroyOnClose={true}
                dialogStyle={this.dialogStyle}
                bodyStyle={{ padding: '0px 20px 20px', ...this.bodyStyle }}
                locale={this.locale || antd}
                footer={this.footer}
                wrapClassName={`common-modal ${this.wrapClassName || ''}`}
                vOn:cancel={this.handleRCancel}
              >
                <Component {...{ props: this.curComponentProps }} ref={'curComponent'} close={this.close}></Component>
                {this.$slots.footer}
              </a-modal>
            </a-config-provider>
          )
        }
      }
    }
    Vue.prototype.$Modal = openModal
  }
}
