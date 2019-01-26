window.onload = function() {
    var canvas = document.getElementById("c"),
        c = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        key = [];
        pause = false,
        score = 0,
        lives = 3,
        gameover = false;
        scene = 0;
    

    //Key handling
    document.addEventListener("keydown", function(e){
        key[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e){
        delete key[e.keyCode];
    });

    RIGHT = 39;
    UP = 38;
    DOWN = 40;
    LEFT = 37;
    SPACE = 32;
    Q = 81;
    ENTER = 13;
    
    //sprites
    loaded = 0;
    sprites =[];
    sprites[0] = new Image();
    sprites[0].src = "paddle.jpg"
    sprites[1] = new Image();
    sprites[1].src = "ball.png"
    sprites[2] = new Image();
    sprites[2].src = "brick.png"
    
    for(var i=0; i<sprites.length; i++){
        sprites[i].onload = function(){
            loaded++;
            if(loaded == 3){
                run();
            }
        }
        
    }
    
    
    //game objects
    player = {
        sprite:sprites[0], 
        x: width/2 -32,
        y: height - 32,
        width:104,
        height:32, 
        update: function(){
            if(key[RIGHT]){
                this.x += 4;
            }
            if(key[LEFT]){
                this.x -= 4;
            }
            if(this.x <= 0){this.x = 0;}
            if(this.x >= width - this.width){this.x = width - this.width;}

        },
        render:function(){
            //c.strokeRect(this.x,this.y,64,16);
          c.drawImage(this.sprite,this.x-64,this.y-16);
        }
    };
     
    ball = {
        sprite:sprites[1], 
        x:player.x+32,
        y:player.y-16,
        dx:2,
        dy:2,
        width:22,
        height:22,
        holding:true,
        update:function(){
            if(this.holding){
                this.x = player.x+32;
                this.y = player.y-this.height-4 ;
                if(key[SPACE]){
                    this.holding = false;
                }

            }else{
                this.x += this.dx;
                this.y += this.dy;
                //collision
                if(this.y >= player.y-this.height && (this.x >= player.x && this.x <= player.x+player.width) && this.y < player.y+player.height){
                    this.dy = -this.dy;
                }
                if(this.y <= 0){
                    this.dy = -this.dy;
                }
                if(this.x <= 0 || this.x >= width-this.width ){
                    this.dx = -this.dx;
                }
                if(this.y > height + this.height ){
                    this.holding = true;
                    lives--;
                }
            }
        },
        render:function(){
            c.drawImage(this.sprite,this.x,this.y);
//            c.beginPath();
//            c.arc(this.x,this.y,8,0,Math.PI*2);
//            c.stroke();
        }
    }
    
    brick = [];
    for(var i=0; i<8; i++){
        brick[i] = new Array();
        for(var j=0; j<4; j++){
        brick[i][j] = {
                sprite:sprites[2],
                x: 64+(i*64),
                y : 32+(j*32),
                width:64,
                height:32, 
                broken:false,
                update:function(){
                    if(!this.broken){
                        if(ball.y < this.y +this.height && ball.x > this.x-ball.width && ball.x < this.x +  this.width+ball.width && ball.y > this.y - ball.height){
                        ball.dy = -ball.dy;
                        this.broken = true;
                            score += 10;
                        }
                    }
                },
                render:function(){
                    if(!this.broken){
                        c.drawImage(this.sprite,this.x,this.y);
                        //c.strokeRect(this.x,this.y,64,32);
                    }
                }
          }
       }
    }
    //
    gameScene = {
      update:function(){
              player.update();
        ball.update();
        for(var i=0; i<8; i++){
            for(var j=0; j<4; j++){
            brick[i][j].update();}
        }
        if(lives<=0){
            gameover = true;
        }
        if(gameover){
            pause = true;        
        }
      },
      render:function(){
        c.fillStyle = "white";
        c.fillRect(0,0,width,height);
        c.fillStyle = "black";
        
        player.render();
        ball.render();
        for(var i=0; i<8; i++){
            for(var j=0; j<4; j++){
            brick[i][j].render();}
        }
        c.fillText("Score : " + score,16,16);
        c.fillText("Lives : " + lives,16,32);
        if(gameover){
            c.fillText("Game Over", width/2, height/2);
        }
        if(pause && !gameover){
            c.fillText("Game Paused", width/2, height/2);
        }
      }
    }
    
    mainMenuScene = {
        update:function(){
            if(key[ENTER]){
                scene = 1 ;
            }
        },
        render:function(){
            c.fillStyle = "white";
            c.fillRect(0,0,width,height);
            c.fillStyle ="black";
            c.fillText("BREAKOUT GAME",width/2-50,100);
            c.fillText("Press ENTER To Play",width/2-50 ,200);
        }
    }

    function run(){
        switch(scene){
                case 0:
                    gameover = false;
                    lives = 3;
                    score = 0;
                    mainMenuScene.update();
                    mainMenuScene.render();
                break;

                case 1:
                    if(!pause){
                        gameScene.update();
                    }
                    if(key[Q] && !gameover){
                        pause = !pause;
                    }
                     if(key[Q] && gameover){
                        scene = 0;
                    } 
                gameScene.render();
            break;
        }
        requestAnimationFrame(run);
    }

}
    