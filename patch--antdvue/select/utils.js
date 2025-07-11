export function setOnScroll(arr, targetClass) {
  arr.forEach((el) => {
    let last = el.scrollTop
    el.onscroll = (e) => {
      const c = e.target.scrollTop - last
      last = e.target.scrollTop
      // console.log(c)

      document.querySelectorAll(targetClass).forEach((item) => {
        if (item.style.display !== 'none') {
          item.style.top = parseFloat(item.style.top) - c + 'px'
        }
      })
    }
  })
}
