import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale";
const def = {
  title: "",
  customClass: "",
  component: {
    render() {},
  },
  componentProps: {},
  width: 710,
  closeAfterCatch: false,
  closeOnClickModal: true,
  showAfterMounted: true,
  modal: true,
  locale: null,
  footer: undefined,
  footerProps: {},
  ok: () => {},
  cancel: () => {},
  close: () => {},
  open: () => {},
  curcomponent: {
    render() {},
  },
};
let modalInstance;
let CommonDialog;
const map = new Map();

export default {
  install: (Vue) => {
    /**
     * @param {*} propsData
     * title,
     * customClass,
     * component,// 组件,必选
     * componentProps,//组件props，格式{[组件定义的传入的prop名称]:数据}
     * width,
     * closeAfterCatch,// 是否在请求失败后关闭弹窗
     * closeOnClickModal,//是否可以通过点击 modal 关闭 Dialog
     * showAfterMounted,//是否在组件挂载后显示弹窗
     * locale,//默认中文,'zh_cn','en_US'
     * modal,
     * footer,//是否显示按钮
     * footerProps,
     * ok,
     * cancel/close,
     * open,
     * return 弹窗组件实例，提供updateComponentProps更新弹窗中的组件的props，方法参数格式与创建弹窗的componentProps一致，提供close方法关闭弹窗，同时该方法会传入弹窗中的组件中，名称为close，提供show方法打开弹窗；弹窗中的组件可通过$refs使用，使用return Promise.reject()可阻止确认按钮关闭弹窗
     */
    function openDialog(propsData) {
      const instance = map.get(propsData.component._scopeId);
      if (instance) {
        propsData.curcomponent = propsData.component;
        instance._props = propsData;
        for (const key in def) {
          if (Object.hasOwnProperty.call(propsData, key)) {
            this.$set(instance._props, key, propsData[key]);
          } else {
            this.$set(instance._props, key, def[key]);
          }
        }
        instance.updateComponentProps(propsData.componentProps);
        return instance;
      }
      // CommonDialog && CommonDialog.$destroy()
      const { showAfterMounted = true } = propsData;
      let dialogDiv = document.querySelector("body>div[type=dialog]");
      if (!dialogDiv) {
        dialogDiv = document.createElement("div");
        dialogDiv.setAttribute("type", "dialog");
        document.body.appendChild(dialogDiv);
      }

      const suraModal = createModal();
      console.log(this);
      CommonDialog = new Vue({
        router: this.$router,
        store: this.$store,
        i18n: this.$i18n,
        created() {
          locale.use(propsData.locale === "en_US" ? enLocale : zhLocale);
        },
        render: function (h) {
          let footer = null;
          let footerComponent = null;
          if (propsData.footer === null || propsData.footer === undefined) {
            footer = propsData.footer;
          } else if (
            typeof propsData.footer == "object" &&
            propsData.footer._scopeId
          ) {
            footerComponent = propsData.footer;
            footer = null;
          } else {
            throw new Error("footer参数错误");
          }
          const titleComp = [];
          if (typeof propsData.title == "object" && propsData.title._scopeId) {
            titleType = "object";
            titleComp.push(
              h(propsData.title, {
                slot: "title",
              })
            );
          }
          if (!footerComponent) {
            return h(
              suraModal,
              {
                ref: "CommonDialog",
                props: {
                  vis: showAfterMounted,
                  ...propsData,
                  footer,
                  curcomponent: propsData.component,
                },
              },
              titleComp
            );
          }
          return h(
            suraModal,
            {
              ref: "CommonDialog",
              props: {
                vis: showAfterMounted,
                ...propsData,
                footer,
                curcomponent: propsData.component,
              },
            },
            [
              ...titleComp,
              h(footerComponent, {
                slot: "footer",
                props: {
                  ...(propsData.footerProps || {}),
                },
              }),
            ]
          );
        },
      }).$mount(dialogDiv);
      modalInstance = CommonDialog.$refs.CommonDialog;
      // console.log(propsData.component, CommonDialog, modalInstance)
      map.set(propsData.component._scopeId, modalInstance);
      return modalInstance;
    }
    function createModal() {
      return {
        components: {},
        data() {
          return {
            loading: false,
            visible: false,
            curComponentProps: {},
            localed: null,
            en: {
              ok: "Ok",
              close: "Cancel",
            },
            zh: {
              ok: "确定",
              close: "取消",
            },
          };
        },
        props: {
          title: {
            type: String,
            default: "",
          },
          customClass: {
            type: String,
            default: "",
          },
          locale: {
            type: String,
            default: () => "zh_cn",
          },
          width: {
            type: [String, Number],
            default: 710,
          },
          curcomponent: {
            type: Object,
            default: () => ({}),
          },
          componentProps: {
            type: Object,
            default: () => ({}),
          },
          ok: {
            type: Function,
          },
          cancel: {
            type: Function,
          },
          open: {
            type: Function,
          },
          close: {
            type: Function,
          },
          vis: Boolean,
          closeAfterCatch: {
            type: Boolean,
            default: false,
          },
          closeOnClickModal: {
            type: Boolean,
            default: true,
          },
          modal: {
            type: Boolean,
            default: true,
          },
          footer: {
            type: [Object],
            default: undefined,
          },
        },
        watch: {
          vis: {
            immediate: true,
            handler(val) {
              if (val) {
                this.curComponentProps = { ...this.componentProps };
                console.log(this.curComponentProps);
                this.visible = true;
              }
            },
          },
        },
        created() {
          locale.use(this.locale === "en_US" ? enLocale : zhLocale);
        },
        methods: {
          handleRCancel() {
            this.visible = false;
            this.cancel && this.cancel();
            this.close && this.close();
          },
          handleROk() {
            if (this.ok) {
              const res = this.ok(
                this.$refs[this.curcomponent.name || "curComponent"]
              );
              if (res) {
                this.loading = true;
                res
                  .then((res2) => {
                    this.loading = false;
                    this.visible = false;
                  })
                  .finally(() => {
                    this.loading = false;
                    this.closeAfterCatch && (this.visible = false);
                  });
              } else {
                this.visible = false;
              }
            }
          },
          /**
           * @description: 更新组件属性
           * @param {*} props
           * @param {*} isShow 是否在更新props后打开弹窗，默认true
           */
          updateComponentProps(props, isShow = true) {
            this.curComponentProps = { ...props };
            console.log(this.footer);
            isShow && (this.visible = true);
          },
          show() {
            this.visible = true;
          },
          closeD() {
            this.visible = false;
          },
          handleOpen() {
            this.open && this.open();
          },
        },
        render: function (h) {
          const Component = this.curcomponent;
          return (
            <el-dialog
              visible={this.visible}
              title={this.title}
              width={this.width}
              destroy-on-close={true}
              modal={this.modal}
              custom-class={`common-dialog ${this.customClass || ""}`}
              close-on-click-modal={this.closeOnClickModal}
              vOn:close={this.handleRCancel}
              vOn:open={this.handleOpen}
            >
              {this.$slots.title ? this.$slots.title : null}
              <Component
                {...{ props: this.curComponentProps }}
                ref={"curComponent"}
                close={this.closeD}
              ></Component>
              {this.$slots.footer ? (
                this.$slots.footer
              ) : (
                <span>
                  <div
                    slot:footer
                    class="dialog-footer"
                    style={`display: flex; justify-content: flex-end`}
                  >
                    <el-button vOn:click={this.handleRCancel}>
                      {this.locale === "en_US" ? this.en.close : this.zh.close}
                    </el-button>
                    <el-button type="primary" vOn:click={this.handleROk}>
                      {this.locale === "en_US" ? this.en.ok : this.zh.ok}
                    </el-button>
                  </div>
                </span>
              )}
            </el-dialog>
          );
        },
      };
    }
    Vue.prototype.$Dialog = openDialog;
  },
};
