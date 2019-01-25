window.onload = function() {
    var canvas = document.getElementById("g"),
        c = canvas.getContext("2d"),
        height = canvas.height,
        width = canvas.width,
        key = [];
    

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

    player = {
        x: width/2 -32,
        y: height - 8,
        update: function(){
            if(key[RIGHT]){
                this.x += 4;
            }
            if(key[LEFT]){
                this.x -= 4;
            }

        },
        render: function(){
            c.strokeRect(this.x,this.y,64,16);
        }
     }

     //
    function update(){
        player.update();
    }
    function render(){
        c.fillStyle = "white";
        c.fillRect(0,0,width,height);
        c.fillStyle = "black";
        
        player.render();
    }

    function run(){
        update();
        render();
        requestAnimationFrame(run);
    }

    run();
    
} 