export default {
  spin: {
    bind(el, binding, vnode) {
      console.log(binding)
      const loading = binding.value
      const loadingText = binding.arg || ''
      const that = vnode.context
      const con = document.createElement('div')
      con.style = `position: relative;top: -100%;width:100%;transition:opacity 0.3s`
      if (loading) {
        con.style.display = 'block'
        con.style.opacity = '1'
      } else {
        that.$nextTick(() => {
          con.style.opacity = '0'
          setTimeout(() => {
            con.style.display = 'none'
          }, 600)
        })
      }
      const coninner = document.createElement('div')
      coninner.className = 'spin-con'
      coninner.style = `position: absolute;
          z-index: 2000;
          background-color: rgba(255, 255, 255, 0.9);
          margin: auto;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width:100%;
          display: flex;
          align-items: center;
          justify-content: center;
          `
      coninner.innerHTML = `<div class="ant-spin-nested-loading ant-table-without-pagination ant-table-spin-holder"><div><div class="ant-spin ant-spin-spinning"><span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span>
      <div style="white-space: nowrap;margin-top: 12px;transform: translate(-50%);width: fit-content;">${loadingText}</div></div></div><div class="ant-spin-container ant-spin-blur">`
      con.append(coninner)
      el.appendChild(con)
    },
    inserted(el, binding, vnode) {
      const that = vnode.context
      that.$nextTick(() => {
        el.querySelector('.spin-con').style.top = -el.getBoundingClientRect().height + 'px'
        el.querySelector('.spin-con').style.height = el.getBoundingClientRect().height + 'px'
      })
    },
    componentUpdated(el, binding, vnode) {
      const that = vnode.context
      const loading = binding.value
      that.$nextTick(() => {
        el.querySelector('.spin-con').style.top = -el.getBoundingClientRect().height + 'px'
        el.querySelector('.spin-con').style.height = el.getBoundingClientRect().height + 'px'
        if (!loading) {
          el.querySelector('.spin-con').parentElement.style.opacity = '0'
          setTimeout(() => {
            el.querySelector('.spin-con').parentElement.style.display = 'none'
          }, 600)
        } else {
          el.querySelector('.spin-con').parentElement.style.opacity = '1'
          el.querySelector('.spin-con').parentElement.style.display = 'block'
        }
      })
    }
  }
}
