// target frames per second
const FPS = 50;

function Game(canvas) {
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');
    this.pixx = new Pixx(50, 50);
}

Game.prototype.loop = function()
{
    this.drawBackground();
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
}

Pixx.prototype.drawIt = function(ctx) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(this.x, this.y, 1, 1);
}

window.onload = init;
window.onresize = init;

function init()
{
    canvas = document.getElementById('canvas');
    var game = new Game(canvas);

	  window.runId = setInterval(function() { game.loop() }, 1000 / FPS);
}
