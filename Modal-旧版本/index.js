import modal from './index.vue'
import Vue from 'vue'
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
  footer: true,
  ok: () => {},
  cancel: () => {},
  curcomponent: {}
}
let modalInstance
let CommonModal
const map = new Map()
/**
 * @param {*} props
 * title,
 * wrapClassName,
 * component,
 * componentProps,//组件props，格式{[组件定义的传入的prop名称]:数据}
 * width,
 * closeAfterCatch,// 是否在请求失败后关闭弹窗
 * showAfterMounted,//是否在组件挂载后显示弹窗
 * bodyStyle,
 * dialogStyle,
 * footer,//是否显示按钮
 * ok,
 * cancel,
 * return 弹窗组件实例，提供updateComponentProps更新弹窗中的组件的props，方法参数格式与创建弹窗的componentProps一致，提供close方法关闭弹窗，同时该方法会传入弹窗中的组件中，名称为close，提供show方法打开弹窗；弹窗中的组件可通过$refs使用，使用return Promise.reject()可阻止确认按钮关闭弹窗
 */
export default function openModal(props) {
  const instance = map.get(props.component._scopeId)
  if (instance) {
    props.curcomponent = props.component
    instance._props = props
    for (const key in def) {
      if (Object.hasOwnProperty.call(props, key)) {
        this.$set(instance._props, key, props[key])
      } else {
        this.$set(instance._props, key, def[key])
      }
    }
    instance.updateComponentProps(props.componentProps)
    return instance
  }
  // CommonModal && CommonModal.$destroy()
  const { showAfterMounted = true } = props
  let dialogDiv = document.querySelector('body>div[type=dialog]')
  if (!dialogDiv) {
    dialogDiv = document.createElement('div')
    dialogDiv.setAttribute('type', 'dialog')
    document.body.appendChild(dialogDiv)
  }
  CommonModal = new Vue({
    router: this.$router,
    store: this.$store,
    render: function (h) {
      return h(modal, {
        ref: 'CommonModal',
        props: {
          vis: showAfterMounted,
          ...props,
          curcomponent: props.component
        }
      })
    }
  }).$mount(dialogDiv)
  modalInstance = CommonModal.$refs.CommonModal
  console.log(props.component, CommonModal, modalInstance)
  map.set(props.component._scopeId, modalInstance)
  // console.log(map)
  return modalInstance
}
