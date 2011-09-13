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
    this.highscore = 0;

    var keyDown = function(e) {
        if (self.onTitleScreen) {
            if (e.keyCode === 67) {
                self.onTitleScreen = false;
                return false;
            } else {
                return true;
            }
        }

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
        if (self.onTitleScreen) return true;

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

    this.resetLevel = function() {
        this.pixx = new Pixx(50, 400);
        this.enemies = [new Enemy({ xstart: 280, xend: 320, y: 400, speed: 1, size: 10}),
                        new Enemy({ xstart: 350, xend: 450, y: 450, speed: 2, size: 15})];
    };

    this.init = function() {
        var makePointBalls = function() {
            var balls = [];
            for (var x=310; x<=490; x+=10) {
               balls.push({x: x, y: 449, size: 2});
            }
            return balls;
        };

        this.platforms = [{ x: 50, y: 450, width: 200 },
                          { x: 280, y: 400, width: 40 },
                          // ground:
                          { x: 0, y: 480, width: 640 },
                          { x: 300, y: 450, width: 200, blocking: true },
                          { x: 600, y: 460, width: 40, blocking: true }];
        this.pointBalls = makePointBalls();
        this.points = 0;
        this.lives = 3;
        this.resetLevel();
        this.onTitleScreen = true;
    };

    this.init();
}

Game.prototype.loop = function()
{
    if (this.onTitleScreen) {
        this.drawTitle();
    } else {
        this.drawGame();
    }
};

Game.prototype.drawTitle = function() {
    this.drawBackground();
    this.drawHighscore();
    this.context2D.fillStyle = "#aaa";
    this.context2D.textBaseline = 'top';
    this.context2D.textAlign = 'center';
    this.context2D.font = 'bold 24px courier new';
    this.context2D.fillText("Pixx Pixel in Line Land", this.canvas.width / 2, this.canvas.height / 3);
    this.context2D.font = 'bold 18px courier new';
    this.context2D.fillText("Push 'c' to start", this.canvas.width / 2, (this.canvas.height*2) / 3);
};

Game.prototype.drawGame = function() {
    this.drawBackground();
    this.drawPlatforms();
    this.pixx.update(this.platforms);

    for (var i=this.pointBalls.length-1; i>=0; i--) {
        var ball = this.pointBalls[i];
        if (this.pixx.isHit(ball)) {
            this.pointBalls.splice(i, 1);
            this.points += 1;
        }
    }

    this.drawPointballs();
    this.pixx.drawIt(this.context2D);

    for (var i=0; i<this.enemies.length; i++) {
        var enemy = this.enemies[i];
        enemy.update();
        enemy.drawIt(this.context2D);
        if (this.pixx.isHit(enemy)) {
            this.lives -= 1;
            if (this.lives === 0) {
                if (this.points > this.highscore) {
                    this.highscore = this.points;
                }
                this.init();
            } else {
                this.resetLevel();
            }
        }
    }

    this.drawPoints();
    this.drawLives();
    this.drawHighscore();
}

Game.prototype.drawPointballs = function() {
    for (var i=0; i<this.pointBalls.length; i++) {
        var ball = this.pointBalls[i];
        this.context2D.fillStyle = "#00f";
        this.context2D.fillRect(ball.x, ball.y-ball.size, ball.size, ball.size);
    }
};

Game.prototype.drawPoints = function() {
    var pad = function(number, digits) {
        var str = '' + number;
        while (str.length < digits) {
            str = '0' + str;
        }
        return str;
    };

    this.context2D.fillStyle = "#aaa";
    this.context2D.textBaseline = 'top';
    this.context2D.textAlign = 'right';
    this.context2D.font = 'bold 24px courier new';
    var margin = 10;
    this.context2D.fillText(pad(this.points, 6),
                            this.canvas.width - margin, margin);
};

Game.prototype.drawHighscore = function() {
    var pad = function(number, digits) {
        var str = '' + number;
        while (str.length < digits) {
            str = '0' + str;
        }
        return str;
    };

    this.context2D.fillStyle = "#555";
    this.context2D.textBaseline = 'top';
    this.context2D.textAlign = 'center';
    this.context2D.font = 'bold 24px courier new';
    var margin = 10;
    this.context2D.fillText(pad(this.highscore, 6), this.canvas.width / 2, margin);
};

Game.prototype.drawLives = function() {
    this.context2D.fillStyle = "#aaa";
    this.context2D.textBaseline = 'top';
    this.context2D.textAlign = 'left';
    this.context2D.font = 'bold 24px courier new';
    var margin = 10;
    this.context2D.fillText(this.lives, margin, margin);
};

Pixx.prototype.isHit = function(target) {
    if ((this.x + this.size) > target.x &&
        this.x < (target.x + target.size) &&
        this.y  > (target.y - target.size) &&
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

function init()
{
    canvas = document.getElementById('canvas');
    var game = new Game(canvas);

	  window.runId = setInterval(function() { game.loop() }, 1000 / FPS);
}
