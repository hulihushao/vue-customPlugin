/*
 * @Author: TJP
 * @Date: 2025-12-04 13:47:45
 * @LastEditors: TJP
 * @LastEditTime: 2025-12-09 16:08:21
 */
export default {
  data() {
    return {
      otherdTreeDragNode: null,
      treekey: 0
    }
  },
  mounted() {},
  methods: {
    handleOtherTreeDragSrart({ event, node }) {
      // console.log(event, node)
      this.otherdTreeDragNode = node
    },
    onDragStartByOtherTreeNode({ event, node }) {
      console.log(event, node)
      if (node.dataRef.isAsset) {
        // this.$message.warning('请选择非资产节点')
        event.dataTransfer.setData('text/plain', null)
        event.preventDefault()
        this.treekey++
      }
    },
    onDragOverByOtherTree({ event, node }) {
      // console.log(event, node, 'enterenterenterenterenter')
      // 仅拖拽资产目录树节点时执行
      if (this.otherdTreeDragNode && !node.dataRef.isAsset) {
        node.$el.classList.add('drag-over')
      }
    },
    onDragEnterByOtherTree({ event, node }) {},
    onDragLeaveByOtherTree({ event, node }) {
      // console.log(event, node, 'leaveleaveleaveleaveleaveleave')
      // 仅拖拽资产目录树节点时执行
      if (this.otherdTreeDragNode) {
        node.$el.classList.remove('drag-over')
      }
    },
    // 拖拽拖拽资产目录树放置的逻辑
    onDropByOtherTree({ event, node, dragNode, dragNodesKeys }) {
      // console.log(event, node, dragNode, dragNodesKeys)
      node.$el.classList.remove('drag-over')
      if (node.dataRef.isAsset) return
      if (node.dataRef.isLeaf || node.dataRef.hasAsset) {
        node.dataRef.isLeaf = false
        this.$set(node.dataRef, 'hasAsset', true)
        if (!node.dataRef.children) {
          this.$set(node.dataRef, 'children', [
            {
              id: this.otherdTreeDragNode.dataRef.id,
              domainName: this.otherdTreeDragNode.dataRef.topicName,
              isLeaf: true,
              isAsset: true,
              class: 'is-asset-node'
            }
          ])
        } else {
          const fd = node.dataRef.children.find((item) => item.id === this.otherdTreeDragNode.dataRef.id)
          if (fd) {
            this.$message.warning('已存在该资产')
            return
          }
          node.dataRef.children.push({
            id: this.otherdTreeDragNode.dataRef.id,
            domainName: this.otherdTreeDragNode.dataRef.topicName,
            isLeaf: true,
            isAsset: true,
            class: 'is-asset-node'
          })
        }
        if (!this.expandedKeys.includes(node.dataRef.id)) this.expandedKeys.push(node.dataRef.id)
      } else {
        this.$message.error('请选择末级节点')
      }
      this.otherdTreeDragNode = null
    }
  }
}
