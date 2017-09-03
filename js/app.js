//迷之数字
var distanceX = 101,
    distanceY = 82;
// 这是我们的玩家要躲避的敌人 
var Enemy = function(x,y,v) {
    this.x = x;
    this.y = y;
    this.v = v;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt*this.v;
    if (this.x >= 5*distanceX) {
        this.x = -distanceX;
        this.v = Math.floor(Math.random()*200+300);//调整虫子速度
        if (this.y < distanceY*3-20) {
            this.y += distanceY;
        }else{
            this.y = distanceY-20;
        }
    }
   
};



// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// 现在实现你自己的玩家类
var Player = function() {
    // 要应用到玩家的实例的变量写在这里
    this.x = 2*distanceX;
    this.y = 5*distanceY-6;

    
    this.sprite = 'images/char-boy.png';
};
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
Player.prototype.update = function () {//虫子撞人,分值为0
    for (var i = 0; i < allEnemies.length; i++) { 
        if (Math.abs(this.x-allEnemies[i].x) <50) {
            if (Math.abs(this.y-allEnemies[i].y) < 41) {
                this.y = 5*distanceY-6;
                num--;//碰到虫子则生命值减1
                heartNum.innerHTML = num;
                if (!num) {//如果生命值为0，则分值归零，重新开始
                    score = 0;
                    scoreNode.innerHTML = score;
                    num = 1;
                    heartNum.innerHTML = num;
                }
                
            }
        }
    }

}
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function (e) {

    switch (e){
        case 'left' : if (this.x > 0) {
            this.x -= distanceX;
        } ;
            break;
        case 'up' : if (this.y > 50) {
            this.y -= distanceY;
        }else{  //到河里之后再按向上的键就回原点,分数加100
            score += 100;
            scoreNode.innerHTML = score;
            this.y = 404;
            this.x = 2*distanceX;
            //更新maxScore的值
            if (score > maxScore) {
                maxScore = score;
                maxScoreNode.innerHTML = maxScore;
            
            }
            //对每块石头调用更新石头的X坐标
            for (var i = 0; i < allRocks.length; i++) {
                allRocks[i].changeX();
            }
            //对每块宝石调用更新宝石的X坐标
            for (var i = 0; i < allGems.length; i++) {
                allGems[i].changeX();
            }
            //更新爱心的位置
            heart.changeXY();
        } ;        
            break;
        case 'right' : if (this.x < 4*distanceX) {
            this.x += distanceX;
        } ;
            break;
        default : if (this.y < 404) {
            this.y += distanceY;
        } ;
    }
}
//石头类
var Rock = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Rock.png';
}
//随机改变石头的X坐标
Rock.prototype.changeX = function () {
    this.x = distanceX * Math.floor(Math.random()*5); 
}
Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//宝石类
var Gem = function (x,y,sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}
//碰到宝石，宝石消失,蓝色加200分，绿色加300分，黄色加500分
Gem.prototype.update = function () {
    if (this.x - player.x == 15) {
        if (this.y - player.y == 18) {
            this.x = -101;
            this.addScore();
            scoreNode.innerHTML = score;
        }
    }
}
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,70,120);
}
Gem.prototype.changeX = function () {
    this.x = distanceX * Math.floor(Math.random()*5)+15;
    //如果宝石跟石头的位置重合，宝石向右移动一格
    for (var i = 0; i < allRocks.length; i++) {
        if (this.x - allRocks[i].x == 15) {
            if (this.y - allRocks[i].y == 32) {
                this.x += distanceX;
            }
        }
        
    }
}
var Heart = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
}
//随机改变爱心的位置
Heart.prototype.changeXY = function () {
    this.x = distanceX * Math.floor(Math.random()*15)+15; 
    this.y = distanceY * (Math.floor(Math.random()*3)+1)+24;
    //如果爱心跟石头或者宝石的位置重合，爱心移除画布
    for (var i = 0; i < allRocks.length; i++) {
        if (this.x - allRocks[i].x == 15 && this.y - allRocks[i].y == 44 ) {
            this.x += distanceX*6+15;            
        }         
    }
    for (var i = 0; i < allGems.length; i++) {
        if (this.x == allGems[i].x && this.y - allGems[i].y ==12) {
            this.x += distanceX*6+15;
        }
    }
}
//碰到爱心，爱心消失
Heart.prototype.update = function () {
    if (this.x - player.x == 15) {
        if (this.y - player.y == 30) {
            this.x = -101;
            num++;
            heartNum.innerHTML = num;
        }
    }
}
Heart.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,70,120);
}
// 现在实例化你的所有对象
var enemy1 = new Enemy(-100,distanceY-20,300);
var enemy2 = new Enemy(-600,distanceY*2-20,400);
var enemy3 = new Enemy(-300,distanceY*3-20,500)
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [enemy1,enemy2,enemy3];
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();
//把石头放进一个叫rock的变量里
var rock1 = new Rock(distanceX,distanceY*3-20);
var rock2 = new Rock(2*distanceX,distanceY-20);
var rock3 = new Rock(3*distanceX,distanceY*2-20);
//把所有石头的对象都放进一个叫 allRocks 的数组里面
var allRocks = [rock1,rock2,rock3];
//实例化宝石，放在数组里
var gemBlue = new Gem(distanceX+15  ,distanceY+12,'images/Gem Blue.png');
var gemGreen = new Gem(distanceX+15  ,distanceY*2+12,'images/Gem Green.png');
var gemOrange = new Gem(distanceX*2+15  ,distanceY*3+12,'images/Gem Orange.png');
var allGems = [gemBlue,gemGreen,gemOrange];
var heart = new Heart();
//设置碰到宝石加分的分值
gemBlue.addScore =function () {
    score += 500;
}
gemGreen.addScore =function () {
    score += 300;
}
gemOrange.addScore =function () {
    score += 200;
}
// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var check = checkRocks(allowedKeys[e.keyCode]);
    if (check){
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

//碰到石头不能走
function checkRocks(e) {
    var check = true;
    for (var i = 0; i < allRocks.length; i++) {
        switch (e){
            case 'left' : if (player.x - allRocks[i].x == distanceX) {
                if (player.y - allRocks[i].y == 14) {
                    check = false;
                }

                } ;
                break;
            case 'up' : if (player.y - allRocks[i].y == 96) {
                if (player.x == allRocks[i].x) {
                    check = false;
                }

            } ;
            break;
            case 'right' : if (allRocks[i].x - player.x == distanceX) {
            if (player.y - allRocks[i].y == 14) {
                    check = false;
            }
            
        } ;
            break;
            default : if (allRocks[i].y - player.y == 68) {
                if (player.x == allRocks[i].x) {
                    check = false;
                }

            } ;
        }       
    }
    return check;
}

//过河后回到起点，并加分
var scoreNode = document.getElementById('score');
var score = 0;
var maxScoreNode = document.getElementById('maxScore');
var maxScore = 0;
var heartNum = document.getElementById('heartNum');
var num = 1;
//更换玩家
var playerList = document.getElementsByTagName('img');
for (var i = 0; i < playerList.length; i++) {
    playerList[i].onclick = function () {
        player.sprite = this.getAttribute('src');

    }
}




