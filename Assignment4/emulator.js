/** emulator.js
  * Main script for emulation of app.js
  */
var visible;

/** Sets the public vars x and y to location touched on canvas.
 *  @param event Screen touch event.
 */
function getPosition(event) {
    var canvas = document.getElementById("canvas");
    if (event.x != undefined && event.y != undefined) {
      emulator.x = event.x;
      emulator.y = event.y;
    } else { // Firefox method to get the position
      emulator.x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      emulator.y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }
    emulator.x -= canvas.offsetLeft;
    emulator.y -= canvas.offsetTop;
}

/** Shows the clock.
 */
function showClock(event) {
    var canvas = document.getElementById("canvas");
    if (!visible){
        var contents = document.getElementById("eventText");
        contents.innerHTML = "";
        emulator.toggleClock();
    }
}

/** Emulator object. Library style functions.
 */
var emulator = {
    x : NaN,
    y : NaN,
    startEmulator : function () {
        var canvas = document.getElementById("canvas");
        canvas.addEventListener("mousedown", getPosition);
        visible = (canvas.style.display != 'none');
        var eventDisplay = document.getElementById("eventDisplay");
        eventDisplay.addEventListener("mousedown", showClock);
        var ctx = canvas.getContext("2d");
        ctx.translate(160, 160);
        return ctx;
    },
    
    getRadius : function () {
        var radius = canvas.height / 2;
        radius = radius * 0.90;
        return radius;
    },
    getImageData : function () {
        return document.getElementById("canvas")
            .getContext("2d").getImageData(0, 0, 320, 320);
    },
    toggleClock : function() {
        var canvas = document.getElementById("canvas");
        var eventText = document.getElementById("eventText");
        if (visible) {
            canvas.style.display = 'none';
            eventText.style.display = 'block';
            visible = false;
        } else {
            canvas.style.display = 'block';
            eventText.style.display = 'none';
            visible = true;
        }
    },
    appendText : function(text) {
        var contents = document.getElementById("eventText");
        contents.innerHTML = contents.innerHTML + text;
    },
    fillArc : function (x, y, radius, start, finish, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, start, finish);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    },
    fillSect : function (x, y, radius, start, finish, colour) {
        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.arc(x, y, radius, start, finish);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.closePath();
    },
    createGradient : function(x, y, radius, x2, y2, radius2) {
        return ctx.createRadialGradient(x, y, radius, x2, y2, radius2);
    },
    drawGradient : function(grad, lineWidth) {
        ctx.strokeStyle = grad;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    },
    setupText : function(font, baseline, alignment) {
        ctx.font = font;
        ctx.textBaseline = baseline;
        ctx.textAlign = alignment;
    },
    rotate : function(angle) {
        ctx.rotate(angle);
    },
    translate : function(x, y) {
        ctx.translate(x, y);
    },
    fillText : function(text, x, y) {
        ctx.fillText(text, x, y);
    },
    drawLine : function(pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, 0 - length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
};
