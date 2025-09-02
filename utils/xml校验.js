export function validateXML(xmlString, className) {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

    // 检查是否有错误信息
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      if (className) {
        if (document.querySelector(`${className}`).getElementsByTagName('parsererror')[0]) {
          document.querySelector(`${className}`).getElementsByTagName('parsererror')[0].parentElement.remove()
        }
        document.querySelector(`${className}`).appendChild(xmlDoc.getElementsByTagName('parsererror')[0].parentElement)
      }
      return false
    } else {
      return true
    }
  } catch (e) {
    console.error('Error parsing XML:', e)
    return false
  }
}