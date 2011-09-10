// target frames per second
const FPS = 50;

function Game(canvas) {
    var self = this;
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');
    this.pixx = new Pixx(50, 400);
    this.platforms = [{ x: 50, y: 450, width: 200 },
                      { x: 280, y: 400, width: 40 },
                      // ground:
                      { x: 0, y: 480, width: 640 },
                      { x: 300, y: 450, width: 200, blocking: true },
                      { x: 600, y: 460, width: 40, blocking: true }];

    var keyDown = function(e) {
        if (e.keyCode === 37) {
            self.pixx.left();
            return false;
        } else if (e.keyCode === 67) {
            // 'c'
            self.pixx.jump();
            return false;
        } else if (e.keyCode === 39) {
            self.pixx.right();
            return false;
        }
        return true;
    }

    var keyUp = function(e) {
        if (e.keyCode === 37) {
            self.pixx.right();
            return false;
        } else if (e.keyCode === 67) {
            // 'c'
            self.pixx.stopJump();
            return false;
        } else if (e.keyCode === 39) {
            self.pixx.left();
            return false;
        }
        return true;
    }

    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
}

Game.prototype.loop = function()
{
    this.drawBackground();
    this.drawPlatforms();
    this.pixx.update(this.platforms);
    this.pixx.drawIt(this.context2D);
}

Game.prototype.drawBackground = function()
{
    this.clearBackground();
    this.fillBackground('#111');
}

Game.prototype.clearBackground = function()
{
    this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Game.prototype.drawPlatforms = function()
{
    for (var i=0; i<this.platforms.length; i++) {
        var platform = this.platforms[i];
        this.context2D.fillStyle = platform.blocking ? "#aaa" : "#555";
        this.context2D.fillRect(platform.x, platform.y, platform.width, 1);
    }
}

Game.prototype.fillBackground = function(color)
{
    this.context2D.fillStyle = color;
    this.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

function Pixx(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.yspeed = 5;
    this.size = 4;
}

Pixx.prototype.drawIt = function(ctx) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(this.x, this.y-this.size, this.size, this.size);
}

Pixx.prototype.left = function() {
    this.speed -= 4;
}

Pixx.prototype.right = function() {
    this.speed += 4;
}

Pixx.prototype.jump = function() {
    if (this.onground) {
        this.yspeed = -Game.impulse;
    }
}

Pixx.prototype.stopJump = function() {
    if (this.yspeed < 0) {
        this.yspeed = 0;
    }
}

Pixx.prototype.update = function(platforms) {

    this.yspeed += Game.gravity;

    var oldy = this.y;
    this.x += this.speed;
    this.y += this.yspeed;

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > (640-this.size)) {
        this.x = (640-this.size);
    }

    this.onground = false;
    for (var i=0; i<platforms.length; i++) {
        var platform = platforms[i];
        if (this.x >= (platform.x - this.size) &&
            this.x <= (platform.x + platform.width)) {
            if (oldy <= platform.y && this.y >= platform.y) {
                this.y = platform.y;
                this.onground = true;
                this.yspeed = 0;
            } else if (platform.blocking &&
                       oldy >= (platform.y + this.size) &&
                       this.y <= (platform.y + this.size)) {
                this.y = platform.y + this.size;
                this.yspeed = 0;
            }
        }

    }
}

Game.gravity = 0.8;
Game.impulse = 10;

window.onload = init;
window.onresize = init;

function init()
{
    canvas = document.getElementById('canvas');
    var game = new Game(canvas);

	  window.runId = setInterval(function() { game.loop() }, 1000 / FPS);
}
