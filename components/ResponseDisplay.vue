<template>
  <div class="response-display">
    <div class="response-header">
      <h3>{{ $wci18n.t('components.ResponseDisplay.327538-0') }}</h3>
      <div class="header-actions">
        <el-button type="text" size="small" @click="copyResponse" :disabled="!responseText">
          <i class="el-icon-document-copy"></i> {{ $wci18n.t('common.button.copy') }}
        </el-button>
        <el-button type="text" size="small" @click="clearResponse">
          <i class="el-icon-delete"></i> {{ $wci18n.t('common.button.clear') }}
        </el-button>
        <el-button type="text" size="small" @click="toggleMarkdownRender" :disabled="!responseText">
          <i class="el-icon-view"></i>
          {{
            isMarkdownRender
              ? $wci18n.t('components.ResponseDisplay.327538-3')
              : $wci18n.t('components.ResponseDisplay.327538-4')
          }}
        </el-button>
      </div>
    </div>
    <div class="response-content">
      <div v-if="loading" class="loading-container">
        <div v-loading="true" style="height: 60px; width: 60px"></div>
        <p>{{ $wci18n.t('components.ResponseDisplay.327538-5') }}</p>
      </div>
      <div v-else-if="responseText" class="response-text">
        <div v-if="isMarkdownRender" class="markdown-content" v-html="markdownHtml" @click="handleMarkdownClick"></div>
        <pre v-else>{{ displayText }}</pre>
      </div>
      <div v-else class="empty-state">
        <i class="el-icon-tip"></i>
        <p>{{ $wci18n.t('components.ResponseDisplay.327538-6') }}</p>
      </div>
      <i v-if="responseText" style="font-size: 12px; color: #999999">{{
        $wci18n.t('components.ResponseDisplay.327538-7')
      }}</i>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // 使用暗色主题

export default {
  name: 'ResponseDisplay',
  props: {
    responseText: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMarkdownRender: true,
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value
            } catch (__) {}
          }

          // 对于没有指定语言或无法识别的语言，使用自动检测
          try {
            return hljs.highlightAuto(str).value
          } catch (__) {}

          return '' // 使用默认处理
        }
      }),
      // 打字机效果相关属性
      typingText: '', // 当前正在打字显示的文本
      typingIndex: 0, // 当前打字的索引位置
      typingSpeed: 20, // 打字速度（毫秒/字符）
      typingTimer: null, // 打字计时器
      isTyping: false, // 是否正在打字
      scrollBottom: true
    }
  },
  computed: {
    markdownHtml() {
      // 根据是否在打字决定渲染的文本
      if (this.isTyping) {
        return this.md.render(this.typingText)
      }
      return this.md.render(this.responseText)
    },

    // 显示的文本，根据打字状态决定
    displayText() {
      return this.isTyping ? this.typingText : this.responseText
    }
  },

  watch: {
    // 监听responseText变化，触发打字机效果
    responseText(newText) {
      if (newText && !this.loading) {
        this.startTypingEffect(newText)
      } else {
        this.resetTypingEffect()
      }
    },

    // 监听loading状态，如果变为true，重置打字效果
    loading(newLoading) {
      if (newLoading) {
        this.resetTypingEffect()
      }
    }
  },

  // 组件挂载时，如果已有响应文本，开始打字效果
  mounted() {
    if (this.responseText && !this.loading) {
      this.startTypingEffect(this.responseText)
    }
  },

  // 组件销毁时清除定时器
  beforeDestroy() {
    if (this.typingTimer) {
      clearInterval(this.typingTimer)
    }
  },
  methods: {
    copyResponse() {
      if (!this.responseText) return

      const textArea = document.createElement('textarea')
      textArea.value = this.responseText
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        this.$message.success(this.$wci18n.t('components.ResponseDisplay.327538-8'))
      } catch (err) {
        this.$message.error(this.$wci18n.t('components.ResponseDisplay.327538-9'))
        console.error(this.$wci18n.t('components.ResponseDisplay.327538-10'), err)
      } finally {
        document.body.removeChild(textArea)
      }
    },

    // 复制单个代码块的内容
    copyCodeBlock(e) {
      // 找到最近的pre元素
      const preElement = e.target.closest('pre')
      if (!preElement) return

      // 获取代码内容
      const codeElement = preElement.querySelector('code')
      if (!codeElement) return

      const textArea = document.createElement('textarea')
      textArea.value = codeElement.textContent
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        this.$message.success(this.$wci18n.t('components.ResponseDisplay.327538-11'))
      } catch (err) {
        this.$message.error(this.$wci18n.t('components.ResponseDisplay.327538-9'))
        console.error('复制失败:', err)
      } finally {
        document.body.removeChild(textArea)
      }
    },

    clearResponse() {
      this.$emit('clear-response')
    },

    toggleMarkdownRender() {
      this.isMarkdownRender = !this.isMarkdownRender
    },

    // 监听代码块的点击事件
    handleMarkdownClick(e) {
      if (e.target.classList.contains('code-copy-btn')) {
        this.copyCodeBlock(e)
      }
    },

    // 开始打字机效果
    startTypingEffect(text) {
      this.resetTypingEffect()
      this.isTyping = true

      // 如果文本很短，不使用打字机效果以提高用户体验
      if (text.length < 20) {
        this.typingText = text
        this.isTyping = false
        return
      }

      let markdownContent
      setTimeout(() => {
        markdownContent = this.$el.querySelector('.markdown-content')
        markdownContent.onscroll = (e) => {
          if (markdownContent?.scrollHeight - markdownContent?.clientHeight - markdownContent?.scrollTop <= 1) {
            this.scrollBottom = true
          } else {
            this.scrollBottom = false
          }
        }
      }, 0)

      this.typingTimer = setInterval(() => {
        if (this.typingIndex < text.length) {
          this.typingText += text.charAt(this.typingIndex)
          this.typingIndex++
          if (this.scrollBottom) {
            markdownContent.scrollTop = markdownContent.scrollHeight
          }
        } else {
          this.finishTypingEffect()
        }
      }, this.typingSpeed)
    },

    // 完成打字机效果
    finishTypingEffect() {
      if (this.typingTimer) {
        clearInterval(this.typingTimer)
        this.typingTimer = null
      }
      this.isTyping = false
    },

    // 重置打字机效果
    resetTypingEffect() {
      if (this.typingTimer) {
        clearInterval(this.typingTimer)
        this.typingTimer = null
      }
      this.typingText = ''
      this.typingIndex = 0
      this.isTyping = false
    }
  },

  // 当markdown渲染完成后，为代码块添加复制按钮
  updated() {
    if (this.isMarkdownRender) {
      // 移除已有的复制按钮，避免重复添加
      document.querySelectorAll('.code-copy-btn').forEach((btn) => btn.remove())

      // 为每个pre标签添加复制按钮
      const preElements = document.querySelectorAll('.markdown-content pre')
      preElements.forEach((pre) => {
        // 创建复制按钮
        const copyBtn = document.createElement('button')
        copyBtn.className = 'code-copy-btn'
        copyBtn.innerHTML = '<i class="el-icon-document-copy"></i> 复制'
        copyBtn.style.position = 'absolute'
        copyBtn.style.top = '10px'
        copyBtn.style.right = '10px'
        copyBtn.style.padding = '4px 8px'
        copyBtn.style.fontSize = '12px'
        copyBtn.style.backgroundColor = '#4b5263'
        copyBtn.style.color = '#fff'
        copyBtn.style.border = 'none'
        copyBtn.style.borderRadius = '4px'
        copyBtn.style.cursor = 'pointer'
        copyBtn.style.zIndex = '10'
        copyBtn.style.opacity = '0'
        copyBtn.style.transition = 'opacity 0.3s'

        // 设置pre标签为相对定位，使按钮定位正确
        pre.style.position = 'relative'

        // 添加按钮到pre标签
        pre.appendChild(copyBtn)

        // 鼠标悬停时显示按钮
        pre.addEventListener('mouseenter', () => {
          copyBtn.style.opacity = '1'
        })
        pre.addEventListener('mouseleave', () => {
          copyBtn.style.opacity = '0'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.response-display {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fafafa;
  margin-top: 20px;
  width: 100%;

  .response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #e4e7ed;
    background-color: #f5f5f5;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .header-actions {
      display: flex;
      align-items: center;

      .el-button {
        padding: 5px 8px;
        margin-left: 5px;
        font-size: 12px;
      }
    }
  }

  .response-content {
    min-height: 200px;
    padding: 12px;

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 168px;
      color: #909399;

      .el-loading-spinner {
        margin-bottom: 12px;
      }
    }

    .response-text {
      .markdown-content {
        margin: 0;
        padding: 12px;
        background-color: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        max-height: 500px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.6;
        color: #303133;

        /* Markdown 样式 */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          color: #303133;
        }

        p {
          margin: 1em 0;
        }

        pre {
          padding: 16px;
          background-color: #282c34; /* 与atom-one-dark主题协调的背景色 */
          border: 1px solid #4b5263;
          border-radius: 6px;
          overflow-x: auto;
          font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          margin: 16px 0;
          position: relative; /* 为复制按钮提供定位上下文 */
        }

        code {
          padding: 0.2em 0.4em;
          background-color: #f6f8fa;
          border-radius: 3px;
          font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
          font-size: 13px;
        }

        pre code {
          padding: 0;
          background-color: transparent;
          color: #abb2bf; /* 与暗色主题协调的文本颜色 */
        }

        blockquote {
          padding: 10px 20px;
          margin: 1em 0;
          border-left: 4px solid #e4e7ed;
          background-color: #f8f9fa;
          color: #606266;
        }

        ul,
        ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        li {
          margin: 0.5em 0;
        }

        a {
          color: #409eff;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          font-size: 13px;
        }

        th,
        td {
          padding: 6px 8px;
          border: 1px solid #ebeef5;
          font-size: 13px;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 500;
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 168px;
      color: #909399;

      i {
        font-size: 32px;
        margin-bottom: 8px;
      }
    }
  }

  /deep/.el-loading-mask {
    background-color: transparent;
  }

  /* 响应式设计 */
  @media (max-width: 767px) {
    margin-top: 15px;
    border-radius: 4px;

    .response-header {
      padding: 8px 10px;
      flex-wrap: wrap;
      gap: 8px;

      h3 {
        font-size: 14px;
        width: 100%;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;

        .el-button {
          padding: 4px 6px;
          font-size: 11px;
        }
      }
    }

    .response-content {
      padding: 10px;
      min-height: 150px;

      .response-text {
        .markdown-content {
          padding: 10px;
          font-size: 13px;
          line-height: 1.5;
          max-height: 400px;
        }

        .response-text pre {
          padding: 14px;
          font-size: 12px;
          max-height: 400px;
          background-color: #282c34;
          border: 1px solid #4b5263;
          color: #abb2bf;
          position: relative; /* 为复制按钮提供定位上下文 */
        }
      }
    }

    .empty-state {
      min-height: 120px;

      i {
        font-size: 24px;
      }

      p {
        font-size: 13px;
      }
    }
  }

  @media (min-width: 768px) {
    .response-header {
      padding: 12px 16px;
    }

    .response-content {
      padding: 16px;
    }

    .response-text .markdown-content {
      padding: 16px;
    }

    .response-text pre {
      padding: 16px;
      background-color: #282c34;
      border: 1px solid #4b5263;
      color: #abb2bf;
      position: relative; /* 为复制按钮提供定位上下文 */
    }
  }
}
</style>
<style>
.markdown-content pre {
  margin: 0;
  padding: 16px;
  background-color: #282c34; /* 与atom-one-dark主题协调的背景色 */
  border: 1px solid #4b5263;
  border-radius: 6px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #abb2bf; /* 与暗色主题协调的文本颜色 */
  max-height: 500px;
  overflow-y: auto;
  position: relative; /* 为复制按钮提供定位上下文 */
}

/* 复制按钮样式 */
.code-copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  font-size: 12px;
  background-color: #4b5263;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
}

.code-copy-btn:hover {
  background-color: #616e88;
}
</style>
