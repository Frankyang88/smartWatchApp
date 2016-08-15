
var emulator = (function(){
  "use strict";
  var touchcoordinates = {
  x: 0,
  y: 0
  };


  //canvas settings
  var x,y,edge;
  var width, height;
  var can;
  var ctx;
  var left_top={};    
  var frame_size={};   
  var pub = {};
  var help={
            description:"Emulator built & designed by the Perfect Work Team ",
            watchSize:"The watch's size is 160*160 pixel. Shapes and objects drawn in this size should be able to fit in the emulator."
            };  

     
     
     /*****************event listener*******************/
    var canX = 0;
    var canY = 0;
    var mouseIsDown = 0;
    var Swipe_Down  = 0;
    var Swipe_Left  = 0;
    var Swipe_Up    = 0;
    var Swipe_Right = 0; 
    var lastMouseDown = {x: null, y: null};// mouse position when click
 

   
    //define mousedown functions
    //init Swipe ,record the position of mousedown
    function mousedown(event) {

        lastMouseDown.x = event.clientX;
        lastMouseDown.y = event.clientY;
        mouseIsDown = 1;        
        Swipe_Down = 0;
        Swipe_Left = 0;
        Swipe_Up = 0;
        Swipe_Right =0;  


    }
    //mouse up function
    //define operations on mouse event
    //Swipe left:exit current menu
    //Swipe Right: enter analog clock if the current page is start page
    //Swipe up or down: alter shown data if it is on page 3
    //Click: go to the next page
    //reset Swipe flag
    function mouseup(event) {
        var coordinates = {x: event.clientX,
                y: event.clientY};
	
	var mouseevent={
		swipeleft:Swipe_Left,
		swiperight:Swipe_Right,
		swipeup:Swipe_Up,
		swipedown:Swipe_Down,
	        x:coordinates.x-left_top.x,
                y:coordinates.y-left_top.y 
	};
	console.log(mouseevent);
	mouseaction(mouseevent);
        Swipe_Left=0;
        Swipe_Up=0;
        Swipe_Down=0;
    } 

    //mouse move event 
    //judge swipe event
    //
    function mouseXY(event) {
    if(mouseIsDown){
      canX = event.clientX - lastMouseDown.x;
      canY = event.clientY - lastMouseDown.y;}

    if (canX > 40) {
      Swipe_Right = 1;
    } else {
      Swipe_Right = 0;
    }

    if (canX < -40) {
      Swipe_Left = 1;
    } else {
      Swipe_Left = 0;
    }
    if (canY < -40) {
      Swipe_Up = 1;
    } else {
      Swipe_Up = 0;
    }
    if (canY > 40) {
      Swipe_Down = 1;
    } else {
      Swipe_Down = 0;
    }
    }


  
  
    /***************application related methods*********************/
    //calculate distance between two points, require google(network) support    
    pub.calcDistance = function(p1, p2) {      
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
    };
    
    pub.wait=function(funct,time){
		setTimeout(funct,time);
	}
    /********************get data set from emulator*******************/
    pub.coordinatesofEmulator = function(){
      var coordinates = {
        x : x,
        y : y
      };
      return coordinates;
    };

    pub.width = function(){

      return width;
    };

    pub.height = function(){
      return height;
    };
    pub.ctx=function(){
        return ctx;   
    };
    pub.can=function(){
        return can;
    };
    pub.lefttop=function(){
        return left_top;
    };
    pub.framesize=function(){
        return frame_size;
    };
    pub.help=function(){
        return help;
    };
    /***********register enent methods*********************/
    //register mouse down event methods on canvas
    //
    pub.addmousedownlistener=function(funct){

        can.addEventListener("mousedown", funct, false);
    };

    //
    //register mouseup event methods on canvas
    pub.addmouseuplistener=function(funct){

        can.addEventListener("mouseup", funct, false);
    };

    //register move event methods on canvas
    pub.addmousemovelistener=function(funct){

        can.addEventListener("mousemove", funct, false);
    };
    
    pub.addeventtrigger=function(object,eventname,method){
        object.addEventListener(eventname, method);
    
    };
        

    /******************canvas draw*****************************/
     pub.draw = function(x,y,width, height, color){
         
        ctx.fillStyle = color;  
        ctx.fillRect(left_top.x+x, left_top.y+y, width, height);
        ctx.stroke();
      };

      pub.write = function(x,y,message,maxwidth){
        ctx.font = 'italic 10pt Calibri';
        ctx.fillStyle='white';
        ctx.fillText(message, left_top.x+x, left_top.y+y,maxwidth);
      };
      
      pub.measureTextlen=function(message){
          return ctx.measureText(message);
      };
      pub.clearScreen= function(){
          ctx.clearRect(left_top.x,left_top.y,frame_size.w,frame_size.h);     
        //  emulator.setup();
       };
      
      pub.drawbackImage=function(image) {
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
    
      function draw_inner_frame(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.shadowBlur = 0;  
        ctx.rect(x - width / 2, y - height / 2, width, height);
        ctx.clearRect(x - width / 2, y - height / 2, width, height);
        ctx.fillStyle="grey";
        ctx.fill();  
        ctx.stroke();
      }

      function draw_watch_frame(ctx, x, y, width, height, edge) {
        ctx.beginPath();
        ctx.shadowBlur = 20;
        ctx.fillStyle='black';  
        ctx.shadowColor = "black";
        ctx.moveTo(x - width / 2 + edge, y - height / 2);
        ctx.lineTo(x + width / 2 - edge, y - height / 2);
        ctx.quadraticCurveTo(x + width / 2, y - height / 2, x + width / 2, y - height / 2 + edge);
        ctx.lineTo(x + width / 2, y + height / 2 - edge);
        ctx.quadraticCurveTo(x + width / 2, y + height / 2, x + width / 2 - edge, y + height / 2);
        ctx.lineTo(x - width / 2 + edge, y + height / 2);
        ctx.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height / 2 - edge);
        ctx.lineTo(x - width / 2, y - height / 2 + edge);
        ctx.quadraticCurveTo(x - width / 2, y - height / 2, x - width / 2 + edge, y - height / 2);
        ctx.stroke();
        ctx.fill();

      }
  



     pub.drawline=function(pos, length, width) { 
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0,0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        };


        //draw a circle
        //parameter:position,radius,color
      pub.drawcircle=function(x,y,radius,color) {
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, 2*Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.stroke();
        };

        //draw text:universal method
        //
      pub.fillTxt=function(string,x,y){      
          ctx.font = string.font;
          ctx.textBaseline=string.baseline;
          ctx.textAlign=string.position;
          ctx.fillStyle=string.style;
          ctx.fillText(string.data, x, y,string.maxwidth);
        };

        //rotateangle:rotate canvas 
      pub.rotateangle=function(ang){
            return ctx.rotate(ang);
        };

    
    /**************translate coordinate set***********/
        //transposition:
        // translate the position to another coordinates
        //
      pub.transposition=function(x,y){

            return ctx.translate(x,y);
        };
    
    
    
      //savestate:save the current state of coordinate info
      //
      pub.savestate=function(){
            return ctx.save();
        };

        //recoverstate
        //recover the state saved before transposition
        //
      pub.recoverstate=function(){

            return ctx.restore();
        };
    
    
    
    /******************document element operation**************/
      //create element with id and tag
      pub.create=function(node,class_id,id){
            var new_node=document.createElement(node);
            new_node.setAttribute('id',id);
            new_node.setAttribute('class',class_id);
            return new_node;
        };
      
      //create element with id and tag
      pub.creatediv=function(class_id,id){
            var new_node=document.createElement('div');
            new_node.setAttribute('id',id);
            new_node.setAttribute('class',class_id);
            return new_node;
        };
      pub.destroydivonClick=function(element_node,funct){
            emulator.addeventtrigger(element_node,'click', funct);
      };
      
      
      pub.appendtobody=function(node){
          return document.body.appendChild(node);
      };
      pub.appendtoparent=function(father,son){
          return father.appendChild(son);
      };
      pub.removebodyobject=function(id){
          var node=document.getElementById(id);
          document.body.removeChild(node);
      };
        //get element by ID
      pub.getEid=function(id){
                return document.getElementById(id);
        };
      pub.setbackcolor=function(node,color){
            node.style.backgroundColor=color;
      };
      pub.setcursor=function(node,cursor_type){
          node.style.cursor=cursor_type;
      };
      
      pub.setTxt=function(obj,color,fontsize,string){
            obj.style.color = color;
            obj.style.fontSize = fontsize;
            obj.innerHTML=string;
          
      };
       
      
  /***************************************************************/
//set css style wrapper
//
//
  /*************************************************************/
  pub.setelementZindex=function(elementid,Z) {
    var element=document.getElementById(elementid);
    return element.style.zIndex=Z;
  };
  pub.setelementleft=function(elementid,left) {
    var element=document.getElementById(elementid);
    return element.style.left=left;
  };
  pub.setelementtop=function(elementid,top) {
    var element=document.getElementById(elementid);
    return element.style.top=top;
  };
  pub.setelementwidth=function(elementid,width) {
    var element=document.getElementById(elementid);
    return element.style.width=width;
  };
  pub.setelementheight=function(elementid,height) {
    var element=document.getElementById(elementid);
    return element.style.height=height;
  };
  pub.setelementposition=function(elementid,absorrel) {
    var element=document.getElementById(elementid);
    return element.style.position=absorrel;
  };
  var 	mouseaction;		

  /*********emulator learns app infomation**********/
  pub.mouseeventtrigger=function(func){
	mouseaction=func;		
	
   };

   /********js import***********************************/
   function importJs(){
       var exist = [];
       var i = 0;
       var count = 0;
       //find and load any js file that is in the app folder
       $("body").append("<form>Please enter path to your js file: <br>For example: app/app.js <br>" +
           "<input type='text' name= '' class='enter' value='' id='jsPath'/>" +
           "<input type='button' value='import' id='buttonA' /></form>");
       $("#buttonA").click(function(){
           if(exist.length>0){
               for(i=0; i<exist.length; i+=1){
                   if($('#jsPath').val() === exist[i]){
                       count +=1;
                   }
               }
           }
           if(count===0){
               $('head').append("<script src='" + $('#jsPath').val() + "'></script>");
               exist.push($('#jsPath').val());
           }
           count =0;

       });
       $("form").submit(function() {
           if(exist.length>0){
               for(i=0; i<exist.length; i+=1){
                   if($('#jsPath').val() === exist[i]){
                       count +=1;
                   }
               }
           }
           if(count===0){
               $('head').append("<script src='" + $('#jsPath').val() + "'></script>");
               exist.push($('#jsPath').val());
           }
           count =0;
           return false;
       });


   }
  /**********initiate************************************/
  pub.setup = function() {
        x = 100;
        y = 100;
        width = 200;
        height = 200;
        edge = 10;
        frame_size={w:160,h:160};
        left_top={x:120,y:120};
        
        can = document.getElementById("emulator") ;
        ctx = can.getContext("2d");

        draw_watch_frame(ctx, 200, 200, width, height, edge);

        draw_inner_frame(ctx, 200, 200, frame_size.w, frame_size.h);
        //create();
        //
        emulator.addmousedownlistener(mousedown);
        emulator.addmouseuplistener(mouseup);
        emulator.addmousemovelistener(mouseXY);
        importJs();
    };
    return pub;
}());

$(document).ready(emulator.setup);
