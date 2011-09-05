// target frames per second
const FPS = 50;

function Game(canvas) {
    var self = this;
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');
    this.pixx = new Pixx(50, 400);

    var keyDown = function(e) {
        if (e.keyCode === 37) {
            self.pixx.left();
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
    this.pixx.update();
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
}

Pixx.prototype.drawIt = function(ctx) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(this.x, this.y, 2, 2);
}

Pixx.prototype.left = function() {
    this.speed -= 4;
}

Pixx.prototype.right = function() {
    this.speed += 4;
}

Pixx.prototype.update = function() {
    this.x += this.speed;
    if (this.y < 480) {
        this.y += 5;
        if (this.y > 479) {
            this.y = 479;
        }
    }
    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > 640) {
        this.x = 640;
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
