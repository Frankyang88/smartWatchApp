/*
 Main function of middle_layer

 */

/*****************event listener*******************/
var middle_layer = (function () {

    //canvas settings
    var x, y, edge;
    var width, height;
    var left_top = {};
    var frame_size = {};
    var pub = {};
    var lastMouseDown = {x: null, y: null};// mouse position when click


    /******************emulator extension part*****************************/

    //calculate distance between two points, require google(network) support    
    pub.calcDistance = function (p1, p2) {
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
    };

    pub.wait = function (funct, time) {
        setTimeout(funct, time);
    };
    /********************get data set from middle_layer*******************/	
    pub.lefttop = function () {
        return left_top;
    };
    pub.framesize = function () {
        return frame_size;
    };
	
	pub.measureTextlen = function (message) {
        return ctx.measureText(message);
    };
	
    pub.clearScreen = function () {
          middle_layer.setup();
    };

    pub.drawbackImage = function (image) {
        var imageObj = new Image();
        imageObj.src = image;
        if (imageObj.complete) {
            ctx.drawImage(imageObj, left_top.x, left_top.y);
        } else {
            imageObj.onload = function () {
                ctx.drawImage(imageObj, left_top.x, left_top.y);
            };
        }
        //ctx.drawImage(imageObj,left_top.x, left_top.y);
        return imageObj;
    };
	
	/*************************************************************/

    var mouseaction;

    /*********middle_layer learns app infomation**********/
    pub.mouseeventtrigger = function (func) {
        mouseaction = func;

    };
	
    /********formating description************/
    pub.formatString = function (str, x, y) {
        var array = str.split("\n");
        for (var i = 0; i < array.length; i++) {
            pub.write(x, y, array[i], width - 50);
            y += 15;
        }
    };
   
    // return local storage,extension that help to save and get value from localstorage
    pub.getItem = function (src) {
        return localStorage.getItem(src);
    };
    pub.setItem = function (src, value) {
        localStorage.setItem(src, value);
    };


	/*important extension 
	in our app, we draw txt and buttons in different color 
	but in the new emulator, ctx has only one color setting that exist in button
	so we have to extend the fill style when draw menu*/
	pub.setstyle=function(color){
		ctx.fillStyle = color;
	}
	
	pub.drawbutton=function(x,y,radius,color){
		emulator.fillArc(x,y,radius,0,2*Math.PI,color);
	}
	
	
	/*emulator porting part*/
    function draw_inner_frame(x, y, width, height) {
     emulator.fillArc(200,200,115,0,2*Math.PI,'black');
    }

    function draw_watch_frame(x, y, width, height, edge) {
    	emulator.fillArc(200,200,120,0,2*Math.PI,'silver');
    }

	pub.draw = function (x, y, width, height, color) {
		emulator.fillArc(left_top.x + x+width/6, left_top.y + y+height/2,width/6,0,2*Math.PI,color);
		emulator.fillArc(left_top.x + x+width*2/6, left_top.y + y+height/2,width/6,0,2*Math.PI,color);
		emulator.fillArc(left_top.x + x+width*3/6, left_top.y + y+height/2,width/6,0,2*Math.PI,color);
		emulator.fillArc(left_top.x + x+width*4/6, left_top.y + y+height/2,width/6,0,2*Math.PI,color);
		emulator.fillArc(left_top.x + x+width*5/6, left_top.y + y+height/2,width/6,0,2*Math.PI,color);
    };

    pub.write = function (x, y, message, maxwidth) {
		middle_layer.setstyle('white');
		emulator.setupText('italic 10pt Calibri','alphabetic','start')
        emulator.fillText(message, left_top.x + x, left_top.y + y);
    };
	
    //draw text:universal method
    //
    pub.fillTxt = function (str, x, y) {
        emulator.setupText( str.font,str.baseline,str.position);
		emulator.fillText(str.data,x,y);
    };



    
    /**********initiate************************************/
    pub.setup = function () {
		
		ctx = emulator.startEmulator();
		
		/*watch frame, define the watch frame*/
        width = 200;
        height = 200;
        edge = 10;
        frame_size = {w: 160, h: 160};
        left_top = {x: 120, y: 120};
		
		var exit_button={x:105,y:200,r:15}
		var up_button={x:200,y:105,r:15}
		var down_button={x:200,y:295,r:15}
		var right_button={x:295,y:200,r:15}
		
		
		emulator.translate(-160,-160);
		
        draw_watch_frame(200, 200, width, height, edge);

        draw_inner_frame(200, 200, frame_size.w, frame_size.h);
		
		middle_layer.drawbutton(exit_button.x,exit_button.y,exit_button.r,'silver');
		middle_layer.drawbutton(up_button.x,up_button.y,up_button.r,'silver');
		middle_layer.drawbutton(down_button.x,down_button.y,down_button.r,'silver');
		middle_layer.drawbutton(right_button.x,right_button.y,right_button.r,'silver');
		
		setInterval(function(){
			var swipeleft=0;
			if((emulator.x-exit_button.x)*(emulator.x-exit_button.x)+
			  (emulator.y-exit_button.y)*(emulator.y-exit_button.y) <
			  exit_button.r*exit_button.r){
				swipeleft=1;
				}
			else swipeleft=0;
			
			if((emulator.x-up_button.x)*(emulator.x-up_button.x)+
			  (emulator.y-up_button.y)*(emulator.y-up_button.y) <
			  up_button.r*up_button.r){
				swipeup=1;
				}
			else swipeup=0;
			
			if((emulator.x-right_button.x)*(emulator.x-right_button.x)+
			  (emulator.y-right_button.y)*(emulator.y-right_button.y) <
			  right_button.r*right_button.r){
				swiperight=1;
				}
			else swiperight=0;
			
			if((emulator.x-down_button.x)*(emulator.x-down_button.x)+
			  (emulator.y-down_button.y)*(emulator.y-down_button.y) <
			  down_button.r*down_button.r){
				swipedown=1;
				}
			else swipedown=0;
			
			
			
			
			
			var mouseevent = {
            x: emulator.x - left_top.x,
            y: emulator.y - left_top.y,
			swipeup:swipeup,
			swipedown:swipedown,
			swipeleft:swipeleft,
			swiperight:swiperight,
			};
			
			if(emulator.x !=lastMouseDown.x && emulator.y != lastMouseDown.y){
			app.mousecallback(mouseevent);
			lastMouseDown.x=emulator.x;
			lastMouseDown.y=emulator.y;
			}
							  
							  },50);

    };
    return pub;
}());

$(document).ready(middle_layer.setup);
