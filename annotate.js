// DOM of the tab being viewed which can only be accessed by content_scripts

var c = null;

console.log('annotate.js');

chrome.runtime.sendMessage({type:'showPageAction'});

chrome.runtime.onMessage.addListener(function() {
  console.log('recv', arguments);
  console.log(document.body, c);
  if (!c) {
    c = annotate(document);
  } else {
    document.body.removeChild(c);
    c = null;
  }
});

function annotate(document) {
  var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '99';
    document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var body = document.querySelector('body');
  var body_style = getComputedStyle(body);
  canvas.width = parseInt(body_style.getPropertyValue('width'));
  canvas.height = parseInt(body_style.getPropertyValue('height'));

  var mouse = {x: 0, y: 0};
  var last_mouse = {x: 0, y: 0};

  /* Mouse Capturing Work */
  canvas.addEventListener('mousemove', function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  }, false);


  /* Drawing on Paint App */
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'blue';

  canvas.addEventListener('mousedown', function(e) {
    canvas.addEventListener('mousemove', onPaint, false);
  }, false);

  canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
  }, false);

  var onPaint = function() {
    ctx.beginPath();
    ctx.moveTo(last_mouse.x, last_mouse.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
  };

  return canvas;
}
