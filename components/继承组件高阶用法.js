// 高阶组件生成器
const withBaseTemplate = (WrappedComponent) => {
  return {
    extends: WrappedComponent,
    render(h) {
      const vnodes = [
        h('div', { class: 'base-header' }, '公共头部'),
        WrappedComponent.options.render.call(this, h), // 渲染原组件
        h('div', { class: 'base-footer' }, '公共底部')
      ]
      return h('div', { class: 'wrapper' }, vnodes)
    }
  }
}

// 使用
const ChildComponent = withBaseTemplate({
  template: `<div>子组件核心内容</div>`
})