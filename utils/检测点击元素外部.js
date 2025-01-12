const ele = document.getElementById("target");
document.addEventListener("click", function (evt) {
  // 如果点击的元素不包含在目标元素中，则代表点击了外部
  if (!ele.contains(evt.target)) {
    //  do something
  }
});
