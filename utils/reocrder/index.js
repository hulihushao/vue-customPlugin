// import Recorder from 'recorder-js';
import Recorder from 'js-audio-recorder';
// 保存私有变量
class Variable {}
// 录音类
export default class Recorders {
  constructor() {
    this.recorder = null;
    this.stream = null;
    this.flag=false
    this.init();
  }
  // 初始化音频环境对象
  init() {
    // 音频环境对象
    this.recorder = new Recorder({
      sampleRate: 44100,
      numChannels: 1
    });
    // console.log(this.recorder);
  }
  /**
   *开始录音
   * @param {*} callback
   */
  start(callback) {
    this.recorder.start().then(() => {
      this.flag=false
      if (typeof callback == 'function') callback();
    },(error)=>{
      console.log('录音设备打开失败：',error)
      this.flag=true
    });
  }
  /**
   *停止录音
   * @param {function} callback
   * blob   Blob对象
   * buffer   字节元素数组
   * url  临时生成的预览url
   */
  stop(callback) {
    this.recorder.stop();
    if(this.flag)return
    let blob = this.recorder.getWAVBlob();
    let audioCrc = window.URL.createObjectURL(blob);
    if (typeof callback == 'function') callback({ blob, url: audioCrc });
  }

  /**
   *下载音频
   *
   */
  download() {
    this.recorder.downloadWAV(new Date().getTime());
  }
  /**
   *   关闭录音
   */
  close() {
    this.recorder.destroy().then(() => {
      this.recorder = null;
    });
  }
  /**鼠标长按按钮
   *长按最短时长为100ms
   * @param {*} refs  指定的dom元素
   * @param {*} downFun  按下事件 100ms后执行
   * @param {*} upFun    抬起事件
   * @param {*} downfun  按下事件 立即执行
   */
  longMousePress(refs, downFun, upFun, downfun) {
    Variable.refs = refs;
    let times = 0;
    let timer = null;
    Variable.longPressEvent_down = e => {
      if (typeof downfun == 'function') downfun();

      timer = setInterval(() => {
        times++;
      }, 1);
      setTimeout(() => {
        if (typeof downFun == 'function') downFun();
      }, 100);
    };
    Variable.longPressEvent_up = e => {
      clearInterval(timer);
      let t = times;
      times = 0;
      if (t >= 100) {
        if (typeof upFun == 'function') upFun();
      } else {
        console.error('按下时长过短');
      }
    };

    Variable.refs.addEventListener('mousedown', Variable.longPressEvent_down);
    Variable.refs.addEventListener('mouseup', Variable.longPressEvent_up);
  }

  closeLongMousePress() {
    Variable.refs?.removeEventListener('mousedown', Variable.longPressEvent_down);
    Variable.refs?.removeEventListener('mouseup', Variable.longPressEvent_up);
  }
  /**
   *
   *
   */
  /**键盘空格键长按
   *长按最短时长为100ms
   * @param {*} downFun  按下事件 100ms后执行
   * @param {*} upFun    抬起事件
   * @param {*} keyCode  键盘code码，默认32-空格键
   * @param {*} downfun  按下事件 立即执行
   */
  longKeyPress(downFun, upFun, keyCode = 32, downfun) {
    let times = 0;
    let timer = null;
    let flag = false; //判断长按，keydown事件在长按时会一直触发
    Variable.longKeyPressEvent_down = e => {
      e.preventDefault();
      if (e.keyCode != keyCode) return;
      if (flag) return;

      if (typeof downfun == 'function') downfun();

      flag = true;

      timer = setInterval(() => {
        times++;
      }, 1);
      setTimeout(() => {
        if (typeof downFun == 'function') downFun();
      }, 100);
      return false;
    };
    Variable.longKeyPressEvent_up = e => {
      e.preventDefault();
      if (e.keyCode != keyCode) return;

      clearInterval(timer);

      flag = false;

      let t = times;
      times = 0;
      if (t >= 100) {
        if (typeof upFun == 'function') upFun();
      } else {
        console.error('按下时长过短');
      }
      return false;
    };

    window.addEventListener('keydown', Variable.longKeyPressEvent_down);
    window.addEventListener('keyup', Variable.longKeyPressEvent_up);
  }

  closeLongKeyPress() {
    window.removeEventListener('keydown', Variable.longKeyPressEvent_down);
    window.removeEventListener('keyup', Variable.longKeyPressEvent_up);
  }
}
