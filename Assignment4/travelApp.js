/*
Main function of travel app
Created by: Travel app team (Ana, Junyu, Frank, Alycia)
Office: Lab B
Office hours: 10am-3pm
Bring a pizza if service is needed during lunch time.
*/

var app = (function () {


    "use strict";
    var keyword = "";

    var radius;

    var pub = {};

    var display = [];

    var pageNum;
    var rad = 80;
    var clock_run;
    var map;
    var infoWindow;
    var service;

    //********************app to middle_layer interaface****************************//
    pub.mousecallback = function (mouseevent) {
        var coordinates = {x: mouseevent.x, y: mouseevent.y};
        if (mouseevent.swipeleft) {
            exit_menu();
        }
        else if ((mouseevent.swipeup || mouseevent.swipedown ) && pageNum === 3)
            update_thirdPage(mouseevent.swipedown, mouseevent.swipeup);
        else if (mouseevent.swiperight && pageNum === 4) {
            disVoucher(display, parseInt(middle_layer.getItem("result_index")));
        } else if (mouseevent.swipedown && pageNum === 4) {
            sixthPage(display, parseInt(middle_layer.getItem("result_index")));
        }
        else {
            hastouchcoordinates(coordinates);
        }

    };

    /********************menu changes operation*************************/
    //exit menu: 
    //    page4->page3->page2->page1
    //    page99->page1
    //    the order is reversed to the sequence of entering a new menu
    //    page99 is special as it contains a analog clock that translate coordinates
    //    and the clock is always running. So stop it firstly and recover states.   
    function exit_menu() {
        if (pageNum == 1)
            start();
        else if (pageNum == 2)
            firstPage();
        else if (pageNum == 3)
            secondPage();
        else if (pageNum == 4) {
            thirdPage(display, parseInt(middle_layer.getItem("result_index")));
        } else if (pageNum == 5) {
            forthPage(display, parseInt(middle_layer.getItem("result_index")));
        } else if (pageNum == 6) {
            forthPage(display, parseInt(middle_layer.getItem("result_index")));
        }
		
    }


    // has touchcoordinates:
    //click event handler: based on the current pages,decide the next page and data collected from ui
    //
    //

    function hastouchcoordinates(touchcoordinates) {

        var width = 120;
        var height = 35;

        if (pageNum == 0) {
            if (touchcoordinates.y < 160 &&
                touchcoordinates.y >= 0
                && touchcoordinates.x >= 0
                && touchcoordinates.x < 160)
                firstPage();
        }
        else if (pageNum == 1) {
            if (touchcoordinates.y <= 30 + height
                && touchcoordinates.y >= 30
                && touchcoordinates.x > 20
                && touchcoordinates.x < 20 + width) {
                keyword = "ac";
                secondPage();
            }
            else if (touchcoordinates.y <= 70 + height
                && touchcoordinates.y >= 70
                && touchcoordinates.x > 20
                && touchcoordinates.x < 20 + width) {
                keyword = "pu";
                secondPage();
            }
            else if (touchcoordinates.y <= 110 + height
                && touchcoordinates.y >= 110
                && touchcoordinates.x > 20
                && touchcoordinates.x < 20 + width) {
                keyword = "en";
                secondPage();
            }
        }
        else if (pageNum == 2) {
            if (touchcoordinates.y <= 30 + height
                && touchcoordinates.y >= 30
                && touchcoordinates.x > 20
                && touchcoordinates.x < 20 + width) {
                radius = 1000;
                thirdPage(secondOptions(), 0);
                //  middle_layer.getLocation(wrap);
            }
            else if (touchcoordinates.y <= 70 + height
                && touchcoordinates.y >= 70
                && touchcoordinates.x > 20
                && touchcoordinates.x < 20 + width) {
                radius = 5000;
                thirdPage(secondOptions(), 0);
                //middle_layer.getLocation(wrap);
            }
            else if (touchcoordinates.y <= 110 + height
                && touchcoordinates.y >= 110
                && touchcoordinates.x > 20
                && touchcoordinates.x < width + 20) {
                radius = 20000;
                thirdPage(secondOptions(), 0);
                //middle_layer.getLocation(wrap);
            }
        }
        else if (pageNum == 3) {
            var i = parseInt(middle_layer.getItem("result_index"));
            if (touchcoordinates.y < height + 70 &&
                touchcoordinates.y >= 70
                && touchcoordinates.x > 20
                && touchcoordinates.x < width + 20)
                forthPage(display, i);
        }

    }

    /************************show menu*************************************/

    //The first page
    function firstPage() {

        pageNum = 1;
        var menu = {
            width: 120,
            height: 35,
            message1: "Accommodation",
            message2: "Entertainment & Fun",
            message3: "Restaurants & Bars",
            color: "black"
        };
        middle_layer.clearScreen();
        middle_layer.drawbackImage('images/travel.jpg');
        middle_layer.draw(20, 30, menu.width, menu.height, menu.color);
        middle_layer.draw(20, 70, menu.width, menu.height, menu.color);
        middle_layer.draw(20, 110, menu.width, menu.height, menu.color);
        writemessage(20, 50, menu.message1, menu.width);
        writemessage(20, 90, menu.message2, menu.width);
        writemessage(20, 130, menu.message3, menu.width);
    }

    //The second page shows the radius.
    function secondPage() {


        pageNum = 2;
        var menu = {
            width: 120,
            height: 35,
            message1: "1km",
            message2: "5km",
            message3: "20km",
            color: "black"
        };
        middle_layer.clearScreen();
        middle_layer.drawbackImage('images/travel.jpg');
        middle_layer.draw(20, 30, menu.width, menu.height, menu.color);
        middle_layer.draw(20, 70, menu.width, menu.height, menu.color);
        middle_layer.draw(20, 110, menu.width, menu.height, menu.color);
        writemessage(20, 50, menu.message1, menu.width);
        writemessage(20, 90, menu.message2, menu.width);
        writemessage(20, 130, menu.message3, menu.width);
    }

    //the third page
    //in third page:there are a list of objects, but only one of them , with index i, is shown here
    // save the index of current objects in display
    //
    function thirdPage(data, i) {

        pageNum = 3;
        i = parseInt(i);
        var menu = {
            width: 120,
            height: 35,
            message: data[i].name,
            color: "black"
        };
        middle_layer.clearScreen();
        middle_layer.drawbackImage('images/travel.jpg');

        middle_layer.draw(20, 70, menu.width, menu.height, menu.color);
        writemessage(20, 90, menu.message, menu.width);
        middle_layer.setItem("result_index", i);

    }

    // the third page
    // if some one swipe up or down, the data on third page should be updated
    // swipe up: show the previous item
    // swipe down:show the next item
    function update_thirdPage(Down, Up) {
        var i = parseInt(middle_layer.getItem("result_index"));
        if (pageNum == 3) {
            if (Up && i > 0) {
                thirdPage(display, i - 1);
            }

            if (Down && i < display.length - 1) {
                thirdPage(display, i + 1);
            }
        }
    }

    //fourthPage:
    //show the detail of a specific item
    // name and address
    //specify a limited length in case of the length of string exceed the length of txt box
    // the message format is still unsolved  
    function forthPage(data, i) {

        pageNum = 4;


        middle_layer.clearScreen();
        middle_layer.wait(middle_layer.drawbackImage(data[i].images), 200);


    }


    function disVoucher(data, i) {
        middle_layer.clearScreen();
        if (keyword === "ac") {
            middle_layer.drawbackImage("images/ac.jpg")
        } else if (keyword === "pu") {
            middle_layer.drawbackImage("images/en.jpg");
        } else {
            middle_layer.drawbackImage("images/rest.jpg");
        }
        pageNum = 5;

        //middle_layer.drawbackImage(data[i].images);
        var message = Math.floor((Math.random() * 50) + 1) + " % OFF";

        middle_layer.wait(writemessage(0, 80, message, 160), 200);


    }

    function sixthPage(data, i) {
        pageNum = 6;
        var menu = {
            width: 120,
            height: 35,
            message1: "1km",
            message2: "5km",
            message3: "20km",
            color: "#575757"
        };
        middle_layer.clearScreen();


        middle_layer.clearScreen();
        middle_layer.draw(0, 0, 160, 160, "black");
        middle_layer.formatString(display[i].description, 0, 10);
    }

    function writemessage(x, y, message, maxwidth) {

        var len = middle_layer.measureTextlen(message);

        if (len.width < 120) {
            middle_layer.write(x + (maxwidth - len.width) / 2, y, message, maxwidth);
        }
        else middle_layer.write(x, y, message, maxwidth);
    }


    /********************database********************************/

    
    //no gps location service so hardcode the position
	//
    function secondOptions() {
        var match = keyword;
        display = [];
        var src =  new google.maps.LatLng(-45.866815599999995,170.5178656);
        var count = 0;
        var dst;
        var i;
        switch (match) {
            case "ac" :
                for (i = 0; i < ac.length; i += 1) {
                    dst = new google.maps.LatLng(parseFloat(ac[i].location.lat), parseFloat(ac[i].location.long));
                    if (parseFloat(middle_layer.calcDistance(src, dst)) <= parseFloat(radius / 1000)) {
                        display[count] = ac[i];
                        count += 1;
                    }

                }
                break;
            case "pu" :
                for (i = 0; i < pu.length; i += 1) {

                    dst = new google.maps.LatLng(parseFloat(pu[i].location.lat), parseFloat(pu[i].location.long));
                    if (parseFloat(middle_layer.calcDistance(src, dst)) <= parseFloat(radius / 1000)) {

                        display[count] = pu[i];
                        count += 1;
                    }

                }
                break;
            case "en" :
                for (i = 0; i < en.length; i += 1) {
                    dst = new google.maps.LatLng(parseFloat(en[i].location.lat), parseFloat(en[i].location.long));
                    if (parseFloat(middle_layer.calcDistance(src, dst)) <= parseFloat(radius / 1000)) {
                        display[count] = en[i];
                        count += 1;
                    }
                }
                break;
        }
        
        return display;
        //thirdPage(display,0);

    };



    /**********initiate********************/
    // start the app with three main category selections.
    //layout1 : the first button on left top, the following in horizontal center
    // the middle_layer specifies the x and y position.

    // show the first screen 
    function start() {
        pageNum = 0;

        var menu = {
            width: 120,
            height: 35,
            message: "Enter",
            color: "black"
        };

        middle_layer.wait(function () {
            middle_layer.drawbackImage('images/travel.jpg');
            middle_layer.draw(20, 70, menu.width, menu.height, menu.color);
            writemessage(20, 90, menu.message, menu.width);
        }, 1000);

    }

    function loadImg() {
        var i, j;
        var db = [ac, pu, en];
        middle_layer.drawbackImage("images/ac.jpg");
        middle_layer.drawbackImage("images/en.jpg");
        middle_layer.drawbackImage("images/rest.jpg");
        for (i = 0; i < db.length; i++) {
            for (j = 0; j < db[i].length; j++) {
                if (db[i][j].images != null) {
                    middle_layer.drawbackImage(db[i][j].images);
                }
            }
        }

        middle_layer.drawbackImage('images/travel.jpg');




    }

    pub.setup = function () {
        middle_layer.mouseeventtrigger(app.mousecallback);
        loadImg();

        start();


    };
    return pub;
}());

$(document).ready(app.setup);


