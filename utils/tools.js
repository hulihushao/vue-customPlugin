/**
 * @name: getSomeEdit
 * @description: 获取新旧对象改变的数据
 * @param {*} now
 * @param {*} old
 * @return {*} {isEdit：boolean,editData:object}
 */
export function getSomeEdit(now, old) {
  let d = {};
  let h = {};
  for (let key in old) {
    if (Object.prototype.toString.call(old[key]) === "[object Object]") {
      h = getSomeEdit(now[key], old[key]);
      if (h.isEdit) {
        d = {
          ...d,
          [key]: {},
        };
        for (let key2 in h.editData) {
          d[key][key2] = h.editData[key2];
        }
      }
    } else {
      if (now[key] !== old[key]) {
        d[key] = now[key];
      }
    }
  }
  return {
    isEdit: Boolean(Object.keys(d).length),
    editData: d,
  };
}
