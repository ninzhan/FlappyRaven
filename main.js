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
var pillargap = 175, pillarheight = 191;
var raven;
function main(){
    windowSetup();
    canvasSetup();
    initHandlers();
    loadGraphics();
    delta_sprites = Date.now();
    delta = Date.now();
}

function Pillar(offset, image){
    this.offset = offset;
    this.position = 380;
    this.image = image;
    this.move = function(){
        this.position -= 5;
    };
    this.topbottom = this.offset+pillarheight+pillargap;
    this.next = true;
    this.draw = function(renderingContext){
        image.draw(renderingContext, this.position, this.offset, "default","default");
        image.draw(renderingContext, this.position, this.offset+pillarheight+pillargap, "default", "default");
    }
}

function loadGraphics(){
    loadImages(function(){
        initSprites();
        pillars[0]= new Pillar(randomPillarOffset(), pillarimg);
        raven = new Raven();
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
        if(pillar.position > this.col-30 && pillar.position < this.col+50 && (this.position < pillar.offset+191 || this.position > pillar.offset+pillarheight+pillargap-30)){
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
function update(){
    if(delta < (Date.now()-20)){
        if(!gamestart){
            raven.position += Math.cos(frames);
        }
        if(!gamefail){
            backx-=5;
            frontx-=2;
            delta = Date.now();
        }
        if(gamestart && !gamefail){
            raven.velot(2);
            if(pillars.length>0){
                for(var pillar in pillars){
                    if(pillars[pillar].position < -32){
                        scoreimg = [];
                        delete pillars[pillar];
                        score ++;
                        var scorest = String(score).split("");
                        console.log(scorest);
                        for(var x in scorest){
                            scoreimg[scoreimg.length] = numbers[Number(scorest[x])];
                        }
                    }else{
                        pillars[pillar].move();
                        if(pillars[pillar].position < 100 && pillars[pillar].next){
                            pillars[pillars.length] = new Pillar(randomPillarOffset(), pillarimg);
                            pillars[pillar].next = false;
                        }
                    }

                }
            }


        }
        raven.move();
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
    pillars[0]= new Pillar(randomPillarOffset(), pillarimg);
}
function render(){
    renderingContext.clearRect(0, 0, 380, 430);
    cityFront.draw(renderingContext, frontx, fronty-70, cityFront.calcWidth(500), 500);
    cityFront.draw(renderingContext, frontx+cityFront.calcWidth(500), fronty-70, cityFront.calcWidth(500), 500);
    cityBack.draw(renderingContext, backx, backy-500, cityBack.calcWidth(1000),1000);

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
    }
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