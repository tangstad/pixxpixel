// target frames per second
const FPS = 50;

function Enemy(startState) {
    this.x = startState.xstart;
    this.going_right = true;

    // TODO: find better name than state for permanent attributes
    this.state = startState;
    this.size = startState.size;
    this.y = startState.y;
}

Enemy.prototype.update = function() {
    if (this.going_right) {
        this.x += this.state.speed;
        if (this.x >= (this.state.xend - this.state.size)) {
            this.x = (this.state.xend - this.state.size);
            this.going_right = false;
        }
    } else {
        this.x -= this.state.speed;
        if (this.x <= this.state.xstart)
        {
            this.x = this.state.xstart;
            this.going_right = true;
        }
    }
};

Enemy.prototype.drawIt = function(ctx) {
    ctx.fillStyle = "#f55";
    ctx.fillRect(this.x, this.state.y-this.state.size, this.state.size, this.state.size);
};

function Game(canvas) {
    var self = this;
    this.canvas = canvas;
    this.context2D = canvas.getContext('2d');

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
            self.pixx.noleft();
            return false;
        } else if (e.keyCode === 67) {
            // 'c'
            self.pixx.stopJump();
            return false;
        } else if (e.keyCode === 39) {
            self.pixx.noright();
            return false;
        }
        return true;
    }

    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    this.init = function() {
        this.pixx = new Pixx(50, 400);
        this.enemies = [new Enemy({ xstart: 280, xend: 320, y: 400, speed: 1, size: 10}),
                        new Enemy({ xstart: 350, xend: 450, y: 450, speed: 2, size: 15})];
        this.platforms = [{ x: 50, y: 450, width: 200 },
                          { x: 280, y: 400, width: 40 },
                          // ground:
                          { x: 0, y: 480, width: 640 },
                          { x: 300, y: 450, width: 200, blocking: true },
                          { x: 600, y: 460, width: 40, blocking: true }];
    };

    this.init();
}

Game.prototype.loop = function()
{
    this.drawBackground();
    this.drawPlatforms();
    this.pixx.update(this.platforms);
    this.pixx.drawIt(this.context2D);

    for (var i=0; i<this.enemies.length; i++) {
        var enemy = this.enemies[i];
        enemy.update();
        enemy.drawIt(this.context2D);
        if (this.pixx.isHit(enemy)) {
            this.init();
        }
    }
}

Pixx.prototype.isHit = function(target) {
    if (this.x > (target.x - target.size) &&
        (this.x - this.size) < target.x &&
        this.y > (target.y - target.size) &&
        (this.y - this.size) < target.y) {
        return true;
    } else {
        return false;
    }
};

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

function Direction() {}
Direction.NONE = 0;
Direction.LEFT = 1;
Direction.RIGHT = 2;

Pixx.prototype.left = function() {
    this.speed = -4;
}

Pixx.prototype.noright = function() {
    if (this.speed > 0)
    {
        this.speed = 0;
    }
}

Pixx.prototype.noleft = function() {
    if (this.speed < 0)
    {
        this.speed = 0;
    }
}

Pixx.prototype.right = function() {
    this.speed = 4;
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

        var x_inside = (this.x >= (platform.x - this.size) &&
                        this.x <= (platform.x + platform.width));
        if (x_inside) {
            var from_top = (oldy <= platform.y && this.y >= platform.y);
            var from_bottom = (oldy >= (platform.y + this.size) &&
                              this.y <= (platform.y + this.size));
            if (from_top) {
                this.y = platform.y;
                this.onground = true;
                this.yspeed = 0;
            } else if (platform.blocking && from_bottom) {
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
