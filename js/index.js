/**
 * Created by paul on 22.01.16.
 */

(function() {

}());

var stage;
function init() {
    stage = new createjs.Stage(document.getElementById("gameCanvas"));


    manifest = [
        {src: "wave.png", id: "wave"},
        {src: "waves.png", id: "wave.sprite"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", loadComplete);
    loader.loadManifest(manifest, true, "images/");
}

function loadComplete() {
    var w = stage.canvas.width,
        h = stage.canvas.height;

    var background = new createjs.Shape();
    background.graphics.beginFill('#ffffff').drawRect(0,0,w,h);
    stage.addChild(background);

    spriteSheet = new createjs.SpriteSheet({
        images: [ loader.getResult("wave.sprite") ],
        frames: { width: 200, height: 200, count: 5 },
        animations: {
            idle: [ 0, 4, 'idle', 0.1 ]
        }
    });

    animation = new createjs.Sprite(spriteSheet);
    animation.gotoAndPlay('idle');

    stage.addChild(animation);

    var seaImg = loader.getResult("wave");
    sea = new createjs.Shape();
    sea.graphics.beginBitmapFill(seaImg).drawRect(0, 0, w + seaImg.width, seaImg.height);
    sea.tileW = seaImg.width;
    sea.y = h - 1.3*seaImg.height;
    sea.initialX = sea.x = -seaImg.width;
    sea.speed = 1;
    stage.addChild(sea);

    var dx = 50;

    sea2 = new createjs.Shape();
    sea2.graphics.beginBitmapFill(seaImg).drawRect(0, 0, w + seaImg.width + dx, seaImg.height);
    sea2.tileW = seaImg.width;
    sea2.y = h - seaImg.height;
    sea2.x = -(seaImg.width + dx);
    sea2.initialX = sea2.x;
    sea2.speed = 0.7;
    stage.addChild(sea2);

    sea.move = sea2.move = function(dx){
        if(this.x > this.initialX + this.tileW) {
            dx += this.initialX + this.tileW - this.x;
            this.x = this.initialX;
        }
        this.x += dx * this.speed;
    };

    if(typeof requestAnimationFrame == 'function') {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
    }
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {

    var dx = event.delta / 50;

    sea.move(dx);
    sea2.move(dx);

    stage.update(event);
}