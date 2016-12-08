/**
 * Created by Joseph on 11/14/16.
 */
var frames = 0;
var width, height;
var canvas;
var renderingContext;
var delta, delta_sprites;
var pillars = [];
var score = 0;
var scoreimg = [];
var highscoreimg = [];
var pillargap = 200, pillarheight = 191;
var raven;
var background1, background2, foreground;
function main(){
    windowSetup();
    canvasSetup();
    initHandlers();
    loadGraphics();
    delta_sprites = Date.now();
    delta = Date.now();
}

function Pillar(offset, image, gap){
    this.gap = gap;
    this.offset = offset;
    this.position = 380;
    this.image = image;
    this.scored = false;
    this.move = function(){
        this.position += game_speed;
    };
    this.topbottom = this.offset+pillarheight+pillargap;
    this.next = true;
    this.draw = function(renderingContext){
        image.draw(renderingContext, this.position, this.offset, "default","default");
        image.draw(renderingContext, this.position, this.offset+pillarheight+this.gap, "default", "default");
    }
}
function loadGraphics(){

    loadImages(function(){
        initSprites();
        raven = new Raven();
        background1 = new Background(0, cityBack.calcWidth(500), cityBack);
        background2 = new Background(cityBack.calcWidth(500), cityBack.calcWidth(500), cityBack);
        foreground = new Background(0, cityFront.calcWidth(1000), cityFront);

        gameLoop();
    }, 0);
}
function randomPillarOffset(){
    return Math.floor(Math.random()*-100);
}

function gameLoop(){
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}
function initHandlers(){
    document.addEventListener("keypress", keyDownHandler, false);
    canvas.addEventListener('click', clickHandler, false);
}
function keyDownHandler(e){
    var keyPressed = String.fromCharCode(e.keyCode);
    if(keyPressed == " "){
        if(!gamestart){
            gamestart = true;
        }
        if(!gamefail){
            raven.resetVelocity(-20);
        }
    }
}
function clickHandler(e){
    console.log("clicked");
    if(!gamestart){
        gamestart = true;
    }
    if(!gamefail){
        raven.resetVelocity(-20);
    }
    console.log(e.offsetX);
    console.log(e.offsetY);
    if( gamefail && e.offsetY < 340 && e.offsetY> 260 && e.offsetX > 90 && e.offsetX < 290 ){
        console.log("failed and clicked");
        restart();
    }
}
function Raven(){
    this.col = 100;
    this.position = 200;
    this.velocity = 0;
    this.sprite = ravenimages;
    this.velot = function(x){
        this.velocity+=x;
    };
    this.resetVelocity = function (x) {
        this.velocity = x;
    };
    this.move = function(){
        this.position += this.velocity;
    };
    this.detectCollisions = function(pillar){
        if(pillar.position > this.col-30 && pillar.position < this.col+50 && (this.position < pillar.offset+191 || this.position > pillar.offset+pillarheight+pillar.gap-30)){
            return true;
        }

    }
}

function checkFail(){
    if( (raven.position>430 || raven.position<0)){
        gamefail = true;
        raven.resetVelocity(5);
    }
    for(var pillar in pillars){
        if(raven.detectCollisions(pillars[pillar])) {
            gamefail = true;
        }
    }


}
var gamestart = false;
var gamefail = false;
function Background(position, width, image){
    this.position = position;
    this.width = width;
    this.image = image;
    this.move = function (n) {
        this.position += n;
    };
    this.reset = function (n) {
        this.position = n;
    }
}
var back_speed = -2;
var game_speed = -5;

function update(){
    if(delta < (Date.now()-20)){
        if(!gamestart){
            raven.position += Math.cos(frames);
            highscoreimg = [];
        }
        if(!gamefail){
            if(background1.position < -background1.width){
                background1.reset(background2.width);
            }
            if(background2.position < -background2.width){
                background2.reset(background1.width);
            }
            background1.move(back_speed);
            background2.move(back_speed);
            if(foreground.position < -foreground.width){
                foreground.reset(380);
            }
            foreground.move(game_speed);

        }
        if(gamestart && !gamefail){
            raven.velot(2);
            if(pillars.length>0){
                for(var pillar in pillars){
                    pillars[pillar].move();
                    if(pillars[pillar].position < raven.col-pillars[pillar].image.width && !pillars[pillar].scored){
                        scoreimg = [];
                        score ++;
                        console.log(localStorage.getItem("highscore"));
                        var scorest = String(score).split("");
                        console.log(scorest);
                        for(var x in scorest){
                            scoreimg[scoreimg.length] = numbers[Number(scorest[x])];
                        }
                        pillars[pillar].scored = true;
                        if(score%10 == 0){
                            game_speed -= 2;
                            back_speed --;
                            pillargap -= 5;
                        }
                    }else{
                        if(pillars[pillar].position < 100 && pillars[pillar].next){
                            pillars[pillars.length] = new Pillar(randomPillarOffset(), pillarimg, pillargap);
                            pillars[pillar].next = false;
                        }
                    }

                    if(pillars[pillar].position < -32){
                        delete pillars[pillar];
                    }

                }
            }else{
                pillars[0] = new Pillar(randomPillarOffset(), pillarimg, pillargap);
                console.log(pillargap);
            }


        }
        raven.move();
        delta = Date.now();
    }

    if(delta_sprites < (Date.now()-80)){
        frames += 1;
        delta_sprites = Date.now();
    }

    if(Math.abs(backx) > (cityBack.width)){
        backx=width+2;
    }
    checkFail();
    if(gamefail){
        raven.velocity+=2;
        if(score>localStorage.getItem("highscore")){
            localStorage.setItem("highscore", score);
        }
        highscoreimg=[];
        var highscore = String(localStorage.getItem("highscore")).split("");
        console.log(highscore);
        for(var t in highscore){
            console.log(t);
            highscoreimg[highscoreimg.length] = numbers[Number(highscore[t])];
        }
    }
}
function render(){

    renderingContext.clearRect(0, 0, 380, 430);
    background1.image.draw(renderingContext, background1.position, 0, background1.image.calcWidth(500), 500);
    background2.image.draw(renderingContext, background2.position, 0, background2.image.calcWidth(500), 500);
    foreground.image.draw(renderingContext, foreground.position, -500, foreground.image.calcWidth(1000),1000);

    for(var pillar in pillars){
        pillars[pillar].draw(renderingContext);
    }
    if(!gamefail){
        ravenimages[frames%4].draw(renderingContext, raven.col, raven.position, 50, 50);
    }else{
        ravenimages[3].draw(renderingContext, raven.col, raven.position, 50, 50);
    }
    if(scoreimg.length > 0){
        var length = 0;
        for(var x in scoreimg){
            length += scoreimg[x].width;
        }
        var gone = 0;
        for(var i in scoreimg){
            scoreimg[i].draw(renderingContext, 190-(length/2)+gone, 50, "default", "default");
            gone += scoreimg[i].width;
        }
    }
    if(gamefail){
        restartImg.draw(renderingContext, 90, 300, "default", "default");
        high.draw(renderingContext, -30, 100, "default", "default");
        if(highscoreimg.length > 0){
            length = 0;
            for(x in highscoreimg){
                length += highscoreimg[x].width;
            }
            gone = 0;
            for(i in highscoreimg){
                highscoreimg[i].draw(renderingContext, 190-(length/2)+gone, 150, "default", "default");
                gone += highscoreimg[i].width;
            }
        }
    }

}
var backy = 0, backx = 0;
var fronty = 0, frontx = -1000;
function restart(){
    frames = 0;
    gamestart = false;
    gamefail = false;
    pillars = [];
    scoreimg = [];
    score = 0;
    raven.position = 200;
    raven.velocity = 0;
    game_speed = -5;
    back_speed = -2;
}
function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    if(width >= 500){
        width = 380;
        height = 430;
    }
}
function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.style.border = "15px black solid";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    var text = document.createElement("p");
    text.innerHTML = "<p>Press Space, or Click to play</p><p>Art by Revangale, Alucard and tebruno99 on <a href = 'https://opengameart.org'>Open Game Art</a></p>";
    document.body.appendChild(text);
}