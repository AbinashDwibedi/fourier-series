let canvas = document.getElementById("myCanvas");
const Epicycle = document.getElementById("Epicycle");
const EpicycleLabel = document.getElementById("EpicycleLabel");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = "#000";
const ctx = canvas.getContext("2d");

class Circles {
    constructor(
        xPos,
        yPos,
        numEpicycles,
        time,
        amplitude,
        color
    ) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color;
        this.numEpicycles = numEpicycles;
        this.time = time;
        this.amplitude = amplitude;
        this.waves = [];
    }

    drawGrid() {
        const gridSpacing = 50;
        const textPadding = 5;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.fillText(y, 10, y + textPadding);
        }
        for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.fillText(x, x + textPadding, 20);
        }
    }

    drawCircles(ctx) {
        let currentX = this.xPos;
        let currentY = this.yPos;
        for (let i = 0; i < this.numEpicycles; i++) {
            let n = 2 * i + 1;
            let radius = (4 / (n * Math.PI)) * this.amplitude;
            let prevX = currentX;
            let prevY = currentY;
            currentX += radius * Math.cos(n * this.time);
            currentY += radius * Math.sin(n * this.time);
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            ctx.closePath();
        }
        return { x: currentX, y: currentY };
    }

    animateCircles(ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.drawGrid();

        this.time += 0.025;

        let { x, y } = this.drawCircles(ctx);
        this.waves.unshift(y);

        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(x, y);
        ctx.lineTo(400, this.waves[0]);
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.translate(400, 0);
        for (let x = 0; x < this.waves.length; x++) {
            ctx.lineTo(x, this.waves[x]);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        if (this.waves.length > window.innerWidth - 400) {
            this.waves.pop();
        }
    }
}

let circles = new Circles(200, 300, 5, 0.1, 100, "blue");

Epicycle.addEventListener("input", () => {
    EpicycleLabel.textContent = parseInt(Epicycle.value);
    circles.numEpicycles = parseInt(Epicycle.value);
});

function animate() {
    circles.animateCircles(ctx);
    requestAnimationFrame(animate);
}
animate();
