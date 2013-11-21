(function() {
  var DrawApp;
  var domain = window.location.hostname;
  DrawApp = {};

  DrawApp.init = function() {
    DrawApp.canvas = document.createElement('canvas');
    DrawApp.canvas.height = 300;
    DrawApp.canvas.width = 600;
    document.getElementsByTagName('article')[0].appendChild(DrawApp.canvas);
    DrawApp.ctx = DrawApp.canvas.getContext("2d");
    DrawApp.ctx.fillStyle = "solid";
    DrawApp.ctx.strokeStyle = "#ECD018";
    DrawApp.ctx.lineWidth = 5;
    DrawApp.ctx.lineCap = "round";
    DrawApp.socket = io.connect(domain);
    DrawApp.socket.on('draw', function(data) {
      return DrawApp.draw(data.x, data.y, data.type);
    });

    DrawApp.draw = function(x, y, type) {
      if (type === "dragstart") {
        DrawApp.ctx.beginPath();
        return DrawApp.ctx.moveTo(x, y);
      } else if (type === "drag") {
        DrawApp.ctx.lineTo(x, y);
        return DrawApp.ctx.stroke();
      } else {
        return DrawApp.ctx.closePath();
      }
    };
  };

  $('canvas').live('drag dragstart dragend', function(e) {
    var offset, type, x, y;
    type = e.handleObj.type;
    offset = $(this).offset();
    x = e.layerX;
    y = e.layerY;
    DrawApp.draw(x, y, type);
    DrawApp.socket.emit('drawClick', {
      x: x,
      y: y,
      type: type
    });
  });

  $(function() {
    return DrawApp.init();
  });

}).call(this);