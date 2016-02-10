 
var level = 0;
// running = 0 when the game is running, running = 1 when the game is not running
var running = 0;
// paused = 1 when the game is not paused, paused = 0 when the game is paused
var paused = 1;
var time;
// highscore of level 1
var highScore1 = 0;
// highscore of level 2
var highScore2 = 0;
var curScore = 0;
var numOfFood = 5;

// helper function for getting the element by its id
function getId(x) {
    return document.getElementById(x);
}
// helper function for not hiding the element
function hide(x) {
    x.style.display = "none";
}
// helper function for showing the element
function show(x) {
    x.style.display = "block";
}
// helper function for showing a list element
function showLi(x) {
    x.style.display = "list-item";
}
// set up the elements
var gamepage = getId("gamepage");
var level11 = getId("level11");
var level22 = getId("level22");
var level1 = getId("level1");
var level2 = getId("level2");
var startpage = getId("startpage");
var start = getId("start");
var endpage = getId("endpage");
var highScore = getId("highscore");
var restart = getId("restart");
var exit = getId("exit");
var score = getId("score");
var displayTime = getId("displayTime");
var endscore = getId("endscore");
hide(endpage);
hide(gamepage);
hide(level11);
hide(level22);
hide(resume);

// level 1 is selected    
level1.onclick = function () {
    hide(level1);
    showLi(level11);
    hide(level22);
    showLi(level2);
    level = 1;
    
    highScore.innerHTML = highScore1;
    show(highScore);
};
// level 2 is selected
level2.onclick = function () {
    hide(level2);
    showLi(level22);
    hide(level11);
    showLi(level1);
    level = 2;
    
    highScore.innerHTML = highScore2;
    show(highScore);
};

start.onclick = function () {
    // must select a level to start
    if (level !== 0) {
        hide(startpage);
        show(gamepage);
        time = 60;
        running = 0;
        paused = 1;
        numOfFood = 5;
        displayTime.innerHTML = time;
        timer();
        generateFood();
        makeNewBugs();
        moveBug();
        fadeOut();
    }
};

pause.onclick = function () {
    show(resume);
    hide(pause);
    paused = 0;
};

resume.onclick = function () {
    show(pause);
    hide(resume);
    paused = 1;
    timer();
    makeNewBugs();
    moveBug();
    fadeOut();
};



// set up the canvas
var canvas = getId("gamecanvas");
var ctx = canvas.getContext("2d");
// fill the text
ctx.font = "20px Arial";
ctx.fillText("sec", 40, 25);
ctx.fillText("Score:", 280, 25);
// draw a line
ctx.moveTo(0, 35);
ctx.lineTo(400, 35);
ctx.stroke();



// randomly generate the location of the food
function generateFood() {
    var i,
    x,
    y,
    idx;
    // xarray stores all the x coordinates of the foods
    xarray = [];
    // yarray stores all the y coordinates of the foods
    yarray = [];

    // draw food five times
    for (i = 0; i <= 4; i++) {
        // generate the location of the food randomly
        x = randomLocationX();
        y = randomLocationY();
        // making sure foods don't have the same coordinates (don't overlap)
        for (idx = 0; idx < xarray.length; idx++) {
            if (xarray[idx] == x) {
                x = randomLocationX();
            }
        }
        xarray.push(x);
        for (idx = 0; idx < yarray.length; idx++) {
            if (yarray[idx] == y) {
                y = randomLocationY();
            }
        }
        yarray.push(y);
    }
}

function drawFood() {
    // draw the food
    var i;
    for (i = 0; i < xarray.length; i++) {
        ctx.beginPath();
        ctx.arc(xarray[i], yarray[i], 9.5, 0, Math.PI * 2);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.fillStyle = "blue";
        ctx.fill();
    }
}

// timer
var timeInterval;

function timer() {
    window.clearTimeout(timeInterval);
    // paused = 1 when the game is not paused, paused = 0 when the game is paused
    if (time > 0 && running === 0 && paused == 1) {
        timeInterval = setTimeout(function () {
            if (paused === 0) {
                displayTime.innerHTML = time;
            } else {
                time--;
                displayTime.innerHTML = time;
                timer();
            }
        }, 1000);
    } else if (time === 0) {
        displayTime.innerHTML = 0;
        running = 1;
        gameOver();
    }
}

// generate a random Y coordinate
function randomLocationY() {
    var x = Math.floor((Math.random() * 200) + 200);
    return x;
}

// an array that stores all the bug object
var bugs = [];

bugsObject.prototype.update = function () {
    var i;
    var smallest = 1000;
    var closestFood = 0;
    // find the nearest food to the bug
    for (i = 0; i < xarray.length; i++) {
        var a = this.x - xarray[i];
        var b = yarray[i] - 50;
        var c = Math.sqrt(a * a + b * b);
        if (smallest > c) {
            smallest = c;
            closestFood = i;
        }
    }
    var Angle = Math.atan2(yarray[closestFood] - this.y, xarray[closestFood] - this.x);
    var Sin = Math.sin(Angle);
    var Cos = Math.cos(Angle);

    // adjust the coordinates of the bug according to its speed
    if (level == 1) {
        if (this.r === 0 && this.g === 0 && this.b === 0) {
            // speed = 150;
            this.x += Cos * 1.5;
            this.y += Sin * 1.5;
        } else if (this.r === 255 && this.g === 0 && this.b === 0) {
            //speed = 75;
            this.x += Cos * 0.75;
            this.y += Sin * 0.75;
        } else if (this.r === 255 && this.g === 165 && this.b === 0) {
            //speed = 60;
            this.x += Cos * 0.6;
            this.y += Sin * 0.6;
        }

    } else if (level == 2) {
        if (this.r === 0 && this.g === 0 && this.b === 0) {
            //speed = 200;
            this.x += Cos * 2;
            this.y += Sin * 2;
        } else if (this.r === 255 && this.g === 0 && this.b === 0) {
            //speed = 100;
            this.x += Cos;
            this.y += Sin;
        } else if (this.r === 255 && this.g === 165 && this.b === 0) {
            //speed = 80;
            this.x += Cos * 0.8;
            this.y += Sin * 0.8;
        }
    }
};


// remove the food when a bug reaches it
bugsObject.prototype.removeFood = function () {
    for (e = 0; e < xarray.length; e++) {
        for (r = 0; r < yarray.length; r++) {
            if (e == r) {
                if ((xarray[e] == Math.round(this.x)) && (yarray[r] == Math.round(this.y))) {
                    numOfFood--;
                    // remove the food coordinates from the arrays
                    xarray.splice(e, 1);
                    yarray.splice(r, 1);
                }
            }
        }
    }
};

// the following code used http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas as a reference
// draw the bug
bugsObject.prototype.draw = function () {
    // the head of the bug (circle)
    ctx.beginPath();
    ctx.arc(this.x + 5, this.y - 5, 4.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgb(' + (this.r - 255) + ',' + (this.g - 255) + ',' + (this.b - 255) + ')';
    ctx.stroke();
    ctx.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    ctx.fill();
    // the body of the bug (eclipse)
    var kappa = 0.5522848,
        ox = (10 / 2) * kappa, // control point offset horizontal
        oy = (20 / 2) * kappa, // control point offset vertical
        xe = this.x + 10, // x-end
        ye = this.y + 20, // y-end
        xm = this.x + 10 / 2, // x-middle
        ym = this.y + 20 / 2; // y-middle
    ctx.beginPath();
    ctx.moveTo(this.x, ym);
    ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
    ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
    ctx.stroke();
    ctx.fill();
};


// define the bug as an object
// r, g, b are red, green, and blue that make up the colour
function bugsObject(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
}

// move the bugs towards the food
function moveBug() {
    if ((paused == 1) && (time > 0) && (running === 0)) {
        ctx.clearRect(0, 35, 400, 600);
        drawFood();
        for (var i = 0; i < bugs.length; i++) {
            bugs[i].update();
            bugs[i].draw();
            bugs[i].removeFood();
        }
        // ends the game when all the food has been eaten
        if (numOfFood === 0) {
            gameOver();
        }
        requestAnimationFrame(moveBug);
    }

}

// fade array stores all the bugs that need to be faded out
fade = [];
// remove the bug object from the bugs array list when it has been tapped
function removeBugs() {
    for (var i = 0; i < bugs.length; i++) {
        if ((pair[0] <= (Math.round(bugs[i].x) + 30)) && (pair[0] >= (Math.round(bugs[i].x) - 30)) && (pair[1] <= (Math.round(bugs[i].y) + 30)) && (pair[1] >= (Math.round(bugs[i].y) - 30))) {
            d = fade.length;
            var newbug = new bugsObject(bugs[i].x, bugs[i].y, bugs[i].r, bugs[i].g, bugs[i].b);
            fade[d] = newbug;
            updateScore(i);
            // remove the bug from the bugs array
            bugs.splice(i, 1);
        }
    }
}

function fadeOut() {
    if ((paused == 1) && (time > 0) && (running === 0)) {
        for (var i = 0; i < fade.length; i++) {
            if (fade[i].r < 255 || fade[i].g < 255 || fade[i].b < 255) {
                fade[i].r += 3;
                fade[i].g += 3;
                fade[i].b += 3;
                fade[i].draw();
            } else {
                fade.splice(i, 1);
                pair = [0, 0];
            }
        }
        requestAnimationFrame(fadeOut);
    }
}

// update the current score according to its colour
function updateScore(i) {
    // black
    if (bugs[i].r === 0 && bugs[i].g === 0 && bugs[i].b === 0) {
        curScore += 5;
        // red
    } else if (bugs[i].r == 255 && bugs[i].g === 0 && bugs[i].b === 0) {
        curScore += 3;
        // orange
    } else {
        curScore += 1;
    }
    score.innerHTML = curScore;
}

// randomly generate new bugs
var bugInterval;
var i;
var c;

function makeNewBugs() {
    window.clearTimeout(bugInterval);
    if (running === 0 && paused == 1) {
        bugInterval = setTimeout(function () {
            var x = randomLocationX();
            var colour = randomColour();
            // create a new bug object
            if (colour == "red") {
                c = new bugsObject(x, 50, 255, 0, 0);
            } else if (colour == "black") {
                c = new bugsObject(x, 50, 0, 0, 0);
            } else {
                // orange
                c = new bugsObject(x, 50, 255, 165, 0);
            }
            i = bugs.length;
            // append the new bug object to the bugs array
            bugs[i] = c;
            makeNewBugs();
        }, randomTime());
    }

}

// time of next bug entry (1, 2, or 3 seconds)
function randomTime() {
    var y = Math.floor((Math.random() * 3) + 1);
    return y * 1000;
}

// generate a random colour for the bugs
function randomColour() {
    // 1 is red, 2 is black, 3 is orange
    var numbers = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3];
    var i = Math.floor(Math.random() * numbers.length);
    if (numbers[i] == 1) {
        return "red";
    } else if (numbers[i] == 2) {
        return "black";
    } else {
        return "orange";
    }
}

// randomly generates a x coordinate
function randomLocationX() {
    var x = Math.floor((Math.random() * 390) + 10);
    return x;
}

// display the end page when the game is over
function gameOver() {
   // update the highest score
    if (level == 1) {
        if (curScore > highScore1) {
            highScore1 = curScore;
        }
    } else if (level == 2) {
        if (curScore > highScore2) {
            highScore2 = curScore;
        }
    } 
    endscore.innerHTML = curScore;

    hide(gamepage);
    show(endpage);
}       

restart.onclick = function () {
    hide(endpage);
    show(gamepage);
    running = 0;
    paused = 1;
    // reset the time and number of food
    numOfFood = 5;
    time = 60;
    displayTime.innerHTML = time;
    timer();
    generateFood();
    makeNewBugs();
    moveBug();
    // reset the current score
    curScore = 0;
    score.innerHTML = 0;
    fadeOut();
};

exit.onclick = function () {
    hide(endpage);
    show(startpage);
    running = 1;
    paused = 1;
    hide(level11);
    hide(level22);
    showLi(level1);
    showLi(level2);
    hide(highScore);
    displayTime.innerHTML = time;
    // reset the level
    level = 0;
    // reset the current score
    curScore = 0;
    score.innerHTML = 0;
};

// trigger the event when there's a mouse click
canvas.addEventListener("mousedown", getCoords, false);

// pair array stores the coordinates of the mouse click
var pair = [0, 0];

function getCoords(event) {
    if (paused == 1 && running === 0 && time > 0) {
        var x = event.clientX;
        var y = event.clientY;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        pair[0] = x;
        pair[1] = y;
        removeBugs();
    }
}
