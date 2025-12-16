<template>
  <div>
    <div
      class="flex-container"
      :style="{
        'justify-content': isShowHookTree ? 'flex-start' : 'space-between',
      }"
    >
      <div class="left">
        <jura-spin :spinning="loading">
          <jura-tree
            :key="treekey"
            :expanded-keys="expandedKeys"
            :tree-data="treeData"
            :selectedKeys.sync="selectedKeys"
            draggable
            @dragstart="onDragStartByOtherTreeNode"
            @dragover="onDragOverByOtherTree"
            @dragenter="onDragEnterByOtherTree"
            @dragleave="onDragLeaveByOtherTree"
            @drop="onDrop"
            @expand="(keys) => (expandedKeys = keys)"
            :replace-fields="{
              title: 'domainName',
              key: 'id',
            }"
          >
            <template #title="item">
              <span style="color: #ab5d0a">{{ item.domainName }}</span>

              <span style="display: flex; justify-content: space-between">
                <span>{{ item.domainName }}</span>
                <span style="margin-right: 4px"> </span>
              </span>
            </template>
          </jura-tree>
        </jura-spin>
      </div>
      <div style="width: 300px; margin-left: 10px">
        <HookTree @dragstart="handleOtherTreeDragSrart" />
      </div>
    </div>
  </div>
</template>

<script>
import HookTree from "./HookTree.vue";
import dragJS from "./drag";

export default {
  mixins: [dragJS],
  components: {
    HookTree,
  },
  data() {
    return {
      treekey: 1,
      selectedKeys: [],
      expandedKeys: [],
      treeData: [
        {
          id: "94ce41c5750d4c8f80ab66fe20ed5aaa",
          projectId: "12dded9f4c853de67814d1e82b37eaac",
          parentDomainId: "",
          domainName: "wer",
          domainCode: "wer",
          rootDomainId: "94ce41c5750d4c8f80ab66fe20ed5aaa",
          chargeDept: "",
          definition: "sf",
          domainDesc: "",
          indexNo: 7,
          children: [
            {
              id: "2211c36e8e7dcf02e6ce6695b4f80a67",
              projectId: "12dded9f4c853de67814d1e82b37eaac",
              parentDomainId: "94ce41c5750d4c8f80ab66fe20ed5aaa",
              domainName: "wfwf",
              domainCode: "wf",
              rootDomainId: "94ce41c5750d4c8f80ab66fe20ed5aaa",
              chargeDept: "",
              definition: "",
              domainDesc: "",
              indexNo: 1,
              children: [],
              hasChildren: false,
              hasPt: false,
            },
          ],
          hasChildren: true,
          hasPt: false,
        },
        {
          id: "3b85501382e8468b9f51edb4d3012f72",
          projectId: "12dded9f4c853de67814d1e82b37eaac",
          parentDomainId: "",
          domainName: "123456",
          domainCode: "12345",
          rootDomainId: "3b85501382e8468b9f51edb4d3012f72",
          chargeDept: "",
          definition: "",
          domainDesc: "",
          indexNo: 8,
          children: null,
          hasChildren: false,
          hasPt: false,
        },
      ],
    };
  },
  created() {},
  methods: {
    onDrop(info) {
      if (!info.dragNode) {
        this.onDropByOtherTree(info);
        return;
      }
      console.log("目标节点", info.node.pos, info.node.dataRef);
      console.log("当前节点", info.dragNode.pos, info.dragNode.dataRef);
      const node = info.node.dataRef;
      const dragNode = info.dragNode.dataRef;
      if (info.node.pos.length === info.dragNode.pos.length) {
        dragNode.indexNo = node.indexNo;
        OuiApi.postDomainUpdate(dragNode).then((res) => {
          if (res.code === 0) {
            console.log("拖拽成功");
            this.getTreeList();
            this.expandedKeys.pop();
            console.log(this.treeData);
          }
        });
      } else {
        this.$message.warning(
          this.$wci18n.t("assetCatalogManagement.index.drag_at_same_level")
        );
      }
    },
  },
};
</script>

<style scoped lang="less">
.toolbar-text-right {
  text-align: right;
  & > * {
    margin-right: 8px;
  }
  .ant-btn:last-child {
    margin-right: 0px;
  }
}
/deep/.ant-tree li span.ant-tree-node-content-wrapper {
  display: inline-block;
  width: calc(100% - 24px);
}
/deep/.ant-tree .is-asset-node > span[draggable]:not(.ant-tree-node-selected):not(:hover) {
  background: inherit !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  .left {
    display: inline-block;
    width: 280px;
    padding-right: 10px;
    border-right: 1px solid #e8e8e8;
  }
  .right {
    margin-left: 10px;
    flex: 1;
    overflow-x: auto;
  }
}
</style>
