/**
 * Created by Joseph on 11/14/16.
 */
var frames = 0;
var width, height;
var canvas;
var renderingContext;
var delta_background, delta_sprites;
var up = false,
    down = false,
    left = false,
    right = false;

var pillars = [];

function main(){
    windowSetup();
    canvasSetup();
    initHandlers();
    loadGraphics();
    delta_sprites = Date.now();
    delta_background = Date.now();
}
function Pillar(offset, image){
    this.offset = offset;
    this.position = 380;
    this.image = image;
    this.move = function(){
        this.position -= 5;
    };
    this.next = true;
    this.draw = function(renderingContext){
        image.draw(renderingContext, this.position, this.offset, "default","default");
        image.draw(renderingContext, this.position, this.offset+350, "default", "default");
    }
}
function loadGraphics(){
    loadImages(function(){
        initSprites();
        pillars[0] = new Pillar(-20, pillarimg);
        gameLoop();
    }, 0);
}
function gameLoop(){
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}
function initHandlers(){
    document.addEventListener("keypress", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}

function keyUpHandler(e){
    var keyUp = String.fromCharCode(e.keyCode);
    if(keyUp == "W"){
        up = false;
    }else if(keyUp == "A"){
        left = false;
    }else if(keyUp == "S"){
        down = false;
    }else if(keyUp == "D"){
        right = false;
    }
}
function keyDownHandler(e){
    var keyPressed = String.fromCharCode(e.keyCode);
    console.log(keyPressed);
    if(keyPressed == " "){
        if(!gamestart){
            gamestart = true;
        }

        velocity = -20
    }

}

function Raven(){

}
var velocity = 0;
var localy=0;
var gamestart = false;
function update(){
    if(delta_background < (Date.now()-20)){
        backx-=5;
        frontx-=2;
        delta_background = Date.now();
        if(gamestart){
            velocity+=2;
            if(pillars.length>0){
                for(var pillar in pillars){
                    if(pillars[pillar].position < 0){
                        delete pillars[pillar];
                    }else{
                        pillars[pillar].move();
                        if(pillars[pillar].position < 100 && pillars[pillar].next){
                            pillars[pillars.length] = new Pillar(Math.floor(Math.random()*-100), pillarimg);
                            pillars[pillar].next = false;
                        }
                    }

                }
            }


        }
        localy += velocity;
    }
    if(delta_sprites < (Date.now()-80)){
        frames += 1;
        delta_sprites = Date.now();
    }

    if(Math.abs(backx) > (cityBack.width)){
        backx=width+2;
    }

}
var backy = 0, backx = 0;
var fronty = 0, frontx = -1000;
function render(){
    renderingContext.clearRect(0, 0, 380, 430);
    cityFront.draw(renderingContext, frontx, fronty-70, cityFront.calcWidth(500), 500);
    cityFront.draw(renderingContext, frontx+cityFront.calcWidth(500), fronty-70, cityFront.calcWidth(500), 500);
    cityBack.draw(renderingContext, backx, backy-500, cityBack.calcWidth(1000),1000);
    for(var pillar in pillars){
        pillars[pillar].draw(renderingContext);
    }

    raven[frames%3].draw(renderingContext, 100, 200+localy, 60, 50);
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
}