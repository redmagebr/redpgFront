$('head').append('<link rel="stylesheet" type="text/css" media="all" href="css/events/christmas.css">');

window.app.chatapp.onopen2 = window.app.chatapp.onopen;

window.app.chatapp.onopen = function (event) {
    var videos = [
        "http://www.youtube.com/watch?v=lX4Ibq1WDT8", "http://www.youtube.com/watch?v=ogetBqMgau0", 
        "http://www.youtube.com/watch?v=xpJLfs8uoBk", "http://www.youtube.com/watch?v=I6zK7I2OocI",
        "http://www.youtube.com/watch?v=RUnjQgEDgb4", "http://www.youtube.com/watch?v=RLxX5vfOccc",
        "http://www.youtube.com/watch?v=_zCsFvVg0UY", "http://www.youtube.com/watch?v=xL4DbMAe-d0",
        "http://www.youtube.com/watch?v=lRdtOHSGSNY", "http://www.youtube.com/watch?v=CGObre0m3Ik",
        "http://www.youtube.com/watch?v=RK0jxFk_pxU", "http://www.youtube.com/watch?v=nsLCcsI5HL4",
        "http://www.youtube.com/watch?v=3ydhQnFtDpU", "http://www.youtube.com/watch?v=Qefe5zgQfn4",
        "http://www.youtube.com/watch?v=wBZ9VGaspo8"
    ];
    
    var id = window.app.ui.youtubeui.parseUrl(videos[Math.floor(Math.random() * videos.length)]);
    window.app.ui.youtubeui.play(id, true, false);
    
    this.onopen2 (event);
};

// http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect

$('body').append('<canvas id="snowCanvas"></canvas>');

var canvas = document.getElementById("snowCanvas");
var ctx = canvas.getContext("2d");

//canvas dimensions
var W = window.innerWidth;
var H = window.innerHeight;
canvas.width = W;
canvas.height = H;

//snowflake particles
var mp = 50; //max particles
var particles = [];
for(var i = 0; i < mp; i++)
{
        particles.push({
                x: Math.random()*W, //x-coordinate
                y: Math.random()*H, //y-coordinate
                r: Math.random()*4+1, //radius
                d: Math.random()*mp //density
        })
}

//Lets draw the flakes
function draw()
{
        ctx.clearRect(0, 0, W, H);

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        for(var i = 0; i < mp; i++)
        {
                var p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
        }
        ctx.fill();
        update();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;
function update()
{
        angle += 0.01;
        for(var i = 0; i < mp; i++)
        {
                var p = particles[i];
                //Updating X and Y coordinates
                //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
                //Every particle has its own density which can be used to make the downward movement different for each flake
                //Lets make it more random by adding in the radius
                p.y += Math.cos(angle+p.d) + 1 + p.r/2;
                p.x += Math.sin(angle) * 2;

                //Sending flakes back from the top when it exits
                //Lets make it a bit more organic and let flakes enter from the left and right also.
                if(p.x > W+5 || p.x < -5 || p.y > H)
                {
                        if(i%3 > 0) //66.67% of the flakes
                        {
                                particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
                        }
                        else
                        {
                                //If the flake is exitting from the right
                                if(Math.sin(angle) > 0)
                                {
                                        //Enter from the left
                                        particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
                                }
                                else
                                {
                                        //Enter from the right
                                        particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
                                }
                        }
                }
        }
}

//animation loop
setInterval(draw, 33);