<!--
 * @Author: TJP
 * @Date: 2025-12-04 13:39:22
 * @LastEditors: TJP
 * @LastEditTime: 2025-12-11 15:32:06
-->
<template>
  <jura-tree
    :style="{ height: pageHeight - 220 + 'px', 'overflow-y': 'auto' }"
    :load-data="onLoadData"
    :loaded-keys.sync="loadedKeys"
    :expanded-keys.sync="expandedKeys"
    :tree-data="treeData"
    :selectedKeys.sync="selectedKeys"
    @expand="(keys) => (expandedKeys = keys)"
    :replace-fields="{
      title: 'topicName',
      key: 'id',
    }"
    draggable
    @dragstart="handleDragstart"
    @dragenter="handleDragenter"
    @dragleave="handleDragleave"
    @dragend="handleDragend"
    @drop="handleDrop"
  >
  </jura-tree>
</template>
<script>
export default {
  data() {
    return {
      treeData: [
        {
          id: "13a4bed9debf4d6fbbe430494e850fc5",
          parentTopicId: null,
          topicName: "勘探",
          bdScaleId: "bc277a18b44e4c35ac4aa81e4aac7040",
          bwScaleId: "",
          botScaleId: "",
          dsScaleId: "",
          scaleCompositeName: "勘探",
          pathCode: null,
          hasChild: true,
          isLeaf: false,
          count: 2324,
          scaleCode: "BD002",
          level: 1,
          scaleIdList: null,
          version: null,
          indexNo: 101,
          children: null,
        },
        {
          id: "9b13f7d122ff43958f931c98201bbbaf",
          parentTopicId: null,
          topicName: "井筒",
          bdScaleId: "dab41339a10d409f8a7429735f4f509c",
          bwScaleId: "",
          botScaleId: "",
          dsScaleId: "",
          scaleCompositeName: "井筒",
          pathCode: null,
          hasChild: true,
          isLeaf: false,
          count: 0,
          scaleCode: "BD003002",
          level: 1,
          scaleIdList: null,
          version: null,
          indexNo: 102,
          children: null,
        },
        {
          id: "78f2abb3a2684173a34551cdd0a13c9a",
          parentTopicId: null,
          topicName: "公共业务",
          bdScaleId: "c07ffcb3acb240b7a8916667dddd7454",
          bwScaleId: "",
          botScaleId: "",
          dsScaleId: "",
          scaleCompositeName: "公共业务",
          pathCode: null,
          hasChild: true,
          isLeaf: false,
          count: 38,
          scaleCode: "BD012",
          level: 1,
          scaleIdList: null,
          version: null,
          indexNo: 103,
          children: null,
        },
        {
          id: "d71020f521f24a1eb28d74efacadc44b",
          parentTopicId: null,
          topicName: "开发生产",
          bdScaleId: "0e105248019642669deca6a0270b7ff7",
          bwScaleId: "",
          botScaleId: "",
          dsScaleId: "",
          scaleCompositeName: "开发生产",
          pathCode: null,
          hasChild: true,
          isLeaf: false,
          count: 13697,
          scaleCode: "BD013",
          level: 1,
          scaleIdList: null,
          version: null,
          indexNo: 104,
          children: null,
        },
      ],
      expandedKeys: [],
      selectedKeys: [],
    };
  },
  created() {},
  methods: {
    searchAndOpen(e) {
      const value = e;
      this.levelData.keyWord = value;
      this.getPageLevel();
    },
    handleDragstart(info) {
      console.log(info);
      this.selectedKeys = [info.node.dataRef.id];
      this.$emit("dragstart", info);
    },
    handleDragenter({ node, event }) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    },
    handleDragleave({ node, event }) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    },
    handleDrop({ event, node, dragNode, dragNodesKeys }) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    },
    handleDragend() {
      this.selectedKeys = [];
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-tree li span[draggable="true"] {
  background: inherit !important;
  color: inherit !important;
  opacity: 1;
  border: inherit !important;
}
/deep/.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  background-color: #a7cde8 !important;
}
/deep/.ant-tree li .ant-tree-node-content-wrapper {
  cursor: move;
  &:hover {
    background-color: #dcebf5 !important;
  }
}
</style>
