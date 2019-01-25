window.onload = function() {
    var canvas = document.getElementById("c"),
        c = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        key = [];
        pause = false,
        score = 0,
        lives = 3;
        
    

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
    //game objects
    player = {
        x: width/2 -32,
        y: height - 32,
        update: function(){
            if(key[RIGHT]){
                this.x += 4;
            }
            if(key[LEFT]){
                this.x -= 4;
            }
            if(this.x <= 0){this.x = 0;}
            if(this.x >= width - 64){this.x = width - 64;}

        },
        render: function(){
            c.strokeRect(this.x,this.y,64,16);
        }
    };
     
    ball = {
        x:player.x+32,
        y:player.y-16,
        dx:2,
        dy:2,
        ray:8,
        holding:true,
        update:function(){
            if(this.holding){
                this.x = player.x+32;
                this.y = player.y-16;
                if(key[SPACE]){
                    this.holding = false;
                }

            }else{
                this.x += this.dx;
                this.y += this.dy;
                //collision
                if(this.y >= player.y-this.ray && (this.x >= player.x && this.x <= player.x+64) && this.y < player.y+32){
                    this.dy = -this.dy;
                }
                if(this.y <= this.ray){
                    this.dy = -this.dy;
                }
                if(this.x <= -this.ray || this.x >= width-this.ray){
                    this.dx = -this.dx;
                }
                if(this.y > height + this.ray){
                    this.holding = true;
                    lives--;
                }
            }
        },
        render:function(){
            c.beginPath();
                c.arc(this.x,this.y,8,0,Math.PI*2);
            c.stroke();
        }
    }
    
    brick = [];
    for(var i=0; i<8; i++){
        brick[i] = {
            x: 64+(i*64),
            y : 32,
            broken:false,
            update:function(){
                if(!this.broken){
                    if(ball.y < this.y +32+ball.ray  && ball.x > this.x-ball.ray && ball.x < this.x + 64+ball.ray && ball.y > this.y - ball.ray){
                    ball.dy = -ball.dy;
                    this.broken = true;
                        score += 10;
                    }
                }
            },
            render:function(){
                if(!this.broken){
                    c.strokeRect(this.x,this.y,64,32);
                }
            }
        }
    }
    //
    function update(){
        player.update();
        ball.update();
        for(var i=0; i<8; i++){
            brick[i].update();
        }
    }
    function render(){
        c.fillStyle = "white";
        c.fillRect(0,0,width,height);
        c.fillStyle = "black";
        
        player.render();
        ball.render();
         for(var i=0; i<8; i++){
            brick[i].render();
        }
        c.fillText("Score : " + score,16,16);
        c.fillText("Lives : " + lives,16,32);
    }

    function run(){
        if(!pause){
            update();
        }
        render();
        requestAnimationFrame(run);
    }

    run();
        
}
    