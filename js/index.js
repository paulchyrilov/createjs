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
        {src: "sprite.png", id: "wave.sprite"}
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
        frames: { width: 64, height: 64},
        animations: {
            idle: [ 0, 2, 'idle', 0.05 ],
            run: {frames: [3,4,5,4],
                next: "run",
                speed: 0.08
            },
            stop: [ 5, 5, 'idle', 1 ],
            jump: [ 6, 7, 'idle', 0.08 ],
            jumpAndRun: [ 6, 7, 'run', 0.08 ]
        }
    });

    animation = new createjs.Sprite(spriteSheet);
    animation.gotoAndPlay('idle');
    animation.speed = 3;

    animation.moveleft = function(){
        if(this.moving) {
            return;
        }
        this.moving = true;
        if (this.scaleX > 0) {
            this.scaleX *= -1;
            this.x += this.getBounds().width;
        }
        this.gotoAndPlay('run');
    };
    animation.moveright = function(){
        if(this.moving) {
            return;
        }
        this.moving = true;
        if (this.scaleX < 0) {
            this.scaleX *= -1;
            this.x -= this.getBounds().width;
        }
        this.gotoAndPlay('run');
    };
    animation.stop = function(){
        if(!this.moving) {
            return;
        }
        this.moving = false;
        this.gotoAndPlay('stop');
    };
    animation.jump = function(){
        if(this.jumping) {
            return;
        }
        this.jumping = true;
        if(this.moving) {
            this.gotoAndPlay('jumpAndRun')
        } else {
            this.gotoAndPlay('jump');
        }
    };
    animation.checkAndMove = function(dx) {
        if(!this.moving) {
            return;
        }
        dx *= this.speed;
        var direction = 1;
        if (this.scaleX < 0) {
            direction = -1;
        }
        var newPosition = this.x + direction * (this.getBounds().width + dx)
        if(newPosition > w || newPosition < 0) {
            return;
        }
        this.x += dx * direction;
    };

    stage.addChild(animation);

    document.onkeydown = function(e){
        switch (e.keyCode) {
            case 87:  // W
                animation.jump();
                break;
            case 65:  // A
                animation.moveleft();
                break;
            case 68:  // D
                animation.moveright();
                break;
        }
    };

    document.onkeyup = function(e){
        switch (e.keyCode) {
            case 65:  // A
            case 68:  // D
                animation.stop();
                break;
            case 87:  // W
                animation.jumping = false;

        }
    };

    if(typeof requestAnimationFrame == 'function') {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
    }
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {

    var dx = event.delta / 50;

    animation.checkAndMove(dx);

    animation.on('click', function(){
       this.gotoAndPlay('jump');
    });

    stage.update(event);
}