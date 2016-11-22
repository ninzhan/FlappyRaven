/**
 * Created by Joseph on 11/14/16.
 */
var headSprite, cityBack, cityFront, ravenimages, pillarimg, numbers, restartImg, testimages;

var images = [];
var locations = ["sheet.png", "city_backgrounds/city_background_clean.png", "city_backgrounds/city_background_night.png", "Industrial-TileSheet.png", "raven.png", "sheetdf.png", "restart.png"];

function Sprite(image, x, y, width, height){
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}
Sprite.prototype.draw = function(renderingContext, x, y, width, height){
    if(width == "default"){
        width = this.width;
    }
    if(height == "default"){
        height = this.height;
    }
    renderingContext.drawImage(this.image, this.x, this.y, this.width, this.height, x, y, width, height);
};
Sprite.prototype.calcHeight = function(width){
    var ratio = this.height/this.width;
    return Math.floor(ratio) * width;
};
Sprite.prototype.calcWidth = function(height){
    var ratio = this.width/this.height;
    return Math.floor(ratio) * height;
};
function loadImages(callback, location){
    console.log(location);
    var imageBuffer = new Image();
    imageBuffer.src = locations[location];
    imageBuffer.onload = function(){
        images[location] = this;
        if(location >= locations.length-1){
            callback();
        }else{
            location++;
            loadImages(callback, location);
        }
    }
}
function initSprites(){
    headSprite = [
        new Sprite(images[0], 0, 0, 103, 89),
        new Sprite(images[0], 103, 0, 103, 89),
        new Sprite(images[0], 206, 0, 103, 89),
        new Sprite(images[0], 0, 89, 103, 89),
        new Sprite(images[0], 103, 89, 103, 89),
        new Sprite(images[0], 206, 89, 103, 89)
    ];
    cityBack = new Sprite(images[1], 0, 0, 8192, 1024);
    cityFront = new Sprite(images[2], 0, 0, 8192, 1024);
    pillarimg = new Sprite(images[3], 0, 32, 32, 191);
    restartImg = new Sprite(images[6], 0, 0, 200, 40);

    ravenimages = [
        new Sprite(images[4], 0, 300, 100, 80),
        new Sprite(images[4], 100, 300, 100, 80),
        new Sprite(images[4], 200, 300, 100, 80),
        new Sprite(images[4], 300, 300, 100, 80)
    ];
    // testimages = [
    //     new Sprite(images[4], 0, 0, 100, 100),
    //     new Sprite(images[4], 0, 0, 100, 100),
    //     new Sprite(images[4], 0, 0, 100, 100),
    //     new Sprite(images[4], 0, 0, 100, 100)
    // ];
    numbers = [
        new Sprite(images[5], 0, 0, 35, 53),
        new Sprite(images[5], 36, 0, 24, 53),
        new Sprite(images[5], 60, 0, 30, 53),
        new Sprite(images[5], 90, 0, 30, 53),
        new Sprite(images[5], 120, 0, 35, 53),
        new Sprite(images[5], 155, 0, 33, 53),
        new Sprite(images[5], 188, 0, 35, 53),
        new Sprite(images[5], 222, 0, 35, 53),
        new Sprite(images[5], 256, 0, 35, 53),
        new Sprite(images[5], 290, 0, 40, 53)
    ];
}