var mouse = {};
var aantalSterren = 10;
var speed = 2;
var rotate = 0;
var punten = 0;
var levens = 5;
var ctx;

// Bij initialisatie
function init() {
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    Update();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('canvas').style.cursor = "none";


}

// Muistracker
function trackPosition(pos) {
    mouse.x = pos.pageX;
    mouse.y = pos.pageY;
}
document.addEventListener("mousemove", trackPosition, true);

// Eigenschappen definiëren van de heks 
function heks(x, y, w, h) {
    this.heksX = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.Draw = function (ctx) {
        var img = new Image();
        img.src = "images/witch.png";
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
    };
}

// Eigenschappen van de ster definiëren
function ster(x, y, w, h, vx, vy) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.Draw = function (ctx) {
        var img = new Image();
        img.src = "images/star.png";
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(rotate*Math.PI/180);
        ctx.drawImage(img, -(this.w/2), -(this.h/2), this.w, this.h);
        ctx.restore();
    };
}

// Aanmaken van de heks en een aantal sterren
var h1 = new heks(window.innerWidth / 2, window.innerHeight / 2, 50, 50);
var sterren = [];
for (i = 0; i < aantalSterren; i++) {
    sterren[i] = new ster(
        Math.floor(Math.random() * (window.innerWidth - 50)), Math.floor(Math.random() * 50),
        50,
        50,
        (Math.random() - 0.5) * speed,
        Math.random() * speed);
}

// Nieuwe ster aanmaken als er een ster gegrepen wordt met de cursor
// https://forums.adobe.com/thread/1865523
function collide(heks, ster) {
    if (heks.x < ster.x + ster.w && heks.x + heks.w > ster.x && heks.y < ster.y + ster.h && heks.y + heks.h > ster.y) {
        ster.x = Math.floor(Math.random() * (window.innerWidth - 50));
        ster.y = Math.floor(Math.random() * 50);
        ster.vx = (Math.random() - 0.5) * speed;
        ster.vy = Math.random() * speed
        punten++;
    }
}


function Update() {
    //leegmaken canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    rotate++;
    if (levens > 0 && punten < 50) {
        // Tekenen van de heks + sterren
        h1.Draw(ctx);
        for (i = 0; i < aantalSterren; i++) {
            sterren[i].Draw(ctx);
        }
        // Tekenen scoreboard
        // https://www.w3schools.com/graphics/canvas_text.asp
        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText("Levens : " + levens, 10, 20);
        ctx.fillText("Punten : " + punten, 10, 40);
       
        // Wat er wordt geupdated
        // Heks volgt de cursor ( muis )
        if (mouse.x && mouse.y) {
            h1.x = mouse.x - h1.w / 2;
            h1.y = mouse.y - h1.h / 2;
        }

        // Sterren laten bewegen met bepaalde snelheidsfactor
        for (i = 0; i < aantalSterren; i++) {
            sterren[i].x += sterren[i].vx;
            sterren[i].y += sterren[i].vy;
        }

        for (i = 0; i < aantalSterren; i++) {

            // Controle of de sterren uit het scherm gaan
            if (sterren[i].x > window.innerWidth - sterren[i].w || sterren[i].x < 0) {
                sterren[i].vx *= -1
            }
            
            // Controle als de sterren de grond aanraken
            if (sterren[i].y > window.innerHeight - sterren[i].h) {
                sterren[i].x = Math.floor(Math.random() * (window.innerWidth - 50));
                sterren[i].y = Math.floor(Math.random() * 50);
                sterren[i].vx = (Math.random() - 0.5) * speed;
                sterren[i].vy = Math.random() * speed;
                levens--;
            }
        }

        // Collision detection
        for (i = 0; i < aantalSterren; i++) {
            collide(h1, sterren[i])
        }

        // Timer
        setTimeout(Update, 1);
    } else {

        // Tekenen van button
        document.getElementById('canvas').style.cursor = "default";
        var button = document.querySelector("button");
        button.style.display = "inline";
        button.style.top = (window.innerHeight / 2) + 100 + "px";
        button.style.left = (window.innerWidth / 2) - 50 + "px";
        button.onclick = function () {
            Herstarten()
        };

        function Herstarten() {
            
            rotate=0;
            location.reload();
           
        }
    }
   
    // Scherm voor gewonnen
    // https://www.w3schools.com/graphics/canvas_text.asp
    if (punten >= 50) {
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 5;
        ctx.strokeRect((window.innerWidth / 2) - 275, (window.innerHeight / 2) - 75, 550, 150);
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText("Gewonnen !", (window.innerWidth / 2), (window.innerHeight / 2));
        //Button kleur geven
        button.style.backgroundColor = "#00FF00";
        button.style.borderColor = "#00FF00";
    }
     // Scherm voor verloren
    // https://www.w3schools.com/graphics/canvas_text.asp
    if (levens <= 0) {
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 5;
        ctx.strokeRect((window.innerWidth / 2) - 275, (window.innerHeight / 2) - 75, 550, 150);
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game over !", (window.innerWidth / 2), (window.innerHeight / 2));
        //Button kleur geven
        button.style.backgroundColor = "#FF0000";
        button.style.borderColor = "#FF0000";
    }
}
