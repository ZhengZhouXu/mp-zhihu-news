const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function throttle (fn, wait, firstImmediate) {
  let timer = null;
  return () => {
    // if (timer === null && firstImmediate) {
    //   fn();
    // }
    if (timer) return;
    
    timer = setTimeout(() => {
      console.log(456);
      fn();
      timer = clearTimeout(timer);
    }, wait);
  }
}

module.exports = {
  formatTime,
  throttle
}
