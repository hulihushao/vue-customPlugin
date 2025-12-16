/*
 * @Author: TJP
 * @Date: 2025-09-19 15:03:30
 * @LastEditors: TJP
 * @LastEditTime: 2025-09-19 15:03:37
 */
// 获取用户访问IP地址
function getIPs(callback) {
  var ip_dups = {};
  var RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection
    || window.webkitRTCPeerConnection;
  var useWebKit = !!window.webkitRTCPeerConnection;
  var mediaConstraints = {
    optional: [{ RtpDataChannels: true }]
  };
  // 这里就是需要的ICEServer了
  var servers = {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun.l.google.com:19302" },
    ]
  };
  var pc = new RTCPeerConnection(servers, mediaConstraints);
  function handleCandidate(candidate) {
    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
    var hasIp = ip_regex.exec(candidate)
    if (hasIp) {
      var ip_addr = ip_regex.exec(candidate)[1];
      if (ip_dups[ip_addr] === undefined)
        callback(ip_addr);
      ip_dups[ip_addr] = true;
    }
  }
  // 网络协商的过程
  pc.onicecandidate = function (ice) {
    if (ice.candidate) {
      handleCandidate(ice.candidate.candidate);
    }
  };
 
  pc.createDataChannel("");
  pc.createOffer(function (result) {
    pc.setLocalDescription(result, function () { }, function () { });
  }, function () { });
  setTimeout(function () {
    var lines = pc.localDescription.sdp.split('\n');
    lines.forEach(function (line) {
      if (line.indexOf('a=candidate:') === 0)
        handleCandidate(line);
    });
  }, 1000);
}
getIPs((ip) => {
  console.log('ip ----> ', ip);
})



function getLocation() {
  fetch('https://ipapi.co/json/')
    .then(res => {
      return res.json();
    }).then(userLocation => {
      console.log("用户位置---> ", userLocation);
    }).catch(err => {
      console.log(err);
    })
}