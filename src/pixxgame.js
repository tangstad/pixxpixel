// target frames per second
const FPS = 50;

function Game(canvas) {
    var self = this;
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');
    this.pixx = new Pixx(50, 400);
    this.platform = { x: 50, y: 450, width: 200 };

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
    this.pixx.update(this.platform);
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
    ctx.fillRect(this.x, this.y, this.size, this.size);
}

Pixx.prototype.left = function() {
    this.speed -= 4;
}

Pixx.prototype.right = function() {
    this.speed += 4;
}

Pixx.prototype.jump = function() {
    if (!this.jumping) {
        this.yspeed = -10;
        this.jumping = true;
    }
}

Pixx.prototype.stopJump = function() {
    if (this.yspeed < 0) {
        this.yspeed = 0;
    }
}

Pixx.prototype.update = function(platform) {
    var oldy = this.y;
    this.x += this.speed;
    this.y += this.yspeed;

    if (this.x > platform.x && this.x < (platform.x + platform.width)) {
        if (oldy <= platform.y && this.y >= platform.y) {
            this.y = platform.y;
            this.jumping = false;
        }
    }

    if (this.yspeed < 5) {
        this.yspeed += 1;
    }

    if (this.y > (480-this.size)) {
        this.y = (480-this.size);
        if (this.jumping) {
            this.jumping = false;
        }
    }

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > (640-this.size)) {
        this.x = (640-this.size);
    }
}

window.onload = init;
window.onresize = init;

function init()
{
    canvas = document.getElementById('canvas');
    var game = new Game(canvas);

	  window.runId = setInterval(function() { game.loop() }, 1000 / FPS);
}
